import React, { FC } from 'react';
import styled from './ContentView.module.scss';
import { Content, ContentBody } from '@/types/Content';
import { ContentMarkdown } from '../ContentMarkdown';
import { ContentTable } from '../ContentTable';
import { Title } from '@/components/Commons/Title';
import { MarkdownTitles } from '@/hooks/useMarkdown';
import { LinkTarget } from '@/components/Commons/LinkTarget';
interface Props {
  titles?: MarkdownTitles;
  content: Content;
  contentBody: ContentBody;
  directStorage: boolean;
}

/**
 * ContentView
 *
 * @param {Props} { }
 */
export const ContentView: FC<Props> = ({ titles, content, contentBody, directStorage }) => {
  return (
    <div className={styled.root} key={content.id}>
      <Title>{content.title}</Title>
      <div className={styled.split}>
        <ContentTable title={content.title} titles={titles} />
        <div className={styled.contents}>
          <LinkTarget id="header-top" />
          <h1 className={styled.title}>{content.title}</h1>
          {contentBody && (
            <ContentMarkdown directStorage={directStorage}>{contentBody?.body}</ContentMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
