import React, { FC, memo, useEffect, useRef, useState } from 'react';
import styled from './EditWindow.module.scss';
import { VirtualWindow } from '@react-libraries/virtual-window';
import {
  dispatchMarkdown,
  MarkdownEditor,
  MarkdownEditorEvent,
  useMarkdownEditor,
} from '@react-libraries/markdown-editor';
import { Button, Switch, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import Box from '@mui/material/Box';
import { Content, ContentBody } from '@/types/Content';

export interface Props {
  // onUpdate: (content: EndPoints['get']['contents']) => void;
  // content: EndPoints['get']['contents'] | undefined;
  // srcContent: EndPoints['get']['contents'] | undefined;
  content: Content;
  contentBody: ContentBody;
  onUpdate?: any;
  onSave: () => void;
  onClose: () => void;
}

export type Action = { readonly type: 'reset'; payload: string };

/**
 * EditWindow
 *
 * @param {Props} { }
 */
// eslint-disable-next-line react/display-name
export const EditWindow: FC<Props> = memo(({ content, contentBody, onUpdate, onClose, onSave }) => {
  const refText = useRef<string>();
  const [text, setText] = useState(contentBody.body);
  const refs = useRef({ content, onUpdate });
  const event = useMarkdownEditor();

  refs.current = { content, onUpdate };
  useEffect(() => {
    const { content, onUpdate } = refs.current;
    const handle = setInterval(() => {
      const t = text;
      if (refText.current !== t) {
        refText.current = t;
        if (content) onUpdate({ ...content, body: t! });
      }
    }, 500);
    return () => clearInterval(handle);
  }, [text]);

  const handleReset = () => {
    // if (content && srcContent) {
    //   onUpdate({ ...content, body: srcContent.body });
    //   dispatchMarkdown(event, {
    //     type: 'update',
    //     payload: { value: srcContent.body, start: 0, end: -1 },
    //   });
    // }
  };
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
            <Switch onChange={(e) => console.log(e.target.checked)} />
          </div>
          <TextField
            className={styled.input}
            size="small"
            defaultValue={content?.title}
            label="Title"
          />
          {
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
          }
          <Button variant="outlined" onClick={handleReset}>
            リセット
          </Button>
        </Box>
        <MarkdownEditor
          className={styled.markdown}
          defaultValue={contentBody.body}
          onUpdate={setText}
          event={event}
        />
      </div>
    </VirtualWindow>
  );
});
