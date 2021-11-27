import { useAction } from '@/hooks/useAction';
import { useLoading } from '@/hooks/useLoading';
import { useNotification } from '@/hooks/useNotification';
import {
  firestorage,
  firestore,
  getFireDocs,
  getAllFiles,
  convertFirebaseEntity,
  saveFile,
  saveDoc,
} from '@/libs/firebase';
import { convertImageLink, convertUrl } from '@/libs/projectConverter';
import { Admin } from '@/types/Admins';
import { Application } from '@/types/Application';
import { Content, ContentBody } from '@/types/Content';
import { getBlob, ref } from 'firebase/storage';
import React, { FC, useRef } from 'react';
import { BaseFrame } from '../BaseFrame';
import styled from './Files.module.scss';

type DataType =
  | { type: 'document'; collection: 'string'; values: unknown }
  | { type: 'file'; path: string; value: string; contentType: string }
  | { type: 'storage'; value?: string };

interface Props {}

/**
 * Files
 *
 * @param {Props} { }
 */
export const Files: FC<Props> = ({}) => {
  const refInput = useRef<HTMLInputElement>(null);
  const { state: stateExport, dispatch: dispatchExport } = useAction();
  const { state: stateImport, dispatch: dispatchImport } = useAction();
  const exportFile = () => {
    dispatchExport(async () => {
      const values: unknown[] = [];

      values.push({ type: 'storage', value: process.env.NEXT_PUBLIC_storageBucket });
      firestorage.maxOperationRetryTime = 10;
      const files = await getAllFiles(firestorage);
      const promise = files.map((file) =>
        getBlob(ref(firestorage, file)).then(async (v) =>
          values.push({
            type: 'file',
            contentType: v.type,
            path: file,
            value: Buffer.from(await v.arrayBuffer()).toString('base64'),
          })
        )
      );
      await Promise.all(promise);
      for (const entiry of [Admin, Application, Content, ContentBody]) {
        values.push(...(await getFireDocs(firestore, entiry)));
      }
      const blob = new Blob([JSON.stringify(values)]);
      const objectURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = 'blog.json';
      a.href = objectURL;
      a.click();
    });
  };
  const importFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.currentTarget.files?.[0]) {
      const file = e.currentTarget.files?.[0];
      e.currentTarget.value = '';
      dispatchImport(async () => {
        if (!file) return;
        const values = JSON.parse(await file.text()) as DataType[];
        const storage = (
          values.find((value) => value.type === 'storage') as DataType & { type: 'storage' }
        )?.value;

        const files = (
          values.filter((value) => value.type === 'file') as (DataType & { type: 'file' })[]
        ).map((v) => {
          return saveFile(firestorage, v.path, Buffer.from(v.value, 'base64'), {
            contentType: 'image/webp',
            cacheControl: 'public, max-age=31536000, immutable',
          });
        });
        await Promise.all(files);

        const entities = values
          .filter((value) => value.type === 'document')
          .map(async (v) => {
            const entity = convertFirebaseEntity(v);
            if (entity instanceof Application) {
              if (storage && entity.cardUrl) {
                entity.cardUrl = await convertUrl(storage, entity.cardUrl);
              }
            } else if (entity instanceof ContentBody) {
              if (storage && entity.body) {
                entity.body = await convertImageLink(storage, entity.body);
              }
            }
            return saveDoc(firestore, entity);
          });
        await Promise.all(entities);
      });
    }
  };
  const handleInput = () => {
    refInput.current?.click();
  };
  useNotification(stateExport, { progress: 'exporting', error: 'error export' });
  useNotification(stateImport, {
    progress: 'importing',
    error: 'error import',
    finished: 'import complited',
  });
  useLoading([stateExport, stateImport]);
  return (
    <BaseFrame title="File Setting">
      <div className={styled.root}>
        <div className={styled.menu}>
          <div onClick={handleInput}>Import</div>
          <div onClick={exportFile}>Export</div>
        </div>
        <input
          ref={refInput}
          type="file"
          style={{ display: 'none' }}
          accept=".json"
          onChange={importFile}
        />
        <div className={styled.message}>
          <div>To run the export, you need to set this up beforehand.</div>
          <a href="https://cloud.google.com/storage/docs/configuring-cors">
            https://cloud.google.com/storage/docs/configuring-cors
          </a>
        </div>
      </div>
    </BaseFrame>
  );
};
