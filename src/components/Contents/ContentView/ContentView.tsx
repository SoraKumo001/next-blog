import React, { FC } from 'react';
import styled from './ContentView.module.scss';
import { Content, ContentBody } from '@/types/Content';
import { ContentMarkdown } from '../ContentMarkdown';
import { ContentTable } from '../ContentTable';
import { Title } from '@/components/Commons/Title';
import { MarkdownTitles } from '@/hooks/useMarkdown';
interface Props {
  titles?: MarkdownTitles;
  content: Content;
  contentBody: ContentBody;
}

/**
 * ContentView
 *
 * @param {Props} { }
 */
export const ContentView: FC<Props> = ({ titles, content, contentBody }) => {
  return (
    <div className={styled.root}>
      <Title>{content.title}</Title>
      <div className={styled.split}>
        <ContentTable title={content.title} titles={titles} />
        <div className={styled.contents}>
          <h1 className={styled.title}>{content.title}</h1>
          {contentBody && <ContentMarkdown>{contentBody?.body}</ContentMarkdown>}
        </div>
      </div>
    </div>
  );
};
