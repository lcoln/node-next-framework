/* eslint-disable no-unused-vars */
// process.env.NODE_ENV = 'production';
const path = require('path');
const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
// const baseCdn = 'https://static.igeekee.cn/projs';
const withTM = require('next-transpile-modules')(['antd']);
const {
  cwd,
  isProd,
  project,
  packageJson,
} = require('./scripts/env');

const baseCdn = isProd ? 'https://static.igeekee.cn/projs' : '';

const { version, name } = packageJson;

module.exports = (phase) => {
  const assetPrefix = '';
  // const assetPrefix = isProd ? `${baseCdn}/${project}/${version}` : '';
  // console.log(__dirname);
  const aliases = {
    '@': path.join(cwd, 'projects', project, 'src'),
    pages: path.join(cwd, 'projects', project, 'src', 'pages'),
  };
  /* if (typeof require !== 'undefined') {
    require.extensions['.css'] = (file) => {};
    require.extensions['.less'] = (file) => {};
  } */
  const nextConfig = {
    // cssModules: true,
    // generateBuildId: async () => 'v1',
    lessLoaderOptions: {
      cssModules: true,
      javascriptEnabled: true,
    },
    antdLessLoaderOptions: {
      javascriptEnabled: true,
    },
    webpack: (config) => {
      // Add aliases
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ...aliases,
      };
      // console.log({ aliases });
      /* config.module.rules.push(
        {
          test: /.css/,
          use: 'css-loader',
        },
      ); */

      return config;
    },
    experimental: {
      css: true,
    },
    assetPrefix,
    distDir: '.next',
    target: isProd ? 'serverless' : 'server',
  };
  // console.log({ aliases });
  return withTM(withCss(withLess(nextConfig)));
  // return withLess(nextConfig);
};
