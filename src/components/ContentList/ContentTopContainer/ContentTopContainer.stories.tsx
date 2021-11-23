import React from 'react';
import { ContentTopContainer } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/ContentList/ContentTopContainer',
  decorators: [Decorator],
  component: ContentTopContainer,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentTopContainer>[0]) => (
  <>
    <ContentTopContainer {...args}></ContentTopContainer>
  </>
);
Primary.args = {} as Parameters<typeof ContentTopContainer>[0];

Primary.parameters = {};
