import React, { FC } from 'react';
import styled from './ContentContainer.module.scss';
import { useLoading } from '@/hooks/useLoading';
import { firestore, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';
import { ContentView } from '../ContentView';
import IconEdit from '@mui/icons-material/EditOutlined';
import { useAdmin } from '@/hooks/useAdmin';
import { useRouter } from 'next/router';
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
  useLoading([stateContent, stateBody]);
  if (!content || !contentBody) return null;
  const handleClick = () => {
    router.replace(`/contents/${id}/edit`);
  };
  return (
    <div className={styled.root}>
      {isAdmin && (
        <div className={styled.edit} onClick={handleClick}>
          <IconEdit />
        </div>
      )}
      <ContentView content={content} contentBody={contentBody} />
    </div>
  );
};
