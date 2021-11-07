import { useDispatch } from '@/libs/context/context';
import { SystemContext } from '@/libs/SystemContext';

export const useSystemDispatch = () => {
  const dispatch = useDispatch(SystemContext);
  return dispatch;
};
