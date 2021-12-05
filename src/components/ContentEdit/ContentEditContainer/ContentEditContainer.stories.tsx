import React from 'react';
import { ContentEditContainer } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/ContentEdit/ContentEditContainer',
  decorators: [Decorator],
  component: ContentEditContainer,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentEditContainer>[0]) => (
  <>
    <ContentEditContainer {...args}></ContentEditContainer>
  </>
);
Primary.args = { id: 'yjmZIWXnHuv9kwg375v0' } as Parameters<typeof ContentEditContainer>[0];

Primary.parameters = {};
