const env = process.env.NODE_ENV;
module.exports = async function corsHandler(ctx, next) {
  // console.log('middleware cros', { env, ctx });
  // 白名单允许跨域处理
  if (env === 'development') {
    Utils.cross(ctx.response, '*');
  } else if (env === 'production') {
    // const host = ctx.request.headers('host');
    const origin = ctx.request.headers('origin');
    const cors = ctx.get('cors') || [];
    if (cors.some((v) => v.indexOf(origin.replace(/(https|http):\/\//, '')) > -1)) {
      // console.log('middleware cros', { origin, cors });
      Utils.cross(ctx.response, origin);
    }
    // if (cors.includes(host)) {
    //   Utils.cross(ctx.response, host);
    // }
  }
  await next();
};
