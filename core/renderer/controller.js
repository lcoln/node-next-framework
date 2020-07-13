const utils = require('../../libs/utils');

class Controller {
  constructor(ctx) {
    this.ctx = ctx;
    this._init();
  }

  _init() {
    const jwt = this.ctx.get('JWT');
    if (jwt) {
      // this.jwtPass = this.jwt.verify()
    } else {
      if (this.sessionStrict.isStart) {
        this.sessionStrict.start();
      }
      const cookieConfig = this.ctx.get('cookie');
      if (cookieConfig) {
        const cookie = this.request.headers('cookie');
        let cookieInfo = `NODESSID=${this.sessionStrict.uuid}; `;
        // eslint-disable-next-line no-unused-vars
        for (const i of Object.keys(cookieConfig)) {
          cookieInfo += `${i}=${cookieConfig[i]}; `;
        }
        if (this.sessionStrict.verify(cookie)) {
          this.cookie.set('Set-Cookie', cookieInfo);
        }
      }
    }
  }

  /* render (tpl) {
    let file = Utils.resolve(`${process.env.PWD}/views/${tpl}`)
    file = fs.isdir(file) ? file + '/index.tpl' : file
    let suff = Utils.suffix(file)

    if (!['html', 'htm', 'tpl', 'jsp', 'php', 'asp'].includes(suff))
      file += '.tpl'
    console.log({file})
    let content = fs.cat(file) + ''
    return this.template.render(content)
  } */

  /**
   * next.ssr
   * // 对应src/pages/pageName
   * @param {String} path
   * // 通过对应页面getInitialProps取到,params.page对应src/pages/pageName/[page]/${params.page}
   * @param {Object} params
   */
  render(path, params = {}) {
    const { req, pathname, query } = this.request;
    const { res } = this.response;
    path = path.split('/').map((v) => Utils.connectStrBy(v)).join('/');
    // console.log({ path, params });
    path = path && path.slice(-1) === '/' ? path.slice(0, -1) : path;
    this.ctx.isSSR = true;
    this.ctx.ssr.render(req, res, path || pathname, params || query);
    // this.ctx.ssr.close();
    // this.ctx.ssr.stopWatcher();
    // this.ctx.ssr.hotReloader.stop();
  }

  // assign(k, v) {
  //   return this.template.assign(k, v);
  // }
}
utils.defSinglePropOfClass(Controller, 'request', function () { return this.ctx.request; });
utils.defSinglePropOfClass(Controller, 'response', function () { return this.ctx.response; });
utils.defSinglePropOfClass(Controller, 'sessionStrict', function () { return this.ctx.sessionStrict; });
utils.defSinglePropOfClass(Controller, 'session', function () { return this.ctx.session; });
utils.defSinglePropOfClass(Controller, 'cookie', function () { return this.ctx.cookie; });
utils.defSinglePropOfClass(Controller, 'jwt', function () { return this.ctx.jwt; });
module.exports = Controller;
