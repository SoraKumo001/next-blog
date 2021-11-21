import React from 'react';
import { ImageField } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Commons/ImageField',
  decorators: [Decorator],
  component: ImageField,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ImageField>[0]) => (
  <>
    <ImageField {...args}></ImageField>
  </>
);
Primary.args = {} as Parameters<typeof ImageField>[0];

Primary.parameters = {};
