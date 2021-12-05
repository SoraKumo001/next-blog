import React from 'react';
import { ContentContainer } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Contents/ContentContainer',
  decorators: [Decorator],
  component: ContentContainer,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentContainer>[0]) => (
  <>
    <ContentContainer {...args}></ContentContainer>
  </>
);
Primary.args = { id: 'yjmZIWXnHuv9kwg375v0' } as Parameters<typeof ContentContainer>[0];

Primary.parameters = {};
