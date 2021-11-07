import { createContext, useDispatch } from '../context/context';
import { ReducerType } from './ActionTypes';
import { reducer, reducers } from './reducer';

export type SystemContextType = ReducerType<typeof reducers>;

export const SystemContext = createContext({ state: {}, reducer });
