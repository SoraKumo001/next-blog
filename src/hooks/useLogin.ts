import { authProvider, firebaseAuth, firestore, useAuth, useFireDoc } from '@/libs/firebase';
import { Admin } from '@/types/Admins';
import { GoogleAuthProvider } from '@firebase/auth';
import { useEffect } from 'react';
import { useSystemDispatch } from './useSystemDispatch';
import { useSystemSelector } from './useSystemSelector';

export const useAdmin = () => {
  const user = useSystemSelector((state) => state.login);
  return user?.isAdmin;
};

export const useLogin = () => {
  const systemDispatch = useSystemDispatch();
  const { state, dispatch, credential } = useAuth(firebaseAuth, authProvider);
  const { contents } = useFireDoc(firestore, Admin, credential?.user.email);
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
  }, [contents]);
  return { state, dispatch, credential };
};
