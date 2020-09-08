/* eslint-disable no-unused-vars */

const { cat } = require('iofs');

/* eslint-disable prefer-spread */
class M {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async init() {
    const { APPS, ISDEBUG /* , SSRS */ } = this.ctx.get();
    const { act, func, params } = this.makeParams();
    try {
      // 以'_'开头的函数为私有函数
      if (func[0] !== '_') {
        let App = {};
        try {
          App = require(global.Utils.resolve(APPS, act, 'controller'));
        } catch (e) { }
        if (!App) {
          try {
            this.ssrRender();
          } catch (err) {
            const msg = ISDEBUG ? e.stack : '页面出错';
            this.response.error('404', msg);
            this.ctx.log.error('ssr渲染出错', msg);
            // ssr error log
          }
          return;
        }
        if (!Utils.isFunction(App.prototype[func])) {
          this.ctx.response.error('404', 'Func Not Found', true);
          return;
        }
        App = new App(this.ctx);

        const val = App[func];
        try {
          await val.apply(App, params);
          return;
        } catch (e) {
          const msg = ISDEBUG ? e.stack : '页面出错';
          this.ctx.response.error('400', msg, true);
          this.ctx.log.error('apps路由调用错误', msg);
          // apps error log
          return;
        }
      }
    // eslint-disable-next-line no-empty
    } catch (e) {
      // apps error log
      return;
    }
    try {
      this.ssrRender();
    } catch (err) {
      const msg = ISDEBUG ? e.stack : '页面出错';
      this.response.error('404', msg);
      this.ctx.log.error('ssr渲染出错', msg);
      // ssr error log
    }
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
    this.ctx.isSSR = true;
    const { req, pathname, query } = this.ctx.request;
    const { res } = this.ctx.response;
    this.ctx.ssr.render(req, res, pathname, query);
  }
}

module.exports = M;
