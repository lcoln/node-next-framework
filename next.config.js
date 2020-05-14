/* eslint-disable no-unused-vars */
// process.env.NODE_ENV = 'production';
const path = require('path');
const withLess = require('@zeit/next-less');
const {
  cwd,
  isProd,
  project,
  packageJson,
} = require('./scripts/env');

// const baseCdn = 'https://static.igeekee.cn/projs';
const baseCdn = isProd ? 'https://static.igeekee.cn/projs' : '';

const { version, name } = packageJson;

module.exports = (phase) => {
  // const assetPrefix = isProd ? `${baseCdn}/${name}/${version}` : '';
  const assetPrefix = isProd ? `${baseCdn}/${project}/${version}` : '';
  // console.log({ assetPrefix, isProd });
  const aliases = {
    '@': path.join(cwd, 'src'),
  };
  // console.log({ aliases });
  return withLess({
    // generateBuildId: async () => 'v1',
    webpack: (config) => {
      // Add aliases
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ...aliases,
      };
      // console.log({ alias: config.resolve.alias });

      return config;
    },
    assetPrefix,
    distDir: '.next',
    target: isProd ? 'serverless' : 'server',
  });
};
