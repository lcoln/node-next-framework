/* eslint-disable no-unused-vars */
// process.env.NODE_ENV = 'production';
const path = require('path');
const {
  isProd,
  project,
  packageJson,
} = require('./scripts/env');

// const baseCdn = 'https://static.igeekee.cn/projs';
const baseCdn = isProd ? 'https://static.igeekee.cn/projs' : 'http://imgtest.clickwifi.net/projs';

const { version, name } = packageJson;

module.exports = (phase, config, a) => {
  // const assetPrefix = isProd ? `${baseCdn}/${name}/${version}` : '';
  const assetPrefix = `${baseCdn}/${project}/${version}`;
  // console.log({ assetPrefix, isProd });
  return {
    // generateBuildId: async () => 'v1',
    assetPrefix,
    distDir: '.next',
    target: isProd ? 'serverless' : 'server',
  };
};
