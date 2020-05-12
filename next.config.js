/* eslint-disable no-unused-vars */
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
  console.log();
  const assetPrefix = isProd ? `${baseCdn}/${name}/${version}` : '';
  return {
    generateBuildId: async () => 'v1',
    assetPrefix,
    distDir: '.next',
    target: isProd ? 'server' : 'serverless',
  };
};
