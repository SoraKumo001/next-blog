import React, { FC, useMemo, useState } from 'react';
import { useLoading } from '@/hooks/useLoading';
import { EditWindow } from '../EditWindow';

import IconEdit from '@mui/icons-material/EditOutlined';
import { firestore, newClass, saveDoc, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';
import { ContentView } from '../ContentView';
import styled from './ContentEditContainer.module.scss';
import { useRouter } from 'next/router';

interface Props {
  id?: string;
}

/**
 * ContentEditContainer
 *
 * @param {Props} { }
 */
export const ContentEditContainer: FC<Props> = ({ id }) => {
  const router = useRouter()
  const { state: stateContent, contents: srcContent } = useFireDoc(firestore, Content, id);
  const { state: stateBody, contents: srcBody } = useFireDoc(firestore, ContentBody, id);
  const handleSave = () => {
    saveDoc(firestore, content);
    saveDoc(firestore, contentBody);
  };
  useLoading([stateContent, stateBody]);
  const contentBody = useMemo(() => {
    if (stateBody !== 'finished') return undefined;
    if (srcBody) return newClass(ContentBody, srcBody);
    return newClass(ContentBody, { id });
  }, [srcBody, stateBody]);
  const content = useMemo(() => {
    if (stateContent !== 'finished') return undefined;
    return srcContent && newClass(Content, srcContent);
  }, [srcContent, stateContent]);
  if (!content || !contentBody) return null;

  return (
    <div className={styled.root}>
      <div className={styled.contents}>
        <ContentView content={content} contentBody={contentBody} />
        <EditWindow
          content={content}
          contentBody={contentBody}
          onSave={handleSave}
          onClose={() => router.push(`/contents/${id}`)}
        />
      </div>
    </div>
  );
};
