import { getStorage } from '@firebase/storage';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  databaseURL: process.env.NEXT_PUBLIC_databaseURL,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
  measurementId: process.env.NEXT_PUBLIC_measurementId,
};

const getTry = <T>(proc: () => T) => {
  let result: T | undefined = undefined;
  try {
    result = proc();
  } catch (_) {
    //
  }
  return result;
};
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getTry(() => getAuth(app));
export const firestore = getTry(() => getFirestore(app));
export const firestorage = getTry(() => getStorage(app));

typeof window !== 'undefined' &&
  firestore &&
  enableMultiTabIndexedDbPersistence(firestore).catch(() => null);
export const authProvider = new GoogleAuthProvider();
