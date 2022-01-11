import { LoadingContainer } from '@/components/System/LoadingContainer';
import { NotificationContainer } from '@/components/System/Notification/NotificationContainer';
import { SystemContext } from '@/libs/SystemContext';
import { CachesType, getDataFromTree, Provider } from '@react-libraries/use-ssr';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { AppContext, AppProps } from 'next/app';
import React from 'react';
import 'normalize.css';
import '@/styles/app.scss';
import { LocalizationProvider } from '@mui/lab';
import { FooterButtons } from '@/components/System/FooterButtons';
import Head from 'next/head';
import { HeaderContainer } from '@/components/System/HeaderContainer';
import { GoogleAnalytics } from '@/components/Commons/GoogleAnalytics';

const App = (props: AppProps & { cache: CachesType }) => {
  const { Component, cache } = props;
  return (
    <SystemContext.Provider>
      <GoogleAnalytics />
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
      </Head>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Provider
          value={cache}
          onUpdate={(v) =>
            typeof window !== 'undefined' &&
            process.env.NODE_ENV === 'development' &&
            console.log(JSON.stringify(v))
          }
        >
          <HeaderContainer />
          <Component />
          <FooterButtons />
          <NotificationContainer />
          <LoadingContainer />
        </Provider>
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
