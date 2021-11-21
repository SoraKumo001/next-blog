import { deleteObject, FirebaseStorage, list, ref } from '@firebase/storage';
import {
  addDoc,
  collection,
  deleteDoc as delDoc,
  doc,
  endAt,
  FieldValue,
  Firestore,
  FirestoreDataConverter,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  startAfter,
  startAt,
  where,
} from 'firebase/firestore';
import { getDownloadURL, listAll, uploadBytes, UploadMetadata } from 'firebase/storage';

export const saveDoc = async <T extends Object & { [key in keyof T]: T[key] }>(
  db: Firestore,
  entity?: T
) => {
  if (!entity) return undefined;
  const properties = Object.getPrototypeOf(entity) as FirestoreDecoratorType;
  const { __collection, __types } = properties;
  if (!__collection || !__types) return;
  const idName = Object.entries(__types).find(([_, value]) => value === 'id')?.[0] as keyof T;
  if (!idName) return;
  const id = entity[idName] as string | undefined;
  if (id) {
    await setDoc(doc(db, __collection, id).withConverter(FirebaseConverter), entity);
    return id;
  } else {
    const result = await addDoc(
      collection(db, __collection).withConverter(FirebaseConverter),
      entity
    );
    return result.id;
  }
};
export const deleteDoc = async <T extends Object & { [key in keyof T]: T[key] }>(
  db: Firestore,
  entity?: T
) => {
  if (!entity) return undefined;
  const properties = Object.getPrototypeOf(entity) as FirestoreDecoratorType;
  const { __collection, __types } = properties;
  if (!__collection || !__types) return;
  const idName = Object.entries(__types).find(([_, value]) => value === 'id')?.[0] as keyof T;
  if (!idName) return;
  const id = entity[idName] as string | undefined;
  if (id) {
    await delDoc(doc(db, __collection, id));
    return id;
  }
  return false;
};
const DocmentSymbol = Symbol('FirestoraDoc');
export type FirestorTypes =
  | 'id'
  | 'string'
  | 'number'
  | 'created'
  | 'updated'
  | 'date'
  | 'boolean'
  | 'reference'
  | 'map'
  | 'array'
  | 'geopoint';
export type FirestoreDecoratorType = {
  __collection?: string;
  __types?: { [key: string]: FirestorTypes };
  [DocmentSymbol]: true;
};

const Entities: { [key: string]: { new (...args: any[]): {} } } = {};

export const convertObject = (value: unknown): unknown => {
  if (typeof value === 'object' && value !== null) {
    const prototype = Object.getPrototypeOf(value) as FirestoreDecoratorType;
    if (prototype?.[DocmentSymbol]) {
      return {
        type: 'document',
        collection: prototype.__collection,
        values: Object.fromEntries(
          Object.entries(prototype.__types!).map(([key, type]) => {
            return [key, convertObject((value as { [key: string]: unknown })[key])];
          })
        ),
      };
    }
    if (Array.isArray(value)) {
      return value.map((v) => convertObject(v));
    }
    if (!Object.getPrototypeOf(value)) {
      return {
        type: 'object',
        values: Object.fromEntries(
          Object.entries(prototype.__types!).map(([key, type]) => {
            return [key, convertObject((value as { [key: string]: unknown })[key])];
          })
        ),
      };
    }
  }
  return value;
};
export const isFirebaseEntity = (object: Object) => {
  const prototype = Object.getPrototypeOf(object) as FirestoreDecoratorType;
  return prototype?.[DocmentSymbol];
};
export const convertFirebaseEntity = (value: { [key: string]: unknown }) => {
  if (typeof value === 'object') {
    if (value.type === 'document') {
      const path = value.collection as string;
      const entity = Entities[path];
      const values: { [key: string]: unknown } = {};
      const data = value.values as { [key: string]: unknown };
      Object.entries(entity.prototype.__types || {}).forEach(([key, type]) => {
        switch (type) {
          case 'date':
          case 'updated':
          case 'created':
            values[key] = data[key] ? new Date(data[key] as string) : undefined;
            break;
          case 'array':
            values[key] = data[key] || [];
          default:
            values[key] = data[key];
        }
      });
      return newClass(entity, values);
    }
  }
  return value;
};
export const FirestoraDoc =
  (collection: string) =>
  <T extends { new (...args: any[]): {} }>(constructor: T) => {
    Object.defineProperty(constructor.prototype, DocmentSymbol, {
      enumerable: true,
      value: true,
    });
    Object.defineProperty(constructor.prototype, '__collection', {
      enumerable: true,
      value: collection,
    });

    const c = class extends constructor {
      toJSON() {
        return convertObject(this);
      }
    };
    Entities[collection] = c;
    return c;
  };

export const FirestoreProperty =
  (type: FirestorTypes): PropertyDecorator =>
  (target, propertyKey) => {
    const types = (target as FirestoreDecoratorType).__types || {};
    types[String(propertyKey)] = type;
    Object.defineProperty(target, '__types', {
      enumerable: true,
      value: types,
    });
  };
export const newClass = <
  T extends { new (...args: any[]): {}; prototype: unknown },
  R extends T extends { new (...args: any[]): infer R } ? R : never
>(
  constructor: T,
  value: T['prototype']
) => {
  return Object.assign(new constructor(), value) as R;
};

export const FirebaseConverter: FirestoreDataConverter<Object> = {
  toFirestore: (entity) => {
    const properties = Object.getPrototypeOf(
      Object.getPrototypeOf(entity)
    ) as FirestoreDecoratorType;
    const { __collection, __types } = properties;
    if (!__collection || !__types) return entity;
    const idName = Object.entries(__types).find(
      ([_, value]) => value === 'id'
    )?.[0] as keyof typeof entity;
    if (!idName) return entity;
    return Object.fromEntries<FieldValue>(
      Object.entries(entity)
        .filter(([key]) => key !== idName)
        .map(([key, value]) => {
          const type = __types[key];
          if (type === 'updated') return [key, serverTimestamp()];
          if (type === 'created') return [key, (value as FieldValue) || serverTimestamp()];
          return [key, value as FieldValue];
        })
    );
  },
  fromFirestore: (snapshot, options) => {
    const path = snapshot.ref.parent.path;
    const entity = Entities[path];
    if (!entity) {
      return snapshot.data(options);
    }
    const data = snapshot.data(options)! || {};
    const values: { [key: string]: unknown } = {};
    Object.entries(entity.prototype.__types || {}).forEach(([key, type]) => {
      if (type === 'id') return;
      switch (type) {
        case 'date':
        case 'updated':
        case 'created':
          values[key] = data[key]?.toDate?.();
          break;
        case 'array':
          values[key] = data[key] || [];
        default:
          values[key] = data[key];
      }
    });
    values.id = snapshot.id;
    return Object.assign(new entity(), values);
  },
};

export const getFileList = async (storage: FirebaseStorage, path: string) => {
  const result = await listAll(ref(storage, path));
  return result.items.map((r) => r.name);
};

export const deleteFile = (storage: FirebaseStorage, path: string) => {
  return deleteObject(ref(storage, path));
};

export const deleteFiles = async (storage: FirebaseStorage, path: string) => {
  const result = await listAll(ref(storage, path));
  return await Promise.all([
    ...result.items.map((item) => deleteObject(ref(storage, item.fullPath))),
  ]);
};
export const saveFile = async (storage: FirebaseStorage,
  path: string,
  data: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata) => {
  const storageRef = ref(storage, path);
  return uploadBytes(storageRef, data, metadata)
    .then(async () => await getDownloadURL(storageRef).catch(() => undefined))
}


export const getFireDocs = async <
  T extends { new(...args: any[]): {} },
  R extends T extends { new(...args: any[]): infer R } ? R : never
>(
  db: Firestore,
  entity: T,
  options?: {
    where?: Parameters<typeof where> | Parameters<typeof where>[];
    limit?: number;
    order?: Parameters<typeof orderBy> | Parameters<typeof orderBy>[];
    start?: number;
    startAfter?: number;
    end?: number;
    entities?: Object[];
  }
) => {
  const properties = entity.prototype as FirestoreDecoratorType;
  const path = properties.__collection!;
  const { where: _where, limit: _limit, order, start, startAfter: _startAfter, end } = options || {};

  const constrains: QueryConstraint[] = [];
  if (_where) {
    if (typeof _where[0] === 'string')
      constrains.push(where(...(_where as Parameters<typeof where>)));
    else
      (_where as Parameters<typeof where>[]).forEach((o) => {
        constrains.push(where(...o));
      });
  }
  if (_limit !== undefined) constrains.push(limit(_limit));
  if (start !== undefined) constrains.push(startAt(start));
  if (_startAfter !== undefined) constrains.push(startAfter(_startAfter));
  if (end !== undefined) constrains.push(endAt(end));
  if (order) {
    if (typeof order[0] === 'string')
      constrains.push(orderBy(...(order as Parameters<typeof orderBy>)));
    else
      (order as Parameters<typeof orderBy>[]).forEach((o) => {
        constrains.push(orderBy(...o));
      });
  }
  const c = collection(db, path);
  const docQuery = query(c, ...constrains).withConverter(FirebaseConverter);
  const result = await getDocs(docQuery)
  return result.docs.map((v) => v.data()) as R[]
}