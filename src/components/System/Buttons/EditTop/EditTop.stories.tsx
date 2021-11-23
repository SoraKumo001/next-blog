import React from 'react';
import { EditTop } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/System/Buttons/EditTop',
  decorators: [Decorator],
  component: EditTop,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof EditTop>[0]) => (
  <>
    <EditTop {...args}></EditTop>
  </>
);
Primary.args = {} as Parameters<typeof EditTop>[0];

Primary.parameters = {};
