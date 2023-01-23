module.exports = {
  stories: ['../src/**/*.stories.@(tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  babel: async (options) => ({
    ...options,
    plugins: [...options.plugins, ['@babel/plugin-proposal-decorators', { legacy: true }]],
  }),
};
