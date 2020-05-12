/* eslint-disable no-unused-vars */
const path = require('path');
const {
  isProd,
  project,
  packageJson,
} = require('./scripts/env');

// const baseCdn = 'https://static.igeekee.cn/projs';
const baseCdn = isProd ? 'http://imgtest.clickwifi.net/projs' : 'https://static.igeekee.cn/projs';

const { version, name } = packageJson;

module.exports = (phase, config, a) => {
  console.log();
  const assetPrefix = isProd ? `${baseCdn}/${name}/${version}` : '';
  console.log({ assetPrefix, isProd });
  return {
    generateBuildId: async () => 'v1',
    assetPrefix,
    distDir: '.next',
    target: isProd ? 'server' : 'serverless',
  };
};
