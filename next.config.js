module.exports = (phase, {defaultConfig}) => {
  // console.log({defaultConfig})
  // http://jartto.wang/
  return {
    distDir: '.next',
    // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    //   // Note: we provide webpack above so you should not `require` it
    //   // Perform customizations to webpack config
    //   // Important: return the modified config
    //   // console.log({config, isServer})
    //   config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
    //   return config
    // },
    // webpackDevMiddleware: null
    // webpackDevMiddleware: (config) => {
    //   console.log(config.watchOptions.ignored)
    //   config.watchOptions = config.watchOptions || {};
    //   config.watchOptions.ignored = [
    //     // Don't watch _any_ files for changes
    //     '*'
    //   ];
    //   config.serverSideRender = false
    //   return config;
    // },
    /* config options here */
  }
}