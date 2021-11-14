import React from 'react';
import { Title } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Commons/Title',
  decorators: [Decorator],
  component: Title,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof Title>[0]) => (
  <>
    <Title {...args}></Title>
  </>
);
Primary.args = {} as Parameters<typeof Title>[0];

Primary.parameters = {};
