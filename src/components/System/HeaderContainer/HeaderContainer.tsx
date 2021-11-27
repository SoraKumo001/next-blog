import { firestore, useFireDoc } from '@/libs/firebase';
import { Application } from '@/types/Application';
import Link from 'next/link';
import React, { VFC } from 'react';
import IconApp from '@mui/icons-material/HomeOutlined';
import styled from './HeaderContainer.module.scss';

interface Props {}

/**
 * HeaderContainer
 *
 * @param {Props} { }
 */
export const HeaderContainer: VFC<Props> = () => {
  const { contents } = useFireDoc(firestore, Application, 'root');
  return (
    <header className={styled.root}>
      <Link href="/">
        <a className={styled.title}>
          <IconApp />
          {contents?.title}
        </a>
      </Link>
    </header>
  );
};
