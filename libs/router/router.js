class M {
  constructor() {

  }

  async init() {
    let { APPS, ISDEBUG, THROWERROR } = this.get()
    try {
      let params = this.request.pathname.split('/').filter(v => v) || []
      if (!params.length) {
        params = ['index', 'index']
      } else if (params.length === 1) {
        params[1] = 'indexAction'
      }
      let act = params.shift()
      let func = params.shift() || 'index'
      let apps = require(Utils.resolve(APPS, act, 'controller'))
      apps = new apps(this.request, this.response, this)
      // console.log({apps, func})
      if (apps[func]) {
        await apps[func].apply(apps, params)
      } else {
        this.response.error('404', 'Func Not Found', true)
      }
    } catch (e) {
      let msg = ISDEBUG ? e.stack : '页面出错'
      /*if (THROWERROR.includes(this.request.pathname)) {
        this.response.error('404', msg, true)
      } else {
        this.response.error('404', msg)
      }*/
      console.log(e, {stack: e.stack})
      this.response.error('404', msg, true)
    }
  }
}

module.exports = M