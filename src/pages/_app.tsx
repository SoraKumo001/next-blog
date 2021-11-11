import { LoadingContainer } from '@/components/System/LoadingContainer';
import { NotificationContainer } from '@/components/System/Notification/NotificationContainer';
import { SystemContext } from '@/libs/SystemContext';
import { CachesType, createCache, getDataFromTree } from '@react-libraries/use-ssr';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { AppContext, AppProps } from 'next/app';
import React from 'react';
import 'normalize.css';
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
let srcCache = {}
App.getInitialProps = async ({ Component, router, AppTree }: AppContext) => {
  const cache = await getDataFromTree(
    <AppTree Component={Component} pageProps={{}} router={router} />, { cache: srcCache }
  );
  srcCache = cache
  return { cache };
};
export default App;
