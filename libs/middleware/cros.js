const env = process.env.NODE_ENV;
module.exports = {
  async optionsHandler(ctx, next) {
    // options处理
    if (ctx.request.req.method === 'OPTIONS') {
      Utils.cross(ctx.response, '*');
      ctx.response.send(200);
      return;
    }

    await next();
  },
  async corsHandler(ctx, next) {
    // 白名单允许跨域处理
    if (env === 'development') {
      Utils.cross(ctx.response, '*');
    } else if (env === 'production') {
      const host = ctx.request.headers('host');
      const cors = ctx.get('cors') || [];
      if (cors.includes(host)) {
        Utils.cross(ctx.response, host);
      }
    }
    await next();
  },
};
