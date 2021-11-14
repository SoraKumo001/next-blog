import React from 'react';
import { EditWindow } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Contents/EditWindow',
  decorators: [Decorator],
  component: EditWindow,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof EditWindow>[0]) => (
  <>
    <EditWindow {...args}></EditWindow>
  </>
);
Primary.args = {} as Parameters<typeof EditWindow>[0];

Primary.parameters = {};
