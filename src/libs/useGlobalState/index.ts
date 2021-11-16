import {
  createContext,
  createElement,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Render<T = unknown> = Dispatch<SetStateAction<T | undefined>>;
export type ContextType = {
  renderMap: Map<string, Set<Render>>;
  initialKeys: Set<string>;
  initialDatas: Map<string, unknown>;
  cache: { [key: string]: unknown };
};

const context = createContext<ContextType>(undefined as never);
export const Provider = ({
  value,
  children,
}: {
  value?: Partial<ContextType>;
  children?: React.ReactNode;
}) => {
  const v = value || {};
  v.renderMap = new Map<string, Set<Render>>();
  v.initialDatas = new Map<string, unknown>();
  v.initialKeys = new Set<string>();
  if (v.cache) {
    Object.entries(v.cache).forEach(([key]) => {
      v.initialKeys!.add(key);
    });
  } else {
    v.cache = {};
  }
  return createElement<{ value: ContextType }>(
    context.Provider,
    { value: v as ContextType },
    children
  );
};
const NormalizeKey = (keys: string | string[]) =>
  (Array.isArray(keys) ? keys : [keys]).reduce((a, b) => `${a}[${b}]`, '');

const globalContext = {
  renderMap: new Map<string, Set<Render>>(),
  initialKeys: new Set<string>(),
  initialDatas: new Map<string, unknown>(),
  cache: {},
};

export const reset = (context: ContextType = globalContext) => {
  const { renderMap, initialKeys, cache } = context;
  renderMap.clear();
  initialKeys.clear();
  Object.keys(cache).forEach((key) => delete cache[key]);
};

export const clearCache = (keys: string | string[], context: ContextType = globalContext) => {
  const { renderMap, initialKeys, initialDatas, cache } = context;
  const key = NormalizeKey(keys);
  Object.keys(cache)
    .filter((k) => k.indexOf(key) === 0)
    .forEach((key) => {
      initialKeys.delete(key);
      delete cache[key];
      renderMap.get(key)?.forEach((render) => render(initialDatas.get(key)));
    });
};

export const getCache = <T = unknown>(
  keys: string | string[],
  context: ContextType = globalContext
) => {
  const { cache } = context;
  const key = NormalizeKey(keys);
  const result: { [key: string]: T } = {};
  Object.entries(cache)
    .filter(([k]) => k.indexOf(key) === 0)
    .forEach(([key, value]) => (result[key] = value as T));
  return result;
};
export const setCache = <T = unknown>(
  src: { [key: string]: T },
  context: ContextType = globalContext
) => {
  const { initialKeys, cache } = context;
  Object.entries(src).forEach(([key, value]) => {
    cache[key] = value as T;
    initialKeys.add(key);
  });
};

export const query = <T = unknown>(keys: string | string[], context: ContextType = globalContext) =>
  context.cache[NormalizeKey(keys)] as T;

export const mutate = <T = Object>(
  keys: string | string[],
  data: T | Promise<T> | ((data: T) => T | Promise<T>),
  context: ContextType = globalContext
) => {
  const { renderMap, initialKeys, cache } = context;
  const key = NormalizeKey(keys);
  const value =
    typeof data === 'function' ? (data as (data: T) => T | Promise<T>)(cache[key] as T) : data;
  if (value instanceof Promise) {
    value.then((data) => {
      cache[key] = data;
      renderMap.get(key)?.forEach((render) => render(data));
      initialKeys.add(key);
    });
  } else {
    cache[key] = data;
    renderMap.get(key)?.forEach((render) => render(data));
    initialKeys.add(key);
  }
};

export const useQuery = () => {
  const c = useContext<ContextType>(context) || globalContext;
  return <T = unknown>(keys: string | string[]) => query<T>(keys, c);
};

export const useMutation = () => {
  const c = useContext<ContextType>(context) || globalContext;
  return <T>(keys: string | string[], state: T | Promise<T> | ((data: T) => T | Promise<T>)) =>
    mutate<T>(keys, state, c);
};

export const useGlobalState: {
  <T>(keys: string | string[], initialData: T | (() => T)): readonly [
    T,
    (data: T | ((data: T) => T)) => void
  ];
  <K = unknown, T = K | undefined>(keys: string | string[]): readonly [
    T,
    (data: T | ((data: T) => T)) => void
  ];
} = <T>(keys: string | string[], initialData?: T | (() => T)) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const key = useMemo(() => NormalizeKey(keys), Array.isArray(keys) ? keys : [keys]);
  const property = useRef<{ keyName: string }>({ keyName: key }).current;
  const con = useContext<ContextType>(context) || globalContext;
  const { renderMap, initialKeys, initialDatas, cache } = con;

  type RenderMap = Map<string, Set<Render<T>>>;
  const [state, render] = useState<T | undefined>(
    cache[key] === undefined ? initialData : (cache[key] as T)
  );
  const dispatch = useCallback(
    (data: T | ((data: T) => T)) => {
      mutate(keys, data, con);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, con]
  );
  let init = false;
  useEffect(() => {
    const renders = renderMap.get(key)!;
    init && renders.forEach((r) => r(cache[key]));
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      init = false;
      (renderMap as RenderMap).get(key)?.delete(render);
    };
  }, [key]);
  if (initialData !== undefined && !initialKeys.has(key)) {
    const value = typeof initialData === 'function' ? (initialData as () => T)() : initialData;
    cache[key] = value;
    initialKeys.add(key);
    initialDatas.set(key, value);
    init = true;
  }
  const renders = (renderMap as RenderMap).get(key)!;
  if (renders) renders.add(render);
  else (renderMap as RenderMap).set(key, new Set<Render<T>>().add(render));
  if (property.keyName !== key) {
    property.keyName = key;
    const value = cache[key] === undefined ? initialData : (cache[key] as T);
    render(value);
    return [value, dispatch] as const;
  }
  return [state, dispatch] as const;
};
