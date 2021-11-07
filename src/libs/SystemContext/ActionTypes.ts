type BaseType = {};
export type ActionType<T> = {
  [M in keyof T]: {
    type: M;
    payload: T[M] extends (...argv: infer R) => unknown
      ? R[1] extends infer R
        ? R
        : never
      : never;
  };
} extends {
  [P in any]: {} extends {} ? infer R : never;
}
  ? R extends { type: infer R; payload: void }
    ? { type: R; payload?: undefined }
    : R
  : never;

type UI<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type ReducerType<T> = T extends {
  [_ in keyof T]: (...argv: any) => infer R;
}
  ? UI<R>
  : never;

export type ActionFn<T, R = T> = (state: BaseType & T, payload: R) => BaseType & T;
