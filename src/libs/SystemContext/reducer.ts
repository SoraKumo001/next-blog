import { ActionFn, ActionType, ReducerType } from './ActionTypes';

const setLoading: ActionFn<{ loading?: number }, boolean> = (state, payload) => {
  return {
    ...state,
    loading: (state.loading || 0) + (payload ? 1 : -1),
  };
};
const sendNotification: ActionFn<{ notification?: string[] }, string> = (state, payload) => {
  return {
    ...state,
    notification: [...(state.notification || []), payload],
  };
};
const removeNotification: ActionFn<{ notification?: string[] }, void> = (state) => ({
  ...state,
  notification: state.notification ? state.notification.slice(1) : undefined,
});
const login: ActionFn<
  { login?: { email: string; isAdmin: boolean } },
  { email: string; isAdmin: boolean }
> = (state, payload) => {
  return {
    ...state,
    login: { email: payload.email, isAdmin: payload.isAdmin },
  };
};
const logout: ActionFn<{ login?: { email: string; isAdmin: boolean } }, void> = (state) => {
  return {
    ...state,
    login: undefined,
  };
};
export const reducers = {
  setLoading,
  sendNotification,
  removeNotification,
  login,
  logout,
};

export const reducer = <T>(
  state: ReducerType<typeof reducers>,
  { type, payload }: ActionType<typeof reducers>
): T => reducers[type](state, payload as never) as T;
