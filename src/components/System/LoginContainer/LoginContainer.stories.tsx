import React from 'react'
import { LoginContainer } from '.'
import { Decorator } from '@/storybook'

const StoryInfo = {
  title: 'Components/System/LoginContainer',
  decorators: [Decorator],
  component: LoginContainer
}
export default StoryInfo;

export const Primary = (args: Parameters<typeof LoginContainer>[0]) => (
  <>
    <LoginContainer {...args}></LoginContainer>
  </>
)
Primary.args = {} as Parameters<typeof LoginContainer>[0]

Primary.parameters = {}
