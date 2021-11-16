import Link from 'next/link';
import React, { FC } from 'react';
import styled from './HeaderContainer.module.scss';

interface Props {}

/**
 * HeaderContainer
 *
 * @param {Props} { }
 */
export const HeaderContainer: FC<Props> = ({}) => {
  return (
    <div className={styled.root}>
      <Link href="/">
        <a className={styled.title}>空雲リファレンス2</a>
      </Link>
    </div>
  );
};
