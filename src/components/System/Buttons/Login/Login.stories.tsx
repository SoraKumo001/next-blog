import React from 'react';
import { Login } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/System/Buttons/Login',
  decorators: [Decorator],
  component: Login,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof Login>[0]) => (
  <>
    <Login {...args}></Login>
  </>
);
Primary.args = {} as Parameters<typeof Login>[0];

Primary.parameters = {};
