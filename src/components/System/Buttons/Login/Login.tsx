import { SystemButton } from '@/components/Commons/SystemButton';
import { useLoading } from '@/hooks/useLoading';
import React, { FC } from 'react';
import IconLogin from '@mui/icons-material/LoginOutlined';
import IconLogout from '@mui/icons-material/LogoutOutlined';

import { useAdmin } from '@/hooks/useAdmin';
import { useLogin } from '@/hooks/useLogin';

interface Props {}

/**
 * Login
 *
 * @param {Props} { }
 */
export const Login: FC<Props> = ({}) => {
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
