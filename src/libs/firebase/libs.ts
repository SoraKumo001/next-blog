/* eslint-disable no-unused-vars */
import 'reflect-metadata';
import {
  addDoc,
  collection,
  deleteDoc as delDoc,
  doc,
  endAt,
  FieldValue,
  Firestore,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
  startAt,
  where,
} from '@firebase/firestore';

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
  (type?: FirestorTypes): PropertyDecorator =>
  (target, propertyKey) => {
    const designType = (
      Reflect.getMetadata('design:type', target, propertyKey) as { name?: string }
    )?.name?.toLowerCase() as FirestorTypes | undefined;
    const types = (target as FirestoreDecoratorType).__types || {};
    types[String(propertyKey)] = type || designType || 'unknown';
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

export const saveFireDoc = async <T extends Object & { [key in keyof T]: T[key] }>(
  db: Firestore | undefined,
  entity?: T
) => {
  if (!db || !entity) return undefined;
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
  | 'geopoint'
  | 'unknown';
export type FirestoreDecoratorType = {
  __collection?: string;
  __types?: { [key: string]: FirestorTypes };
  [DocmentSymbol]: true;
};

const Entities: { [key: string]: { new (...args: any[]): {} } } = {};
export const isFirebaseEntity = (object: Object) => {
  const prototype = Object.getPrototypeOf(object) as FirestoreDecoratorType;
  return prototype?.[DocmentSymbol];
};
export const getFirestoreEntityTypes = <T extends { new (...args: any[]): {} }>(
  entity: object | T
) => {
  let prototype: FirestoreDecoratorType | undefined;
  if ('prototype' in entity && entity.prototype[DocmentSymbol]) {
    prototype = entity.prototype;
  }
  if (!prototype)
    prototype = Object.getPrototypeOf(Object.getPrototypeOf(entity)) as FirestoreDecoratorType;
  if (prototype[DocmentSymbol]) {
    const types = prototype.__types || {};
    const collection = prototype.__collection || '';
    return { types, collection };
  }
  return undefined;
};

export const convertObject = (value: unknown): unknown => {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map((v) => convertObject(v));
    }
    const prototype = getFirestoreEntityTypes(value);
    if (prototype) {
      return {
        type: 'document',
        collection: prototype.collection,
        values: Object.fromEntries(
          Object.entries(prototype.types).map(([key, type]) => {
            return [key, convertObject((value as { [key: string]: unknown })[key])];
          })
        ),
      };
    }
    return {
      type: 'object',
      values: Object.fromEntries(
        Object.entries(value).map(([key, value]) => {
          return [key, convertObject((value as { [key: string]: unknown })[key])];
        })
      ),
    };
  }
  return value;
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
            break;
          default:
            values[key] = data[key];
        }
      });
      return newClass(entity, values);
    }
  }
  return value;
};

export const FirebaseConverter: FirestoreDataConverter<Object> = {
  toFirestore: (entity) => {
    const properties = getFirestoreEntityTypes(entity);
    if (!properties) return entity;
    const { types } = properties;

    return Object.fromEntries<FieldValue>(
      Object.entries(types)
        .filter(([_, type]) => type !== 'id')
        .map(([key, type]) => {
          const value = entity[key as keyof typeof entity] as FieldValue;
          switch (type) {
            case 'updated':
              return [key, serverTimestamp()];
            case 'created':
              return [key, value || serverTimestamp()];
            case 'array':
              return [key, value || []];
            case 'boolean':
              return [key, value || false];
          }

          return [key, value];
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
        case 'boolean':
          values[key] = data[key] || false;
          break;
        case 'array':
          values[key] = data[key] || [];
          break;
        default:
          values[key] = data[key];
      }
    });
    values.id = snapshot.id;
    return Object.assign(new entity(), values);
  },
};
export const getFireDocsWithSnapshot = async <
  T extends { new (...args: any[]): {} },
  R extends T extends { new (...args: any[]): infer R } ? R : never
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
): Promise<[R[], QuerySnapshot]> => {
  const properties = entity.prototype as FirestoreDecoratorType;
  const path = properties.__collection!;
  const {
    where: _where,
    limit: _limit,
    order,
    start,
    startAfter: _startAfter,
    end,
  } = options || {};

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
  const docQuery = query(collection(db, path), ...constrains).withConverter(FirebaseConverter);
  const shapshot = await getDocs(docQuery);
  return [shapshot.docs.map((v) => v.data()) as R[], shapshot];
};
export const getFireDocs = async <T extends { new (...args: any[]): {} }>(
  db: Firestore | undefined,
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
  if (!db) return [];
  const result = await getFireDocsWithSnapshot(db, entity, options);
  return result[0];
};

export const getFireDocWithShapshot = async <
  T extends { new (...args: any[]): {} },
  R extends T extends { new (...args: any[]): infer R } ? R : never
>(
  db: Firestore,
  entity: T,
  id: string
): Promise<[R | undefined, QueryDocumentSnapshot] | undefined> => {
  const properties = getFirestoreEntityTypes(entity);
  if (!properties) return undefined;
  const path = properties.collection;
  const docQuery = doc(collection(db, path), id).withConverter(FirebaseConverter);
  const snapshot = (await getDoc(docQuery)) as QueryDocumentSnapshot;
  if (!snapshot.exists()) return [undefined, snapshot];
  return [snapshot?.data as R, snapshot];
};
export const getFireDoc = async <T extends { new (...args: any[]): {} }>(
  db: Firestore | undefined,
  entity: T,
  id: string
) => {
  if (!db) return undefined;
  const result = await getFireDocWithShapshot(db, entity, id);
  return result?.[0];
};
