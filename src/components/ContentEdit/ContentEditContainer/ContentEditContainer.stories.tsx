import React from 'react';
import { ContentEditContainer } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Contents/ContentEditContainer',
  decorators: [Decorator],
  component: ContentEditContainer,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentEditContainer>[0]) => (
  <>
    <ContentEditContainer {...args}></ContentEditContainer>
  </>
);
Primary.args = {} as Parameters<typeof ContentEditContainer>[0];

Primary.parameters = {};
