import { SystemButton } from '@/components/Commons/SystemButton';
import { useLoading } from '@/hooks/useLoading';
import { authProvider, firebaseAuth, firestore, useAuth, useFireDoc } from '@/libs/firebase';
import { GoogleAuthProvider } from '@firebase/auth';
import React, { FC, useEffect } from 'react';
import IconLogin from '@mui/icons-material/LoginOutlined';
import IconLogout from '@mui/icons-material/LogoutOutlined';
import styled from './Login.module.scss';
import { useSystemDispatch } from '@/hooks/useSystemDispatch';
import { Admin } from '@/types/Admins';
import { useSystemSelector } from '@/hooks/useSystemSelector';
import { useAdmin, useLogin } from '@/hooks/useLogin';

interface Props { }

/**
 * Login
 *
 * @param {Props} { }
 */
export const Login: FC<Props> = ({ }) => {
  const { state, dispatch } = useLogin();
  const isAdmin = useAdmin();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (isAdmin) {
      dispatch({ type: 'logout' });
    } else {
      dispatch({ type: 'login' });
    }
  };
  useLoading([state]);
  return (
    <SystemButton icon={isAdmin ? <IconLogout /> : <IconLogin />} onClick={handleClick}>
      {isAdmin ? 'Logout' : 'Login'}
    </SystemButton>
  );
};


