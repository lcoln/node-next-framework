class M {
  constructor(ctx) {
    this.ctx = ctx;
    this.isStart = false;
  }

  set(key, val) {
    this.ctx.response.setHeader(key, val);
  }

  get() {

  }
}

module.exports = M;
