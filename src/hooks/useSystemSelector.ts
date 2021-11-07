import { SystemContext, SystemContextType } from '@/libs/SystemContext';
import { useSelector } from './../libs/context/context';

export const useSystemSelector = <K>(selector: (state: SystemContextType) => K) => {
  return useSelector(SystemContext, selector);
};
