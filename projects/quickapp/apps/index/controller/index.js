class M extends Controller {
  constructor(req, res, ctx) {
    super(ctx)
    let model = require('../model')
    this.model = new model(ctx.mysql)
    // extends Controller or do someting by yourself
    // this.request = req
    // this.response = res
    // this.session = ctx.session
  }

  indexAction (para) {
    // let header = this.request.headers()
    // console.log(header)
    return this.render('/test')
    
    return this.response.send(200, 'success', 111)
  }

  async test (act) {
    // 如果在入口不判断，则可以在路由里判断
    /*if (!this.jwt.verify()) {
      this.response.send(400, '未登录')
    } */

    let parag = await this.request.get()
    let para = await this.request.post()
    this.session.set('tes223', '32221')
    let r = await this.session.get()
    let res = await this.model.query()
    console.log({res})
    // this.session.unset('test')
    // this.session.clear()
    // console.log(this.check)
    // this.response.set('Access-Control-Allow-Origin', "*")
    return this.response.send(200, 'success', res)
  }

  async query (act) {
    let para = await this.request.post()
    let res = await this.model[act](para)
    return this.response.send(200, 'success', res)
  }

  html (page) {
    this.assign('key', '1')
    this.assign('obj', {i: 'test', d: 'ddddd'})
    return this.render('/html/' + page)
  }

  async login () {
    if (this.jwt.verify()) {
      this.response.send(200, '您已登录')
    }
    return this.response.send(200, 'success', 'login')
  }
}

module.exports = M