module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.[tj]s",
    "../projects/rbn-common-lib/src/**/*.stories.[tj]s",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-knobs",
    "@storybook/addon-a11y/register",
    "@storybook/addon-actions/register",
    "@storybook/addon-docs",
    '@storybook/addon-controls'
  ],
  core: {
    builder: 'webpack5',
  }
}
