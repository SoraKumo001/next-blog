import React, { FC } from 'react';
import styled from './ContentContainer.module.scss';
import { useLoading } from '@/hooks/useLoading';
import { firestore, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';
import { ContentView } from '../ContentView';
import IconEdit from '@mui/icons-material/EditOutlined';
import Link from 'next/link';
import { Title } from '@/components/Commons/Title';
import { useAdmin } from '@/hooks/useAdmin';
interface Props {
  id?: string;
}

/**
 * ContentContainer
 *
 * @param {Props} { }
 */
export const ContentContainer: FC<Props> = ({ id }) => {
  const isAdmin = useAdmin();
  const { state: stateContent, contents: content } = useFireDoc(firestore, Content, id);
  const { state: stateBody, contents: contentBody } = useFireDoc(firestore, ContentBody, id);
  useLoading([stateContent, stateBody]);
  if (!content || !contentBody) return null;
  return (
    <div className={styled.root}>
      {isAdmin && (
        <Link href={`/contents/${id}/edit`}>
          <a className={styled.edit}>
            <IconEdit />
          </a>
        </Link>
      )}
      <ContentView content={content} contentBody={contentBody} />
    </div>
  );
};
