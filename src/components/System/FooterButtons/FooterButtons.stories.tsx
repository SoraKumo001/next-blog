import React from 'react';
import { FooterButtons } from '.';
import { Decorator } from '@/storybook';

const StoryInfo = {
  title: 'Components/System/FooterButtons',
  decorators: [Decorator],
  component: FooterButtons,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof FooterButtons>[0]) => (
  <>
    <FooterButtons {...args}></FooterButtons>
  </>
);
Primary.args = {} as Parameters<typeof FooterButtons>[0];

Primary.parameters = {};
