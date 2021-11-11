import React, { FC } from 'react';
import styled from './ContentContainer.module.scss';
import { useLoading } from '@/hooks/useLoading';
import { firestore, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';
import { ContentView } from '../ContentView';
import IconEdit from '@mui/icons-material/EditOutlined';
import Link from 'next/link';
interface Props {
  id?: string;
}

/**
 * ContentContainer
 *
 * @param {Props} { }
 */
export const ContentContainer: FC<Props> = ({ id }) => {
  const { state: stateContent, contents: content } = useFireDoc(firestore, Content, id);
  const { state: stateBody, contents: contentBody } = useFireDoc(firestore, ContentBody, id);
  useLoading([stateContent, stateBody]);
  if (!content || !contentBody) return null;
  return (
    <div className={styled.root}>
      <Link href={`/contents/edit/${id}`}>
        <a className={styled.edit}>
          <IconEdit />
        </a>
      </Link>
      <ContentView content={content} contentBody={contentBody} />
    </div>
  );
};
