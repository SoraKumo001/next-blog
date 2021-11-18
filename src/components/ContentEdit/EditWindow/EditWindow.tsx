import React, { FC, memo } from 'react';
import styled from './EditWindow.module.scss';
import { VirtualWindow } from '@react-libraries/virtual-window';
import {
  dispatchMarkdown,
  MarkdownEditor,
  useMarkdownEditor,
} from '@react-libraries/markdown-editor';
import { Button, Switch, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import Box from '@mui/material/Box';
import { Content, ContentBody } from '@/types/Content';
import { firestorage, useFireUpload } from '@/libs/firebase';
import { v4 as uuidv4 } from 'uuid';
import { useLoading } from '@/hooks/useLoading';

export interface Props {
  content: Content;
  contentBody: ContentBody;
  onUpdate: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  onReset: () => void;
}

export type Action = { readonly type: 'reset'; payload: string };

/**
 * EditWindow
 *
 * @param {Props} { }
 */
// eslint-disable-next-line react/display-name
export const EditWindow: FC<Props> = memo(
  ({ content, contentBody, onUpdate, onClose, onSave, onReset, onDelete }) => {
    const event = useMarkdownEditor();
    const { state: uploadState, dispatch } = useFireUpload();
    const upload = async (value: Blob) => {
      dispatch(firestorage, `images/${content.id}/${uuidv4()}.png`, value, {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000, immutable',
      }).then((url) => {
        url &&
          dispatchMarkdown(event, {
            type: 'update',
            payload: { value: `![](${url})\n` },
          });
      });
    };
    useLoading([uploadState]);
    return (
      <VirtualWindow
        title="編集"
        clientClass={styled.root}
        onUpdate={({ state, init }) => {
          init && state === 'close' && onClose();
        }}
        width={1024}
        height={800}
        baseX={'center'}
        baseY={'center'}
      >
        <div className={styled.contents}>
          <Box className={styled.header} sx={{ boxShadow: 3 }}>
            <Button variant="contained" onClick={onSave}>
              保存
            </Button>
            <div className={styled.group}>
              <div className={styled.label}>Visible</div>
              <Switch
                defaultChecked={content.visible}
                onChange={(e) => (content.visible = e.currentTarget.checked)}
              />
            </div>
            <TextField
              className={styled.input}
              size="small"
              value={content.title}
              onChange={(e) => {
                content.title = e.currentTarget.value;
                onUpdate();
              }}
              label="Title"
            />

            <DateTimePicker
              inputFormat="yyyy/MM/dd HH:mm:ss"
              renderInput={(props) => <TextField {...props} size="small" type="datetime-local" />}
              label="Update"
              value={content?.updatedAt}
              onChange={(newValue) => {
                if (content && newValue) content.updatedAt = newValue;
              }}
              readOnly={true}
            />
            <Button variant="outlined" onClick={onDelete}>
              削除
            </Button>
            <Button variant="outlined" onClick={onReset}>
              リセット
            </Button>
          </Box>
          <MarkdownEditor
            className={styled.markdown}
            value={contentBody.body}
            onUpdate={(text) => {
              contentBody.body = text;
              onUpdate();
            }}
            event={event}
            onDragOver={(e) => {
              e.dataTransfer.dropEffect = 'move';
              e.stopPropagation();
              e.preventDefault();
            }}
            onPaste={() => {
              navigator.clipboard.read().then((items) => {
                items.forEach(async (item) => {
                  upload(await item.getType('image/png'));
                });
              });
            }}
            onDrop={(e) => {
              const length = e.dataTransfer.files.length;
              if (length) {
                e.stopPropagation();
                e.preventDefault();
                for (let i = 0; i < length; i++) {
                  upload(e.dataTransfer.files[i]);
                }
              }
            }}
          />
        </div>
      </VirtualWindow>
    );
  }
);
