import Link from 'next/link';
import React, { FC } from 'react';
import styled from './Menu.module.scss';
import { BaseFrame } from '../BaseFrame';
interface Props {}

/**
 * Menu
 *
 * @param {Props} { }
 */
export const Menu: FC<Props> = ({}) => {
  return (
    <BaseFrame title="Setting Menu">
      <div className={styled.root}>
        <Link href="/settings/basic">
          <a>Basic</a>
        </Link>
        <Link href="/settings/files">
          <a>Import/Export</a>
        </Link>
      </div>
    </BaseFrame>
  );
};
