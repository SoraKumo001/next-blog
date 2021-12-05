import { StatType } from '@/hooks/useAction';
import { Firestore } from 'firebase/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
  UploadMetadata,
} from 'firebase/storage';
import { useCallback, useState } from 'react';
import { saveFireDoc } from '.';
export const useFireUpload = () => {
  const [state, setState] = useState<StatType>('idle');
  const dispatch = useCallback(
    async (
      storage: FirebaseStorage,
      path: string,
      data: Blob | Uint8Array | ArrayBuffer,
      metadata?: UploadMetadata
    ) => {
      setState('progress');
      const storageRef = ref(storage, path);
      const url = await uploadBytes(storageRef, data, metadata)
        .then(async () => await getDownloadURL(storageRef).catch(() => undefined))
        .catch(() => undefined);
      if (url) {
        setState('finished');
        return url;
      }
      setState('error');
      return undefined;
    },
    []
  );
  return { state, dispatch };
};

export const useFireSave = () => {
  const [state, setState] = useState<StatType>('idle');
  const dispatch = useCallback((store: Firestore, entity: Object) => {
    setState('progress');
    saveFireDoc(store, entity)
      .then(() => {
        setState('finished');
      })
      .catch(() => {
        setState('error');
      });
  }, []);
  return { state, dispatch };
};
