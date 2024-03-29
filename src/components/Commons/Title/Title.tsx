import { firestore, useFireDoc } from '@/libs/firebase';
import { Application } from '@/types/Application';
import Head from 'next/head';
import React, { FC, useMemo } from 'react';

interface Props {
  children?: React.ReactNode;
}

/**
 * Title
 *
 * @param {Props} { }
 */
export const Title: FC<Props> = ({ children }) => {
  const { contents } = useFireDoc(firestore, Application, 'root');
  const subTitle = useMemo(() => {
    return React.Children.map(children, (c) => (typeof c === 'object' ? '' : c))?.join('');
  }, [children]);
  const title = (subTitle || '') + (contents?.title ? ` | ${contents.title}` : '');
  const imageUrl = `${contents?.host}api/og?title=${encodeURI(subTitle || '')}&name=${encodeURI(contents?.title || '')}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="description" content={contents?.description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={contents?.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={contents?.description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
    </>
  );
};
