import { LoadingContainer } from '@/components/System/LoadingContainer';
import { NotificationContainer } from '@/components/System/Notification/NotificationContainer';
import { SystemContext } from '@/libs/SystemContext';
import { CachesType, createCache, getDataFromTree } from '@/libs/useSSR';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { AppContext, AppProps } from 'next/app';
import React from 'react';
import 'normalize.css';
import '@/styles/app.scss';
import { LocalizationProvider } from '@mui/lab';
import { FooterButtons } from '@/components/System/FooterButtons';
import Head from 'next/head';

const App = (props: AppProps & { cache: CachesType }) => {
  const { Component, cache } = props;
  createCache(cache);
  return (
    <SystemContext.Provider>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
      </Head>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <FooterButtons />
        <Component />
        <NotificationContainer />
        <LoadingContainer />
      </LocalizationProvider>
    </SystemContext.Provider>
  );
};

App.getInitialProps = async ({ Component, router, AppTree }: AppContext) => {
  const cache = await getDataFromTree(
    <AppTree Component={Component} pageProps={{}} router={router} />
  );
  return { cache };
};
export default App;
