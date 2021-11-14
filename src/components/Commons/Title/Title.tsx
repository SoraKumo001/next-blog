import React, { FC } from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  visible?: boolean;
}

/**
 * Title
 *
 * @param {Props} { }
 */
export const Title: FC<Props> = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>
          {React.Children.map(children, (c) => (typeof c === 'object' ? '' : c))?.join('')}
        </title>
      </Helmet>
    </>
  );
};
