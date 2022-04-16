import { useSystemSelector } from './useSystemSelector';

export const useAdmin = () => {
  const user = useSystemSelector((state) => state?.login);
  return user?.isAdmin;
};
