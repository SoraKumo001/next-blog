import React from 'react';
import { BaseFrame } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Settings/BaseFrame',
  decorators: [Decorator],
  component: BaseFrame,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof BaseFrame>[0]) => (
  <>
    <BaseFrame {...args}></BaseFrame>
  </>
);
Primary.args = {} as Parameters<typeof BaseFrame>[0];

Primary.parameters = {};
