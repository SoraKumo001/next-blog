import React, { FC, memo } from 'react';
import styled from './EditWindow.module.scss';
import { VirtualWindow } from '@react-libraries/virtual-window';
import { MarkdownEditor, MarkdownEvent } from '@react-libraries/markdown-editor';
import { Button, Switch, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import Box from '@mui/material/Box';
import { Content, ContentBody } from '@/types/Content';

export interface Props {
  event: MarkdownEvent;
  content: Content;
  contentBody: ContentBody;
  onUpdate: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  onReset: () => void;
  onUpload: (blob: Blob) => void;
}

export type Action = { readonly type: 'reset'; payload: string };

/**
 * EditWindow
 *
 * @param {Props} { }
 */
// eslint-disable-next-line react/display-name
export const EditWindow: FC<Props> = memo(
  ({ content, contentBody, event, onUpdate, onClose, onSave, onReset, onDelete, onUpload }) => {
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
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                onSave();
              }
            }}
            onDragOver={(e) => {
              e.dataTransfer.dropEffect = 'move';
              e.stopPropagation();
              e.preventDefault();
            }}
            onPaste={() => {
              navigator.clipboard.read().then((items) => {
                items.forEach(async (item) => {
                  onUpload(await item.getType('image/png'));
                });
              });
            }}
            onDrop={(e) => {
              const length = e.dataTransfer.files.length;
              if (length) {
                e.stopPropagation();
                e.preventDefault();
                for (let i = 0; i < length; i++) {
                  onUpload(e.dataTransfer.files[i]);
                }
              }
            }}
          />
        </div>
      </VirtualWindow>
    );
  }
);
