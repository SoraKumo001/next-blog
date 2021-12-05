import React from 'react';
import { EditWindow } from '.';
import { Decorator } from '@/storybook';
import { firestore, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';

const StoryInfo = {
  title: 'Components/ContentEdit/EditWindow',
  decorators: [Decorator],
  component: EditWindow,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof EditWindow>[0]) => {
  const id = 'yjmZIWXnHuv9kwg375v0';
  const { contents: content } = useFireDoc(firestore, Content, id);
  const { contents: contentBody } = useFireDoc(firestore, ContentBody, id);
  if (!content || !contentBody) return null;
  return (
    <>
      <EditWindow {...args} content={content} contentBody={contentBody}></EditWindow>
    </>
  );
};
Primary.args = {} as Parameters<typeof EditWindow>[0];

Primary.parameters = {};
