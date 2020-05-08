class Jwt {
  constructor(ctx, config = {}) {
    this.config = config;
    this.ctx = ctx;
  }

  create(token = {}) {
    const { screct, ttl } = this.config;
    let header = { typ: 'JWT', alg: 'HS256' };
    let payload = { token, expires: Date.now() + ttl * 1000 };

    header = global.Sec.base64encode(header);
    payload = global.Sec.base64encode(payload);
    const signature = global.Sec.sha256(`${header}.${payload}`, screct);

    this.body = {
      header,
      payload,
      signature,
    };

    return `${header}.${payload}.${signature}`;
  }

  decode(auth) {
    const { screct } = this.config;
    if (/^Bearer /.test(auth)) {
      auth = auth.slice(7).split('.').filter(String);
      if (auth.length) {
        const header = auth[0];
        const payload = auth[1];
        const signature = auth[2];
        try {
          const tmp = global.Sec.base64decode(payload);
          if (tmp.expires < Date.now()) {
            return '授权已过期';
          }
        } catch (e) {}
        return auth.length && global.Sec.sha256(`${header}.${payload}`, screct) === signature;
      }
    }
    return false;
  }

  verify() {
    const { white } = this.config;
    if (white && white.length && white.some((v) => this.ctx.request.pathname.indexOf(v) > -1)) {
      return true;
    }
    return this.decode(this.ctx.request.headers('Authorization'));
  }
}
module.exports = Jwt;
