import React from 'react';
import { ContentMarkdown } from '.';
import { Decorator } from '@/storybook';
import { firestore, useFireDoc } from '@/libs/firebase';
import { ContentBody } from '@/types/Content';
import { id } from 'date-fns/locale';

const StoryInfo = {
  title: 'Components/Contents/ContentMarkdown',
  decorators: [Decorator],
  component: ContentMarkdown,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentMarkdown>[0]) => {
  const id = 'yjmZIWXnHuv9kwg375v0';
  //const { contents: content } = useFireDoc(firestore, Content, id);
  const { contents: contentBody } = useFireDoc(firestore, ContentBody, id);
  return (
    <>
      <ContentMarkdown {...args}>{contentBody?.body}</ContentMarkdown>
    </>
  );
};
Primary.args = {} as Parameters<typeof ContentMarkdown>[0];

Primary.parameters = {};
