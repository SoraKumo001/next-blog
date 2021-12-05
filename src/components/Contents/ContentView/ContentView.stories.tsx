import React from 'react';
import { ContentView } from '.';
import { Decorator } from '@/storybook';
import { firestore, useFireDoc } from '@/libs/firebase';
import { Content, ContentBody } from '@/types/Content';

const StoryInfo = {
  title: 'Components/Contents/ContentView',
  decorators: [Decorator],
  component: ContentView,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentView>[0]) => {
  const id = 'yjmZIWXnHuv9kwg375v0';
  const { contents: content } = useFireDoc(firestore, Content, id);
  const { contents: contentBody } = useFireDoc(firestore, ContentBody, id);
  if (!content || !contentBody) return null;
  return (
    <>
      <ContentView {...args} content={content} contentBody={contentBody}></ContentView>
    </>
  );
};
Primary.args = {} as Parameters<typeof ContentView>[0];

Primary.parameters = {};
