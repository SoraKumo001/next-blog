import { useMarkdownTitles } from '@/hooks/useMarkdown';
import React, { FC } from 'react';
import styled from './ContentTable.module.scss';

interface Props {
  value?: string;
}

/**
 * ContentTable
 *
 * @param {Props} { }
 */
export const ContentTable: FC<Props> = ({ value }) => {
  const titles = useMarkdownTitles(value);
  return (
    <div className={styled.root}>
      <div className={styled.box}>
        {titles.map(({ text, depth }, index) => (
          <a
            className={styled.item}
            key={index}
            href={`#${index}`}
            style={{ marginLeft: 16 * depth - 16 + 'px' }}
          >
            ･ {text}
          </a>
        ))}
      </div>
    </div>
  );
};
