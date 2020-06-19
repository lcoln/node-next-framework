/* eslint-disable no-unused-vars */
/* eslint-disable prefer-spread */
class M {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async init() {
    const { APPS, ISDEBUG /* , SSRS */ } = this.ctx.get();
    // console.log({ APPS });
    const { act, func, params } = this.makeParams();
    try {
      // console.log({params})
      if (func[0] !== '_') {
        // ssr资源
        let App = {};
        try {
          App = require(global.Utils.resolve(APPS, act, 'controller'));
          if (!Utils.isFunction(App.prototype[func])) {
            this.ctx.response.error('404', 'Func Not Found', true);
            return;
          }
          App = new App(this.ctx);
        } catch (e) {
          // console.log({ e });
          this.ctx.response.error('400', `${e}`);
          return;
        }
        // console.log({ func });
        const val = App[func];
        try {
          await val.apply(App, params);
          return;
        } catch (e) {
          const msg = ISDEBUG ? e.stack : '页面出错';
          // console.log(e, { stack: e.stack });
          this.ctx.response.error('404', msg, true);
          return;
        }
      }
    // eslint-disable-next-line no-empty
    } catch (e) { }
    this.ssrRender();
  }

  makeParams() {
    let params = this.ctx.request.pathname.split('/').filter((v) => v) || [];
    if (!params.length) {
      params = ['index', 'indexAction'];
    } else if (params.length === 1) {
      params[1] = 'indexAction';
    }
    const act = params.shift();
    const func = params.shift();
    return { act, func, params };
  }

  async ssrRender() {
    const { req, pathname, query } = this.ctx.request;
    const { res } = this.ctx.response;
    this.ctx.ssr.render(req, res, pathname, query);
    /* try {
      let SSR = require(global.Utils.resolve(SSRS, act, 'controller'));
      SSR = new SSR(request, ctx.response, ctx);
      if (SSR[func]) {
        try {
          await SSR[func].apply(SSR, params);
        } catch (e) {
          ctx.response.error('404', 'Func Not Found', true);
        }
      }
    } catch (e) {
      ctx.ssr.render(req, res, pathname, query);
    } */
  }
}

module.exports = M;
