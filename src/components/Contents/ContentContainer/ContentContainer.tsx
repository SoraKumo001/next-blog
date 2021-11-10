import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from './ContentContainer.module.scss';
import { useLoading } from '@/hooks/useLoading';
import dynamic from 'next/dynamic';
import { EditWindow } from '../EditWindow';

import IconEdit from '@mui/icons-material/EditOutlined';
import { useNotification } from '@/hooks/useNotification';
import { ContentMarkdown } from '../ContentMarkdown';
import { firestore, newClass, saveDoc, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';

interface Props {
  id?: string;
}

/**
 * ContentContainer
 *
 * @param {Props} { }
 */
export const ContentContainer: FC<Props> = ({ id }) => {
  const { state: stateContent, contents: srcContent } = useFireDoc(firestore, Content, id);
  const { state: stateBody, contents: srcBody } = useFireDoc(firestore, ContentBody, id);
  const [edit, setEdit] = useState(false);
  const handleSave = () => {
    saveDoc(firestore, content!)
    saveDoc(firestore, contentBody!)
  };
  // useEffect(() => {
  //   state === 'finished' && setContent(srcContent);
  // }, [srcContent, state]);
  //useNotification(stateContent, { error: 'エラー' });

  const handleTitle = useCallback((title: string) => {
    // setContent((content) =>
    //   content && content?.parent?.title !== title ? { ...content, title } : undefined
    // );
  }, []);
  useLoading([stateContent, stateBody]);
  const contentBody = useMemo(() => {
    if (stateBody !== "finished")
      return undefined
    if (srcBody)
      return newClass(ContentBody, srcBody)
    return newClass(ContentBody, { id })
  }, [srcBody, stateBody])
  const content = useMemo(() => {
    if (stateContent !== "finished")
      return undefined
    return srcContent && newClass(Content, srcContent)
  }, [srcContent, stateContent])
  if (!content || !contentBody)
    return null

  return (
    <div className={styled.root}>
      <div className={styled.contents}>
        <div className={styled.edit} onClick={() => setEdit(true)}>
          <IconEdit />
        </div>
        <div>
          <h1>{content.title}</h1>
          {contentBody && <ContentMarkdown>{contentBody?.body}</ContentMarkdown>}
        </div>
        {edit && (
          <EditWindow
            content={content}
            contentBody={contentBody}
            onSave={handleSave}
            onClose={() => setEdit(false)}
          />
        )}
      </div>
    </div>
  );
};
