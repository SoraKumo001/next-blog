import React, { FC } from 'react';
import styled from './ContentView.module.scss';
import { Content, ContentBody } from '@/types/Content';
import { ContentMarkdown } from '../ContentMarkdown';
import { ContentTable } from '../ContentTable';
import { Title } from '@/components/Commons/Title';
interface Props {
  content: Content;
  contentBody: ContentBody;
}

/**
 * ContentView
 *
 * @param {Props} { }
 */
export const ContentView: FC<Props> = ({ content, contentBody }) => {
  return (
    <div className={styled.root}>
      <Title>{content.title}</Title>
      <h1 className={styled.title}>{content.title}</h1>
      <div className={styled.split}>
        <ContentTable value={contentBody.body} />
        <div className={styled.contents}>
          {contentBody && <ContentMarkdown>{contentBody?.body}</ContentMarkdown>}
        </div>
      </div>
    </div>
  );
};
