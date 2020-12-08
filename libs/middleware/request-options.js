module.exports = async function optionsHandler(ctx, next) {
  // options处理
  // console.log({ send: ctx.response.send });
  if (ctx.request.req.method === 'OPTIONS') {
    Utils.cross(ctx.response, '*');
    ctx.response.send(200);
    return;
  }

  await next();
};
