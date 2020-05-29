class Jwt {
  constructor(ctx, config = {}) {
    this.config = config;
    this.ctx = ctx;
  }

  create(token = {}) {
    const { screct, ttl } = this.config;
    let header = { typ: 'JWT', alg: 'HS256' };
    let payload = { token, expires: Date.now() + ttl * 1000 };

    header = global.Sec.base64encode(JSON.stringify(header));
    payload = global.Sec.base64encode(JSON.stringify(payload));
    const signature = global.Sec.sha256(`${header}.${payload}`, screct).toString('hex');
    this.body = {
      header,
      payload,
      signature: `${signature}`,
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
          const tmp = JSON.parse(global.Sec.base64decode(payload));
          if (tmp.expires < Date.now()) {
            return '授权已过期';
          }
        // eslint-disable-next-line no-empty
        } catch (e) {}
        return auth.length && global.Sec.sha256(`${header}.${payload}`, screct).toString('hex') === signature;
      }
    }
    return false;
  }

  verify() {
    return this.decode(this.ctx.request.headers('Authorization'));
  }

  shouldJwt() {
    const { pathname } = this.ctx.request;
    const { routes } = this.config;
    let shouldJwt = false;
    if (routes) {
      // 是否在忽略的接口名单里
      const excludes = Utils.isArray(routes.excludes)
        && !routes.excludes.some((v) => pathname.slice(0, v.length) === v);
      // 是否在包含的接口名单里
      const includes = Utils.isArray(routes.includes)
        && routes.includes.some((v) => pathname.slice(0, v.length) === v);
      shouldJwt = excludes && includes;
    }
    return shouldJwt;
  }
}
module.exports = Jwt;
