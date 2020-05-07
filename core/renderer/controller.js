class Controller {
  constructor(ctx) {
    this.request = ctx.request;
    this.response = ctx.response;
    this.sessionStrict = ctx.sessionStrict;
    this.session = ctx.session;
    this.cookie = ctx.cookie;
    this.jwt = ctx.jwt;
    this.template = ctx.template;
    this.ctx = ctx;
    this._init();
  }

  _init() {
    const jwt = this.ctx.get('jwt');
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

  render(path, params) {
    const { req, pathname, query } = this.request;
    const { res } = this.response;
    this.ctx.ssr.render(req, res, path || pathname, params || query);
  }

  assign(k, v) {
    return this.template.assign(k, v);
  }
}

module.exports = Controller;
