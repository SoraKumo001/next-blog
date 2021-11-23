import React, { FC, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

interface Props {}

/**
 * GoogleAnalytics
 *
 * @param {Props} { }
 */
export const GoogleAnalytics: FC<Props> = ({}) => {
  const router = useRouter();
  const id = process.env.NEXT_PUBLIC_measurementId;
  useEffect(() => {
    if (id) {
      const handleRoute: Parameters<typeof router.events.on>[1] = (path, { shallow }) => {
        if (!shallow) {
          (window as { gtag?: any }).gtag?.('config', id, {
            page_path: path,
          });
        }
      };
      router.events.on('routeChangeComplete', handleRoute);
      return () => {
        router.events.off('routeChangeComplete', handleRoute);
      };
    }
  }, [router, id]);
  return (
    <>
      {id && (
        <>
          <Script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
          <Script id="ga" defer strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${id}');
          `}
          </Script>
        </>
      )}
    </>
  );
};
