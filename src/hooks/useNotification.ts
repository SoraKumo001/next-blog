import { useEffect } from 'react';
import { useSystemDispatch } from './useSystemDispatch';

export const useNotification = (state: string, messages: { [key: string]: string }) => {
  const dispatch = useSystemDispatch();
  useEffect(() => {
    const message = messages[state];
    if (message) dispatch({ type: 'sendNotification', payload: message });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
};
