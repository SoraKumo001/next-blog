import { ContentMarkdown } from '@/components/Contents/ContentMarkdown';
import { useLoading } from '@/hooks/useLoading';
import { firestore, useFireDoc } from '@/libs/firebase';
import { Application } from '@/types/Application';
import { Content, ContentBody } from '@/types/Content';
import React, { FC } from 'react';
import styled from './ContentTopContainer.module.scss';

interface Props {}

/**
 * ContentTopContainer
 *
 * @param {Props} { }
 */
export const ContentTopContainer: FC<Props> = ({}) => {
  const id = '@top';
  const { state: state, contents: content } = useFireDoc(firestore, Content, id);
  const { state: stateBody, contents: contentBody } = useFireDoc(firestore, ContentBody, id);
  const { contents: settings } = useFireDoc(firestore, Application, 'root');
  useLoading([state, stateBody]);
  if (!contentBody || !settings || !content?.visible) return null;
  return (
    <div className={styled.root}>
      <div className={styled.title}>{content.title}</div>
      <div className={styled.contents}>
        <ContentMarkdown directStorage={settings.directStorage}>
          {contentBody?.body}
        </ContentMarkdown>
      </div>
    </div>
  );
};
