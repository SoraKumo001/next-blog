import { SystemContext } from '@/libs/SystemContext';
import React from 'react';

const initialData = { loading: 1 };

export const Decorator = (Story: React.FunctionComponent) => (
  <SystemContext.Provider value={initialData}>
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
  </SystemContext.Provider>
);
export const FullScreenDecorator = (Story: React.FunctionComponent) => (
  <SystemContext.Provider value={initialData}>
    <Story />
  </SystemContext.Provider>
);
