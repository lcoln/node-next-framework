class M {
  constructor() {

  }

  async init() {
    let { APPS, ISDEBUG, THROWERROR } = this.get()
    try {
      let params = this.request.pathname.split('/').filter(v => v) || []
      if (!params.length) {
        params = ['index', 'indexAction']
      } else if (params.length === 1) {
        params[1] = 'indexAction'
      }
      let act = params.shift()
      let func = params.shift()
      // console.log({params})
      
      // ssr资源
      if (/(_next|favicon.ico)/.test(act)) {
        const { req, pathname, query } = this.request
        const { res } = this.response
        this.ssr.render(req, res, pathname, query)
      } else {
        // 否则走接口
        let apps = require(Utils.resolve(APPS, act, 'controller'))
        apps = new apps(this.request, this.response, this)
        // console.log({apps, func})
        if (apps[func]) {
          await apps[func].apply(apps, params)
        } else {
          this.response.error('404', 'Func Not Found', true)
        }
      }
      
    } catch (e) {
      let msg = ISDEBUG ? e.stack : '页面出错'
      console.log(e, {stack: e.stack})
      this.response.error('404', msg, true)
    }
  }
}

module.exports = M