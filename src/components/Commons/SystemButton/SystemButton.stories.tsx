import React from 'react';
import { SystemButton } from '.';
import { Decorator } from '@/storybook';
import Icon from '@mui/icons-material/Home';

const StoryInfo = {
  title: 'Components/Commons/SystemButton',
  decorators: [Decorator],
  component: SystemButton,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof SystemButton>[0]) => (
  <>
    <SystemButton {...args}></SystemButton>
  </>
);
Primary.args = { icon: <Icon />, children: 'Home' } as Parameters<typeof SystemButton>[0];

Primary.parameters = {};
