import { firestore, useFireDoc } from '@/libs/firebase';
import { Application } from '@/types/Application';
import Head from 'next/head';
import React, { FC, useMemo } from 'react';

interface Props {
  visible?: boolean;
}

/**
 * Title
 *
 * @param {Props} { }
 */
export const Title: FC<Props> = ({ children }) => {
  const { contents } = useFireDoc(firestore, Application, 'root');
  const title = useMemo(() => {
    return React.Children.map(children, (c) => (typeof c === 'object' ? '' : c))?.join('');
  }, [children]);
  return (
    <>
      <Head>
        <title>
          {title}
          {contents?.title && ` | ${contents.title}`}
        </title>
        <meta property="description" content={contents?.description} />
        <meta property="og:title" content={contents?.title} />
        <meta property="og:description" content={contents?.description} />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content={'summary'} />
        <meta property="twitter:title" content={contents?.title} />
        <meta property="twitter:description" content={contents?.description} />
        {contents?.cardUrl && <>
          <meta name="twitter:image" content={contents.cardUrl} />
        </>}
      </Head>
    </>
  );
};
