module.exports = function (ctx) {
  for (let i in ctx) {
    ctx[i] = typeof ctx[i] === 'function' ? ctx[i].bind(ctx, this) : ctx[i]
  }
  return ctx
}