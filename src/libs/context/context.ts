import React, {
  Context,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type Manager<T> = {
  state: T;
  dispatches: Set<Readonly<[React.Dispatch<React.SetStateAction<unknown>>, (state: T) => unknown]>>;
};
type Reducer<T> = (state: T, action: any) => T;
type CustomContext<T, K extends Reducer<T> | undefined> = {
  Provider: ({
    value,
    children,
  }: {
    children: ReactNode;
    value?: T;
  }) => React.FunctionComponentElement<React.ProviderProps<Manager<T>>>;
  _Provider: Context<Manager<T>>['Provider'];
  Consumer: Context<T>['Consumer'];
  Reducer: K;
  displayName?: string | undefined;
};

const createManager = <T>(state?: T) => ({
  state: state as T,
  dispatches: new Set<
    Readonly<[React.Dispatch<React.SetStateAction<unknown>>, (state: T) => unknown]>
  >(),
});

const createCustomContext: {
  <T, K extends Reducer<T>>({ state, reducer }: { state: T; reducer: K }): CustomContext<T, K>;
  <T, K extends Reducer<T> | undefined>({ state }: { state: T }): CustomContext<T, K>;
} = <T, K extends Reducer<T> | undefined>({
  state,
  reducer,
}: {
  state?: T;
  reducer?: K;
}): CustomContext<T, K> => {
  const context = createContext<Manager<T>>(undefined as never);
  const customContext = context as unknown as CustomContext<T, K>;
  customContext._Provider = context.Provider;
  customContext.Reducer = reducer as any;
  // eslint-disable-next-line react/display-name
  customContext.Provider = ({ value, children }: { children: ReactNode; value?: T }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const manager = useRef(createManager<T>(value || state)).current;
    return React.createElement(customContext._Provider, { value: manager }, children);
  };
  return customContext;
};

export const useSelector = <T, K, R extends Reducer<T>>(
  context: CustomContext<T, R>,
  selector: (state: T) => K
) => {
  const manager = useContext<Manager<T>>(context as unknown as Context<Manager<T>>);
  const [state, dispatch] = useState(() => selector(manager?.state));
  useEffect(() => {
    const v = [dispatch as React.Dispatch<React.SetStateAction<unknown>>, selector] as const;
    manager.dispatches.add(v);
    dispatch(selector(manager.state));
    return () => {
      manager.dispatches.delete(v);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager]);
  return state;
};
export const useDispatch = <T, K extends Reducer<T> | undefined>(context: CustomContext<T, K>) => {
  const manager = useContext<Manager<T>>(context as unknown as Context<Manager<T>>);
  const { dispatches } = manager || {};
  return useCallback(
    (
      state:
        | (typeof context['Reducer'] extends Reducer<T>
            ? Parameters<typeof context['Reducer']>[1]
            : T)
        | ((state: T) => T)
    ) => {
      const newState =
        typeof state === 'function'
          ? (state as (state: T) => T)(manager.state)
          : context.Reducer
          ? context.Reducer(manager.state, state)
          : state;
      if (newState !== state) {
        manager.state = newState;
        dispatches.forEach(([dispatch, selector]) => dispatch(selector(newState)));
      }
    },
    [context, dispatches, manager]
  );
};

export { createCustomContext as createContext };
