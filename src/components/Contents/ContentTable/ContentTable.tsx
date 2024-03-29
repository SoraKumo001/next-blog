import { MarkdownTitles, useMarkdownValues } from '@/hooks/useMarkdown';
import React, { FC } from 'react';
import styled from './ContentTable.module.scss';
import Link from 'next/link';
interface Props {
  title?: string;
  titles?: MarkdownTitles;
  value?: string;
}

/**
 * ContentTable
 *
 * @param {Props} { }
 */
export const ContentTable: FC<Props> = ({ title, titles }) => {
  return (
    <nav className={styled.root}>
      <div className={styled.box}>
        <div className={styled.title}>目次</div>
        <Link href={`#header-top`} className={styled.item}>
          <li>{title}</li>
        </Link>
        {titles?.map(({ text, depth }, index) => (
          <Link
            key={index}
            href={`#header-${index}`}
            className={styled.item}
            style={{ marginLeft: 16 * depth + 'px' }}
          >
            <li>{text}</li>
          </Link>
        ))}
      </div>
    </nav>
  );
};
