import { useMarkdownTitles } from '@/hooks/useMarkdown';
import React, { FC } from 'react';
import styled from './ContentTable.module.scss';
import Link from 'next/link';
interface Props {
  title?: string;
  value?: string;
}

/**
 * ContentTable
 *
 * @param {Props} { }
 */
export const ContentTable: FC<Props> = ({ title, value }) => {
  const titles = useMarkdownTitles(value);
  return (
    <div className={styled.root}>
      <div className={styled.box}>
        <div className={styled.title}>目次</div>
        <Link href={`#header-top`}>
          <a className={styled.item}>･ {title}</a>
        </Link>
        {titles.map(({ text, depth }, index) => (
          <Link key={index} href={`#header-${index}`}>
            <a className={styled.item} style={{ marginLeft: 16 * depth + 'px' }}>
              ･ {text}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};
