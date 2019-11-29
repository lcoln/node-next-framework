class M extends Controller {
  constructor(req, res, ctx) {
    super(ctx)
    // extends Controller or do someting by yourself
    // this.request = req
    // this.response = res
    // this.session = ctx.session
  }

  page (page) {
    return this.render('/html/' + page)
  }

}

module.exports = M