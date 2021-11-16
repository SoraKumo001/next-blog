import React from 'react';
import { HeaderContainer } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/System/HeaderContainer',
  decorators: [Decorator],
  component: HeaderContainer,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof HeaderContainer>[0]) => (
  <>
    <HeaderContainer {...args}></HeaderContainer>
  </>
);
Primary.args = {} as Parameters<typeof HeaderContainer>[0];

Primary.parameters = {};
