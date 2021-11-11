import { authProvider, firebaseAuth, firestore, useAuth, useFireDoc } from '@/libs/firebase';
import { Admin } from '@/types/Admins';
import { GoogleAuthProvider } from '@firebase/auth';
import { useEffect } from 'react';
import { useSystemDispatch } from './useSystemDispatch';

export const useLogin = () => {
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
    } else {
      systemDispatch({ type: 'logout', payload: undefined });
    }
  }, [fireState]);
  return { state, dispatch, credential };
};
