import React, { FC, useEffect, useMemo, useState } from 'react';
import { useLoading } from '@/hooks/useLoading';
import { EditWindow } from '../EditWindow';

import {
  deleteDoc,
  deleteFile,
  deleteFiles,
  firestorage,
  firestore,
  getFileList,
  newClass,
  saveDoc,
  useFireDoc,
} from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';
import { ContentView } from '../../Contents/ContentView';
import styled from './ContentEditContainer.module.scss';
import { useRouter } from 'next/router';
import { useNotification } from '@/hooks/useNotification';
import { useMarkdownValues } from '@/hooks/useMarkdown';

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

    const vacumeImages = async () => {
      const markerImages = images
        .map((image) => {
          const v = decodeURIComponent(image).match(
            /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/.+\.appspot\.com\/o\/images\/(.+)\/(.+)\?/
          );
          return v && v[1] === id && v[2];
        })
        .filter((v) => v);
      const list = await getFileList(firestorage, `images/${id}`).then((list) =>
        list.filter((name) => !markerImages.includes(name))
      );
      return list.map((name) => deleteFile(firestorage, `images/${id}/${name}`));
    };
    Promise.all([
      saveDoc(firestore, content),
      saveDoc(firestore, contentBody),
      vacumeImages(),
    ]).then(() => {
      setStateSave('finished');
    });
  };
  const handleDelete = () => {
    setStateDelete('progress');
    Promise.all([
      deleteDoc(firestore, content),
      deleteDoc(firestore, contentBody),
      deleteFiles(firestorage, `images/${id}`),
    ]).then(() => {
      setStateDelete('finished');
    });
  };
  useNotification(stateSave, { progress: '保存しています', finished: '保存しました' });
  useNotification(stateDelete, { progress: '削除しています', finished: '削除しました' });
  useLoading([stateContent, stateBody]);
  const contentBody = useMemo(() => {
    if (stateBody !== 'finished') return undefined;
    if (srcBody) return newClass(ContentBody, srcBody);
    return newClass(ContentBody, { id, body: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcBody, stateBody, reset, id]);
  const content = useMemo(() => {
    if (stateContent !== 'finished') return undefined;
    return srcContent && newClass(Content, srcContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcContent, stateContent, reset]);
  useEffect(() => {
    if (stateDelete === 'finished') {
      router.replace('/');
    }
  }, [router, stateDelete]);
  const { titles, images } = useMarkdownValues(contentBody?.body);
  if (!content || !contentBody) return null;

  return (
    <div className={styled.root}>
      <ContentView titles={titles} content={content} contentBody={contentBody} />
      <div className={styled.edit}>
        <EditWindow
          content={content}
          contentBody={contentBody}
          onSave={handleSave}
          onClose={() => router.replace(`/contents/${id}`)}
          onUpdate={() => {
            setUpdate((v) => !v);
          }}
          onReset={() => {
            setReset((v) => !v);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
