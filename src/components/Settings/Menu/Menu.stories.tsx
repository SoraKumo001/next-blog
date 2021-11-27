import React from 'react'
import { Menu } from '.'
import { Decorator } from '@/storybook'

const StoryInfo = {
  title: 'Components/Settings/Menu',
  decorators: [Decorator],
  component: Menu
}
export default StoryInfo;

export const Primary = (args: Parameters<typeof Menu>[0]) => (
  <>
    <Menu {...args}></Menu>
  </>
)
Primary.args = {} as Parameters<typeof Menu>[0]

Primary.parameters = {}
