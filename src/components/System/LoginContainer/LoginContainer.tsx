import { FC, useEffect } from 'react';
import { useLoading } from '@/hooks/useLoading';
import { useAdmin } from '@/hooks/useAdmin';
import { useLogin } from '@/hooks/useLogin';
import { useRouter } from 'next/router';
interface Props {}

/**
 * LoginContainer
 *
 * @param {Props} { }
 */
export const LoginContainer: FC<Props> = ({}) => {
  const router = useRouter();
  const isAdmin = useAdmin();
  const { state, dispatch } = useLogin();
  useEffect(() => {
    if (isAdmin) {
      dispatch({ type: 'logout' });
    } else {
      dispatch({ type: 'login' });
    }
  }, []);
  useEffect(() => {
    if (state === 'finished' || state === 'error') router.back();
  }, [state]);
  useLoading([state]);
  return null;
};
