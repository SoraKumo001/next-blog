import React from 'react';
import { Files } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Settings/Files',
  decorators: [Decorator],
  component: Files,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof Files>[0]) => (
  <>
    <Files {...args}></Files>
  </>
);
Primary.args = {} as Parameters<typeof Files>[0];

Primary.parameters = {};
