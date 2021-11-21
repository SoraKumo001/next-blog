import React from 'react';
import { Basic } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Settings/Basic',
  decorators: [Decorator],
  component: Basic,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof Basic>[0]) => (
  <>
    <Basic {...args}></Basic>
  </>
);
Primary.args = {} as Parameters<typeof Basic>[0];

Primary.parameters = {};
