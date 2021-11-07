import React from 'react';
import { NewContents } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/System/Buttons/NewContents',
  decorators: [Decorator],
  component: NewContents,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof NewContents>[0]) => (
  <>
    <NewContents {...args}></NewContents>
  </>
);
Primary.args = {} as Parameters<typeof NewContents>[0];

Primary.parameters = {};
