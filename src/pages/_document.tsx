import { ServerStyleSheets } from '@mui/styles';
import Document, { Head, Html, Main, NextScript, DocumentContext } from 'next/document';

import React from 'react';
import { ServerStyleSheet } from 'styled-components';

const AppDocument = () => (
  <Html lang="ja-JP">
    <Head>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

AppDocument.getInitialProps = async (ctx: DocumentContext) => {
  const MuiSheets = new ServerStyleSheets();
  const styledComponentsSheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          styledComponentsSheet.collectStyles(MuiSheets.collect(<App {...props} />)),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        MuiSheets.getStyleElement(),
        styledComponentsSheet.getStyleElement(),
      ],
    };
  } finally {
    styledComponentsSheet.seal();
  }
};
export default AppDocument;
