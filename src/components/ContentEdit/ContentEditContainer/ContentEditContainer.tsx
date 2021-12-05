import React, { FC, useEffect, useMemo, useState } from 'react';
import { useLoading } from '@/hooks/useLoading';
import { EditWindow } from '../EditWindow';

import {
  deleteDoc,
  firestorage,
  firestore,
  newClass,
  saveFireDoc,
  useFireDoc,
} from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';
import { ContentView } from '../../Contents/ContentView';
import styled from './ContentEditContainer.module.scss';
import { useRouter } from 'next/router';
import { useNotification } from '@/hooks/useNotification';
import { useMarkdownValues } from '@/hooks/useMarkdown';
import { dispatchMarkdown, useMarkdownEditor } from '@react-libraries/markdown-editor';
import { v4 as uuidv4 } from 'uuid';
import { convertWebp, getImageSize } from '@/libs/webp';
import { Application } from '@/types/Application';
import { deleteFile, deleteFiles, getFileList } from '@/libs/firebase/storage';
import { useFireUpload } from '@/libs/firebase/fileHooks';
interface Props {
  id?: string;
}

const ContentsImagePath = 'Contents';

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
  const { contents: settings } = useFireDoc(firestore, Application, 'root');
  const [stateSave, setStateSave] = useState<string>('idle');
  const [stateDelete, setStateDelete] = useState<string>('idle');

  const handleSave = () => {
    setStateSave('progress');

    const vacumeImages = async () => {
      const reg = new RegExp(
        `https://firebasestorage\.googleapis\.com/v0/b/${process.env.NEXT_PUBLIC_storageBucket}/o/${ContentsImagePath}/(.+)/(.+)\\?`
      );
      const markerImages = images
        .map((image) => {
          const v = decodeURIComponent(image).match(reg);
          return v && v[1] === id && v[2];
        })
        .filter((v) => v);
      const list = await getFileList(firestorage, `${ContentsImagePath}/${id}`).then((list) =>
        list.filter((name) => !markerImages.includes(name))
      );
      return list.map((name) => deleteFile(firestorage, `${ContentsImagePath}/${id}/${name}`));
    };
    Promise.all([
      saveFireDoc(firestore, content),
      saveFireDoc(firestore, contentBody),
      vacumeImages(),
    ]).then(() => {
      setStateSave('finished');
    });
  };
  const handleDelete = () => {
    setStateDelete('progress');
    firestore &&
      Promise.all([
        deleteDoc(firestore, content),
        deleteDoc(firestore, contentBody),
        deleteFiles(firestorage, `${ContentsImagePath}/${id}`),
      ]).then(() => {
        setStateDelete('finished');
      });
  };
  const contentBody = useMemo(() => {
    if (stateBody !== 'finished') return undefined;
    if (srcBody) return newClass(ContentBody, srcBody);
    return newClass(ContentBody, { id, body: '' });
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
  const event = useMarkdownEditor();
  const { state: uploadState, dispatch } = useFireUpload();
  const handleUpload = async (src: Blob) => {
    const value = await convertWebp(src);
    if (!value) throw 'conver error';
    const size = await getImageSize(value);
    firestorage &&
      dispatch(
        firestorage,
        `${ContentsImagePath}/${id}/${uuidv4()}.${value.type.split('/').pop() || ''}`,
        value,
        {
          contentType: value.type,
          cacheControl: 'public, max-age=31536000, immutable',
        }
      ).then((url) => {
        url &&
          dispatchMarkdown(event, {
            type: 'update',
            payload: {
              value: `![{"width":"${size.width}px","height":"${size.height}px"}](${url})\n`,
            },
          });
      });
  };
  useNotification(stateSave, { finished: '保存しました' });
  useNotification(stateDelete, { finished: '削除しました' });
  useLoading([stateContent, stateBody, stateSave, stateDelete, uploadState]);
  if (!content || !contentBody || !settings) return null;

  return (
    <div className={styled.root}>
      <ContentView
        titles={titles}
        content={content}
        contentBody={contentBody}
        directStorage={settings.directStorage}
      />
      <div className={styled.edit}>
        <EditWindow
          event={event}
          content={content}
          contentBody={contentBody}
          onSave={handleSave}
          onClose={() => router.replace(`/contents/${id}`, undefined, { scroll: false })}
          onUpdate={() => {
            setUpdate((v) => !v);
          }}
          onReset={() => {
            setReset((v) => !v);
          }}
          onDelete={handleDelete}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
};
