import React, { FC, useCallback } from 'react';
import styled from './ContentContainer.module.scss';
import { useLoading } from '@/hooks/useLoading';
import { firestore, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';
import { ContentView } from '../ContentView';
import IconEdit from '@mui/icons-material/EditOutlined';
import { useAdmin } from '@/hooks/useAdmin';
import { useRouter } from 'next/router';
import { useMarkdownValues } from '@/hooks/useMarkdown';
import { Application } from '@/types/Application';
interface Props {
  id?: string;
}

/**
 * ContentContainer
 *
 * @param {Props} { }
 */
export const ContentContainer: FC<Props> = ({ id }) => {
  const router = useRouter();
  const isAdmin = useAdmin();
  const { state: stateContent, contents: content } = useFireDoc(firestore, Content, id);
  const { state: stateBody, contents: contentBody } = useFireDoc(firestore, ContentBody, id);
  const { contents: settings } = useFireDoc(firestore, Application, 'root');
  const { titles } = useMarkdownValues(contentBody?.body);
  useLoading([stateContent, stateBody]);
  const handleClick = useCallback(() => {
    router.replace(`/contents/${id}/edit`);
  }, [id, router]);
  if (!content || !contentBody || !settings) return null;
  return (
    <div className={styled.root}>
      {isAdmin && (
        <div className={styled.edit} onClick={handleClick}>
          <IconEdit />
        </div>
      )}
      <ContentView
        titles={titles}
        content={content}
        contentBody={contentBody}
        directStorage={settings?.directStorage}
      />
    </div>
  );
};
