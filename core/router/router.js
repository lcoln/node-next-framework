class M {
  async init() {
    const { APPS, ISDEBUG } = this.get();
    try {
      let params = this.request.pathname.split('/').filter((v) => v) || [];
      if (!params.length) {
        params = ['index', 'indexAction'];
      } else if (params.length === 1) {
        params[1] = 'indexAction';
      }
      const act = params.shift();
      const func = params.shift();
      // console.log({params})

      // ssr资源
      if (/(_next|favicon.ico)/.test(act)) {
        const { req, pathname, query } = this.request;
        const { res } = this.response;
        this.ssr.render(req, res, pathname, query);
      } else {
        // 否则走接口
        let App = require(global.Utils.resolve(APPS, act, 'controller'));
        App = new App(this.request, this.response, this);
        // console.log({App, func})
        if (App[func]) {
          // eslint-disable-next-line prefer-spread
          await App[func].apply(App, params);
        } else {
          this.response.error('404', 'Func Not Found', true);
        }
      }
    } catch (e) {
      const msg = ISDEBUG ? e.stack : '页面出错';
      console.log(e, { stack: e.stack });
      this.response.error('404', msg, true);
    }
  }
}

module.exports = M;
