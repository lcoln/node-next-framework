const env = process.env.NODE_ENV;
module.exports = {
  async optionsHandler(ctx, next) {
    // options处理
    if (ctx.request.req.method === 'OPTIONS') {
      Utils.cross(ctx.resp, '*');
      ctx.resp.send(200);
      return;
    }

    await next();
  },
  async corsHandler(ctx, next) {
    console.log('middleware cros', { env, ctx });
    // 白名单允许跨域处理
    if (env === 'development') {
      Utils.cross(ctx.resp, '*');
    } else if (env === 'production') {
      // const host = ctx.request.headers('host');
      const origin = ctx.resp.headers('origin');
      const cors = ctx.get('cors') || [];
      console.log('middleware cros', { origin, cors });
      if (cors.some((v) => v.indexOf(origin) > -1)) {
        Utils.cross(ctx.resp, origin);
      }
      // if (cors.includes(host)) {
      //   Utils.cross(ctx.resp, host);
      // }
    }
    await next();
  },
};
