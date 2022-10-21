import { SystemContext } from '@/libs/SystemContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Provider } from '@react-libraries/use-ssr';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';
import data from './datas/index.json';
import '@/styles/app.scss';

const initialData = { loading: 1, login: true };

export const Decorator = (Story: React.FunctionComponent) => (
  <SystemContext.Provider value={initialData}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider value={data}>
        <div
          style={{
            height: '100%',
            overflow: 'hidden',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <Story />
        </div>
      </Provider>
    </LocalizationProvider>
  </SystemContext.Provider>
);
export const FullScreenDecorator = (Story: React.FunctionComponent) => (
  <SystemContext.Provider value={initialData}>
    <Story />
  </SystemContext.Provider>
);
