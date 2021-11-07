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
} from './libs';

type StatType = 'idle' | 'progress' | 'finished' | 'error';
type LoginType = 'idle' | 'progress' | 'logined' | 'logouted' | 'error';

export const useAuth = (auth: Auth, provider: GoogleAuthProvider) => {
  const [state, setState] = useState<LoginType>('idle');
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
                setState('logined');
              })
              .catch((e) => {
                setError(e);
                setState('error');
              });
          } else {
            signInWithPopup(auth, provider)
              .then((result) => {
                setCredential(result);
                setState('logined');
              })
              .catch((e) => {
                setError(e);
                setState('error');
              });
          }
          break;
        case 'logout':
          setState('progress');
          signOut(auth)
            .then(() => {
              setCredential(undefined);
              setState('logouted');
            })
            .catch((e) => {
              setError(e);
              setState('error');
            });
          break;
      }
    },
    [auth]
  );
  return { state, error, credential, dispatch };
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
  useEffect(() => {
    property.unsubscribe?.();
    property.unsubscribe = undefined;
  }, []);
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
  }, [name]);

  useEffect(() => {
    property.unsubscribe?.();
    if (docQuery) {
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
    }
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
  useEffect(() => {
    property.unsubscribe?.();
    property.unsubscribe = undefined;
  }, []);
  const docQuery = useMemo(() => {
    if (!id) return undefined;
    const c = collection(db, path);
    const q = doc(c, id).withConverter(FirebaseConverter);
    return q;
  }, [name, id]);

  useEffect(() => {
    property.unsubscribe?.();
    if (docQuery) {
      property.unsubscribe = onSnapshot(
        docQuery,
        { includeMetadataChanges: true },
        (result) => {
          if (!result.metadata.fromCache) setState(['finished', result.data() as R]);
        },
        () => {
          setState(['error', undefined]);
        }
      );
    }
  }, [docQuery]);
  const [state, setState] = useSSR<[StatType, R | undefined]>(
    [name],
    async (state, setState) => {
      const [status, contents] = state;
      if (id === undefined || id === null) {
        setState(['idle', undefined]);
        return;
      }
      if (status !== 'idle' || !docQuery) {
        return;
      }
      setState(['progress', contents]);
      await getDoc(docQuery)
        .then((result) => setState(['finished', result.data() as R]))
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
