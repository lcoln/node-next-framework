/* eslint-disable no-unused-vars */
// process.env.NODE_ENV = 'production';
const webpack = require('webpack');
const path = require('path');
const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const withImages = require('next-images');
// const baseCdn = 'https://static.igeekee.cn/projs';
// eslint-disable-next-line import/no-extraneous-dependencies
const withTM = require('next-transpile-modules')(['antd']);

// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {
  cwd, isProd, project, packageJson,
} = require('./scripts/env');

const baseCdn = isProd ? 'https://static.igeekee.cn/projs' : '';

const {
  version,
  name,
} = packageJson;

module.exports = (phase) => {
  const assetPrefix = '';
  // const assetPrefix = isProd ? `${baseCdn}/${project}/${version}` : '';
  // console.log(__dirname);
  const projectsDir = path.join(cwd, 'projects');
  const aliases = {
    '@': path.join(cwd, 'projects', project, 'src'),
    pages: path.join(cwd, 'projects', project, 'src', 'pages'),
    projects: projectsDir,
    'lib-provider': path.join(cwd, 'projects', 'lib-provider'),
  };
  /* if (typeof require !== 'undefined') {
    require.extensions['.css'] = (file) => {};
    require.extensions['.less'] = (file) => {};
  } */
  const nextConfig = {
    // cssModules: true,
    // generateBuildId: async () => 'v1',
    /* lessLoaderOptions: {
      cssModules: true,
      javascriptEnabled: true,
    }, */
    /* antdLessLoaderOptions: {
      javascriptEnabled: true,
    }, */
    webpack: (config, options) => {
      // Add aliases
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ...aliases,
      };

      // console.log(config.module.rules[4]);
      // config.module.rules[4].use = [
      //   {
      //     loader: MiniCssExtractPlugin.loader,
      //     options: {
      //       hmr: process.env.NODE_ENV === 'development',
      //     },
      //   },
      //   'css-loader',
      //   'postcss-loader',
      //   'less-loader',
      // ];
      const entry = config.entry;
      config.entry = async function () {
        const res = await entry();
        return res;
      };
      config.module.rules[0].include.push(projectsDir);
      if (config.target === 'web') {
        // if (config.optimization.splitChunks) {
        //   // delete config.optimization.splitChunks.cacheGroups.styles;
        //   // config.optimization.splitChunks.cacheGroups.styles.minSize = 0;
        //   // config.optimization.splitChunks.cacheGroups.styles.maxSize = 10000;
        //   config.optimization.splitChunks.cacheGroups.styles.chunks = 'async';
        // }
        config.externals.push({
          electron: `(function () {
            if (typeof require !== 'undefined') {
              return require("electron")
            }
            return null
          })()`,
        });

        config.module.rules.push({
          test: /\.(css|less)$/,
          resourceQuery: /useable/,
          use: [{
            loader: 'style-loader/useable',
          }, {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          }, 'less-loader'],
        });

        config.module.rules.push({
          test: /\.(css|less)$/,
          use: [{
            loader: 'style-loader',
          }, {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          }, 'less-loader'],
        });
      } else {
        config.module.rules.push({
          test: /\.(css|less)$/,
          resourceQuery: /useable/,
          use: [{
            loader: require.resolve(
              path.resolve(__dirname, './scripts/ssrUseableLoader.js'),
            ),
          }],
        });

        config.module.rules.push({
          test: /\.(css|less)$/,
          use: [{
            loader: require.resolve(
              path.resolve(__dirname, './scripts/ssrStyleLoader.js'),
            ),
          }],
        });
      }
      const ssr = packageJson && packageJson.config && packageJson.config.ssr;
      config.module.rules.push({
        resourceQuery: /ssrLayout/,
        use: [{
          loader: require.resolve(
            path.resolve(__dirname, './scripts/ssrLayoutLoader.js'),
          ),
          options: {
            ssr,
          },
        }],
      });
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.ssr': `"${ssr}"`,
        }),
      );
      return config;
    },
    // experimental: {
    //   css: true,
    // },
    assetPrefix,
    distDir: '.next',
    target: isProd ? 'serverless' : 'server',
  };
  // console.log({ aliases });
  /* return withPlugins([
    [withLess],
    [withCss],
    [withTM],
  ], nextConfig); */
  // return withTM([withLess, withCss], nextConfig);
  // return withLess(nextConfig);
  // return withTM(withLess(nextConfig));
  // if (process.env.NODE_ENV === 'production') {
  //   return withTM(withCss(withLess(nextConfig)));
  // }
  return withImages(withTM(nextConfig));

  // return withPlugins([withLess, withCss, withTM], nextConfig);
  // return withTM(nextConfig);
  // return withLess(nextConfig);
  // return nextConfig;
};
