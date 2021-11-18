import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  signInWithCredential,
  signOut,
  Auth,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  Firestore,
  where,
  QueryConstraint,
  limit,
  orderBy,
  startAt,
  endAt,
  startAfter,
  onSnapshot,
  getDoc,
  doc,
} from 'firebase/firestore';
import { useSSR } from '@react-libraries/use-ssr';
import {
  convertFirebaseEntity,
  FirebaseConverter,
  FirestoreDecoratorType,
  isFirebaseEntity,
  newClass,
} from './libs';
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
  UploadMetadata,
} from 'firebase/storage';
import { dispatchMarkdown } from '@react-libraries/markdown-editor';

type StatType = 'idle' | 'progress' | 'finished' | 'error';
type LoginType = 'idle' | 'logined' | 'logouted' | 'error';

export const useAuth = (auth: Auth, provider: GoogleAuthProvider) => {
  const [state, setState] = useState<StatType>('idle');
  const [loginState, setLoginState] = useState<LoginType>('idle');
  const [error, setError] = useState<unknown>('');
  const [credential, setCredential] = useState<UserCredential>();
  const dispatch = useCallback(
    (action: { type: 'login'; payload?: { token: string } } | { type: 'logout' }) => {
      setError('');
      switch (action.type) {
        case 'login':
          setState('progress');
          const token = action.payload?.token;
          if (token) {
            signInWithCredential(auth, GoogleAuthProvider.credential(token))
              .then((result) => {
                setCredential(result);
                setState('finished');
                setLoginState('logined');
              })
              .catch((e) => {
                setError(e);
                setState('error');
              });
          } else {
            signInWithPopup(auth, provider)
              .then((result) => {
                setCredential(result);
                setState('finished');
                setLoginState('logined');
              })
              .catch((e) => {
                setError(e);
                setLoginState('error');
                setState('error');
              });
          }
          break;
        case 'logout':
          setState('progress');
          signOut(auth)
            .then(() => {
              setCredential(undefined);
              setState('finished');
              setLoginState('logouted');
            })
            .catch((e) => {
              setError(e);
              setState('error');
              setLoginState('error');
            });
          break;
      }
    },
    [auth, provider]
  );
  return { state, loginState, error, credential, dispatch };
};

export const useFireDocs = <
  T extends { new (...args: any[]): {} },
  R extends T extends { new (...args: any[]): infer R } ? R : never
>(
  db: Firestore,
  entity: T,
  options: {
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
  const name = JSON.stringify({ path, ...options });
  const property = useRef<{ unsubscribe?: () => void; init?: boolean }>({}).current;
  const docQuery = useMemo(() => {
    const { where: _where, limit: _limit, order, start, startAfter: _startAfter, end } = options;

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
    const q = query(c, ...constrains).withConverter(FirebaseConverter);
    return q;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    property.unsubscribe?.();
    const handle =
      docQuery &&
      setTimeout(() => {
        property.unsubscribe = onSnapshot(
          docQuery,
          { includeMetadataChanges: true },
          (result) => {
            if (!result.metadata.fromCache)
              setState(['finished', result.docs.map((v) => v.data()) as R[]]);
          },
          () => {
            setState(['error', undefined]);
          }
        );
      }, 100);

    return () => {
      handle && clearTimeout(handle);
      property.unsubscribe?.();
      property.unsubscribe = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docQuery]);

  const [state, setState] = useSSR<[StatType, R[] | undefined]>(
    [name],
    async (state, setState) => {
      const [status, contents] = state;
      if (status !== 'idle') {
        return;
      }
      setState(['progress', contents]);
      await getDocs(docQuery)
        .then((result) => setState(['finished', result.docs.map((v) => v.data()) as R[]]))
        .catch((e) => {
          setState(['error', undefined]);
          console.error(e);
        });
    },
    ['idle', undefined]
  );
  const dispatch = useCallback(() => {
    setState((v) => ['idle', v[1]]);
  }, []);
  if (!property.init) {
    property.init = true;
    const [status, contents] = state;
    if (contents) {
      const isRequest = contents.find((v) => !isFirebaseEntity(v));
      if (isRequest) {
        const values = contents.map((v) => convertFirebaseEntity(v)) as R[];
        setState([status, values]);
        return { dispatch, state: status, contents: values };
      }
    }
  }
  return { dispatch, state: state[0], contents: state[1] };
};
export const useFireDoc = <
  T extends { new (...args: any[]): {} },
  R extends T extends { new (...args: any[]): infer R } ? R : never
>(
  db: Firestore,
  entity: T,
  id?: string | null
) => {
  const properties = entity.prototype as FirestoreDecoratorType;
  const path = properties.__collection!;
  const name = JSON.stringify({ path });
  const property = useRef<{ unsubscribe?: () => void; init?: boolean }>({}).current;
  const docQuery = useMemo(() => {
    if (!id) return undefined;
    return doc(collection(db, path), id).withConverter(FirebaseConverter);
  }, [id, db, path]);
  useEffect(() => {
    const handle =
      docQuery &&
      setTimeout(() => {
        property.unsubscribe = onSnapshot(
          docQuery,
          { includeMetadataChanges: true },
          (result) => {
            if (typeof window === 'undefined' || !result.metadata.fromCache)
              setState([
                'finished',
                (result.data() ? result.data() : newClass(entity, { id })) as R,
              ]);
          },
          () => {
            setState(['error', undefined]);
          }
        );
      }, 100);
    return () => {
      handle && clearTimeout(handle);
      property.unsubscribe?.();
      property.unsubscribe = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docQuery]);
  const [state, setState] = useSSR<[StatType, R | undefined]>(
    [name, String(id)],
    async (state, setState) => {
      const [status, contents] = state;
      if (id === undefined || id === null) {
        setState(['idle', undefined]);
        return;
      }
      if (!docQuery || status !== 'idle') {
        return;
      }
      setState(['progress', contents]);
      await getDoc(docQuery)
        .then((result) =>
          setState(['finished', (result.data() ? result.data() : newClass(entity, { id })) as R])
        )
        .catch(() => setState(['error', undefined]));
    },
    ['idle', undefined]
  );
  const dispatch = useCallback(() => {
    setState((v) => ['idle', v[1]]);
  }, []);
  if (!property.init) {
    property.init = true;
    const [status, contents] = state;
    if (contents) {
      const isRequest = !isFirebaseEntity(contents);
      if (isRequest) {
        const value = convertFirebaseEntity(contents) as R;
        setState([status, value]);
        return { dispatch, state: status, contents: value };
      }
    }
  }
  return { dispatch, state: state[0], contents: state[1] };
};
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
