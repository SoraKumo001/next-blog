import React from 'react';
import { ContentTable } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Contents/ContentTable',
  decorators: [Decorator],
  component: ContentTable,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentTable>[0]) => (
  <>
    <ContentTable {...args}></ContentTable>
  </>
);
Primary.args = {} as Parameters<typeof ContentTable>[0];

Primary.parameters = {};
