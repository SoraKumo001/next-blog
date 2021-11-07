import React from 'react';
import { ContentListContainer } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Contents/ContentListContainer',
  decorators: [Decorator],
  component: ContentListContainer,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentListContainer>[0]) => (
  <>
    <ContentListContainer {...args}></ContentListContainer>
  </>
);
Primary.args = {} as Parameters<typeof ContentListContainer>[0];

Primary.parameters = {};
