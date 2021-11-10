import React from 'react';
import { ContentView } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/Contents/ContentView',
  decorators: [Decorator],
  component: ContentView,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentView>[0]) => (
  <>
    <ContentView {...args}></ContentView>
  </>
);
Primary.args = {} as Parameters<typeof ContentView>[0];

Primary.parameters = {};
