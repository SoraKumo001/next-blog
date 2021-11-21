import React from 'react';
import { Settings } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/System/Buttons/Settings',
  decorators: [Decorator],
  component: Settings,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof Settings>[0]) => (
  <>
    <Settings {...args}></Settings>
  </>
);
Primary.args = {} as Parameters<typeof Settings>[0];

Primary.parameters = {};
