const fs = require('iofs')
class Controller {
  constructor(ctx) {
    this.request = ctx.request
    this.response = ctx.response
    this.session = ctx.session
    this.cookie = ctx.cookie
    this.jwt = ctx.jwt
    this.template = ctx.template
    this.ctx = ctx
    this._init()
  }

  _init () {
    let jwt = this.ctx.get('jwt')
    if (jwt) {
      // this.jwtPass = this.jwt.verify()
    } else {
      !this.session.isStart && this.session.start()
      let cookieConfig = this.ctx.get('cookie')
      if (cookieConfig) {
        let cookie = this.request.headers('cookie')
        let cookieInfo = `NODESSID=${this.session.uuid}; `
        for (let i in cookieConfig) {
          cookieInfo += `${i}=${cookieConfig[i]}; `
        }
        !this.session.verify(cookie) && this.cookie.set('Set-Cookie', cookieInfo)
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

  render (path) {
    const { req, pathname, query } = this.request
    const { res } = this.response
    this.ctx.app.render(req, res, path || pathname, query)
  }

  assign (k, v) {
    return this.template.assign(k, v)
  }
}

module.exports = Controller