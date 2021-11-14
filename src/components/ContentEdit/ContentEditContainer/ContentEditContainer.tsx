import React, { FC, useMemo, useState } from 'react';
import { useLoading } from '@/hooks/useLoading';
import { EditWindow } from '../EditWindow';

import { deleteDoc, firestore, newClass, saveDoc, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';
import { ContentView } from '../../Contents/ContentView';
import styled from './ContentEditContainer.module.scss';
import { useRouter } from 'next/router';
import { useNotification } from '@/hooks/useNotification';

interface Props {
  id?: string;
}

/**
 * ContentEditContainer
 *
 * @param {Props} { }
 */
export const ContentEditContainer: FC<Props> = ({ id }) => {
  const router = useRouter();
  const [_, setUpdate] = useState(false);
  const [reset, setReset] = useState(false);
  const { state: stateContent, contents: srcContent } = useFireDoc(firestore, Content, id);
  const { state: stateBody, contents: srcBody } = useFireDoc(firestore, ContentBody, id);
  const [stateSave, setStateSave] = useState<string>('idle');
  const [stateDelete, setStateDelete] = useState<string>('idle');
  const handleSave = () => {
    setStateSave('progress');
    Promise.all([saveDoc(firestore, content), saveDoc(firestore, contentBody)]).then(() => {
      setStateSave('finished');
    });
  };
  const handleDelete = () => {
    setStateDelete('progress');
    Promise.all([deleteDoc(firestore, content), deleteDoc(firestore, contentBody)]).then(() => {
      setStateDelete('finished');
    });
  };
  useNotification(stateSave, { progress: '保存しています', finished: '保存しました' });
  useNotification(stateDelete, { progress: '削除しています', finished: '削除しました' });
  useLoading([stateContent, stateBody]);
  const contentBody = useMemo(() => {
    if (stateBody !== 'finished') return undefined;
    if (srcBody) return newClass(ContentBody, srcBody);
    return newClass(ContentBody, { id });
  }, [srcBody, stateBody, reset]);
  const content = useMemo(() => {
    if (stateContent !== 'finished') return undefined;
    return srcContent && newClass(Content, srcContent);
  }, [srcContent, stateContent, reset]);
  if (!content || !contentBody) return null;

  return (
    <div className={styled.root}>
      <ContentView content={content} contentBody={contentBody} />
      <div className={styled.edit}>
        <EditWindow
          content={content}
          contentBody={contentBody}
          onSave={handleSave}
          onClose={() => router.push(`/contents/${id}`)}
          onUpdate={() => {
            setUpdate((v) => !v);
          }}
          onReset={() => {
            setReset((v) => !v);
          }}
          onDelete={() => {
            handleDelete();
          }}
        />
      </div>
    </div>
  );
};
