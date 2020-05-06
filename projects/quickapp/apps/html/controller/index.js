class M extends Controller {
  constructor(req, res, ctx) {
    super(ctx)
    // extends Controller or do someting by yourself
    // this.request = req
    // this.response = res
    // this.session = ctx.session
  }

  page (page) {
    return this.response.send(200, 'success', 111)
    return this.render('/test')
  }

}

module.exports = M