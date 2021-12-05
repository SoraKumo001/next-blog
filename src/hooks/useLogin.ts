import {
  authProvider,
  firebaseAuth,
  firestore,
  newClass,
  saveFireDoc,
  useAuth,
  useFireDoc,
} from '@/libs/firebase';
import { Admin } from '@/types/Admins';
import { Application } from '@/types/Application';
import { GoogleAuthProvider } from '@firebase/auth';
import { useEffect } from 'react';
import { useSystemDispatch } from './useSystemDispatch';

export const useLogin = () => {
  const { contents: application, dispatch: appDispatch } = useFireDoc(
    firestore,
    Application,
    'root'
  );
  const systemDispatch = useSystemDispatch();
  const { state, dispatch, credential } = useAuth(firebaseAuth, authProvider);
  const { state: fireState, contents } = useFireDoc(firestore, Admin, credential?.user.email);
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      dispatch({ type: 'login', payload: { token } });
    }
  }, [dispatch]);
  useEffect(() => {
    if (credential) {
      const token = GoogleAuthProvider.credentialFromResult(credential)?.idToken;
      token && sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
  }, [credential]);
  useEffect(() => {
    if (contents) {
      systemDispatch({ type: 'login', payload: { email: contents.id!, isAdmin: true } });
      if (application?.title === undefined) {
        initSystem(contents.id!).then(() => appDispatch());
      }
    } else {
      systemDispatch({ type: 'logout', payload: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fireState]);
  return { state, dispatch, credential };
};

const initSystem = async (email: string) => {
  const admin = newClass(Admin, { id: email });
  await saveFireDoc(firestore, admin);
  const app = newClass(Application, {
    id: 'root',
    title: 'Blog',
    description: '',
    directStorage: false,
  });
  return saveFireDoc(firestore, app);
};
