import React from 'react';
import { ContentMarkdown } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Contents/ContentMarkdown',
  decorators: [Decorator],
  component: ContentMarkdown,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentMarkdown>[0]) => (
  <>
    <ContentMarkdown {...args}></ContentMarkdown>
  </>
);
Primary.args = {} as Parameters<typeof ContentMarkdown>[0];

Primary.parameters = {};
