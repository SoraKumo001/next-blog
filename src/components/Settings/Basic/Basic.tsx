import { ImageField } from '@/components/Commons/ImageField';
import { useAction } from '@/hooks/useAction';
import { useLoading } from '@/hooks/useLoading';
import { useNotification } from '@/hooks/useNotification';
import { firestorage, firestore, saveFireDoc, useFireDoc } from '@/libs/firebase';
import { saveFile } from '@/libs/firebase/storage';
import { Application } from '@/types/Application';
import { Button, Switch, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useRef } from 'react';
import { BaseFrame } from '../BaseFrame';
import styled from './Basic.module.scss';

interface Props { }

/**
 * Basic
 *
 * @param {Props} { }
 */
export const Basic: FC<Props> = ({ }) => {
  const router = useRouter();
  const { state, contents } = useFireDoc(firestore, Application, 'root');
  const { state: stateUpdate, dispatch } = useAction();
  const property = useRef<{ image?: Blob | null }>({}).current;
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(async () => {
        const url =
          property.image &&
          (await saveFile(firestorage, 'application/card.webp', property.image, {
            contentType: 'image/webp',
          }));
        if (property.image !== undefined) contents!.cardUrl = url || '';
        await saveFireDoc(firestore, contents!);
      });
    },
    [contents, dispatch, property]
  );
  const handleCancel: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      router.push('/');
    },
    [router]
  );
  useLoading([state, stateUpdate]);
  useNotification(stateUpdate, { finished: '設定を保存しました' });
  if (!contents)
    return null;

  return (
    <BaseFrame title="Basic Settings">
      <div className={styled.root}>
        <form className={styled.form} onSubmit={handleSubmit}>
          <TextField
            spellCheck={false}
            label="Title"
            size="small"
            name="title"
            fullWidth
            defaultValue={contents.title}
            onChange={(e) => {
              contents.title = e.currentTarget.value;
            }}
          />
          <TextField
            label="Host"
            size="small"
            name="host"
            fullWidth
            defaultValue={contents.host}
            onChange={(e) => (contents.host = e.currentTarget.value)}
          />
          <TextField
            label="Description"
            size="small"
            name="description"
            fullWidth
            defaultValue={contents.description}
            onChange={(e) => (contents.description = e.currentTarget.value)}
          />
          <div className={styled.line}>
            <Switch
              defaultChecked={contents.directStorage}
              onChange={(e) => (contents.directStorage = e.currentTarget.checked)}
            />
            <a
              href={`https://console.cloud.google.com/storage/browser/${process.env.NEXT_PUBLIC_storageBucket};tab=permissions`}
            >
              Direct Cloud Storage
              <br />
              (Need read permission for `allUser`)
            </a>
          </div>
          <ImageField
            className={styled.image}
            onChange={(v) => (property.image = v)}
            src={contents?.cardUrl}
            width={320}
          >
            OGP Image
          </ImageField>
          <div className={styled.buttons}>
            <Button variant="outlined" type="submit">
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </BaseFrame>
  );
};
