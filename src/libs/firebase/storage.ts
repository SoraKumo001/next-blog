import {
  deleteObject,
  FirebaseStorage,
  ref,
  getDownloadURL,
  listAll,
  uploadBytes,
  UploadMetadata,
} from 'firebase/storage';
export const getAllFiles = async (storage: FirebaseStorage | undefined, path?: string) => {
  if (!storage) return [];
  const files: string[] = [];
  const list = await listAll(ref(storage, path));
  const promise = list.prefixes.map((p) =>
    getAllFiles(storage, p.fullPath).then((f) => files.push(...f))
  );
  await Promise.all(promise);
  return [...files, ...list.items.map((item) => item.fullPath)];
};
export const getFileList = async (storage: FirebaseStorage | undefined, path?: string) => {
  if (!storage) return [];
  const result = await listAll(ref(storage, path));
  return result.items.map((r) => r.name);
};

export const deleteFile = (storage: FirebaseStorage | undefined, path: string) => {
  if (!storage) return;
  return deleteObject(ref(storage, path));
};

export const deleteFiles = async (storage: FirebaseStorage | undefined, path: string) => {
  if (!storage) return [];
  const result = await listAll(ref(storage, path));
  return await Promise.all([
    ...result.items.map((item) => deleteObject(ref(storage, item.fullPath))),
  ]);
};
export const saveFile = async (
  storage: FirebaseStorage | undefined,
  path: string,
  data: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata
) => {
  if (!storage) return undefined;
  const storageRef = ref(storage, path);
  return uploadBytes(storageRef, data, metadata).then(
    async () => await getDownloadURL(storageRef).catch(() => undefined)
  );
};
