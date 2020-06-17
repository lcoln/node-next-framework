/* eslint-disable prefer-spread */
class M {
  async init() {
    const { APPS, ISDEBUG /* , SSRS */ } = this.get();
    // console.log({ APPS });
    const makeParams = () => {
      let params = this.request.pathname.split('/').filter((v) => v) || [];
      if (!params.length) {
        params = ['index', 'indexAction'];
      } else if (params.length === 1) {
        params[1] = 'indexAction';
      }
      const act = params.shift();
      const func = params.shift();
      return { act, func, params };
    };

    const { act, func, params } = makeParams();

    const ssrRender = async () => {
      const { req, pathname, query } = this.request;
      const { res } = this.response;
      this.ssr.render(req, res, pathname, query);
      /* try {
        let SSR = require(global.Utils.resolve(SSRS, act, 'controller'));
        SSR = new SSR(this.request, this.response, this);
        if (SSR[func]) {
          try {
            await SSR[func].apply(SSR, params);
          } catch (e) {
            this.response.error('404', 'Func Not Found', true);
          }
        }
      } catch (e) {
        this.ssr.render(req, res, pathname, query);
      } */
    };

    const funcError = (e) => {
      const msg = ISDEBUG ? e.stack : '页面出错';
      // console.log(e, { stack: e.stack });
      this.response.error('404', msg, true);
    };

    try {
      // console.log({params})
      if (func[0] !== '_') {
        // ssr资源
        let App = {};
        try {
          App = require(global.Utils.resolve(APPS, act, 'controller'));
          if (typeof App.prototype[func] !== 'function') {
            this.response.error('404', 'Func Not Found', true);
            return;
          }
          App = new App(this);
        } catch (e) {
          // console.log({ e });
          this.response.error('400', `${e}`);
          return;
        }
        // console.log({ func });
        const val = App[func];
        try {
          await val.apply(App, params);
          return;
        } catch (e) {
          // console.log({ e });
          funcError(e);
          return;
        }
      }
    // eslint-disable-next-line no-empty
    } catch (e) { }
    ssrRender();
  }
}

module.exports = M;
