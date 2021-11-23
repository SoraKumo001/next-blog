import { useCallback, useState } from 'react';
export type StatType = 'idle' | 'progress' | 'finished' | 'error';
export const useAction = () => {
  const [state, setState] = useState<StatType>('idle');
  const dispatch = useCallback((action: () => Promise<unknown>) => {
    setState('progress');
    action()
      .then(() => setState('finished'))
      .catch(() => {
        setState('error');
      });
  }, []);
  return { state, dispatch };
};
