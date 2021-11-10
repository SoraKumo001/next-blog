import React, { FC } from 'react';
import styled from './ContentView.module.scss';
import { Content, ContentBody } from '@/types/Content';
import { ContentMarkdown } from '../ContentMarkdown';
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
      <h1>{content.title}</h1>
      {contentBody && <ContentMarkdown>{contentBody?.body}</ContentMarkdown>}
    </div>
  );
};
