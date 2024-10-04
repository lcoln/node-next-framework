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

    const signature = global.Sec.hmac('sha256', `${header}.${payload}`, screct);
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
          // console.log({ tmp });
          if (tmp.expires < Date.now()) {
            return '授权已过期';
          }
        // eslint-disable-next-line no-empty
        } catch (e) {}
        // const test = global.Sec.sha256(`${header}.${payload}`, screct);
        const sign = global.Sec.hmac('sha256', `${header}.${payload}`, screct);
        // console.log({ test, signature });
        return auth.length && sign === signature;
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
      const hasExclides = Utils.isArray(routes.excludes)
      const hasIncludes = Utils.isArray(routes.includes)
      const defaultConfig = [
        ...(hasExclides ? routes.excludes : []),
        ...(hasIncludes ? routes.includes : []),
      ]
      if (!defaultConfig.some((v) => pathname.slice(0, v.length) === v)) {
        return true
      }
      // 是否在忽略的接口名单里
      const excludes = hasExclides
        && !routes.excludes.some((v) => pathname.slice(0, v.length) === v);
      // 是否在包含的接口名单里
      const includes = hasIncludes
        && routes.includes.some((v) => pathname.slice(0, v.length) === v);
      shouldJwt = excludes && includes;
    }
    return shouldJwt;
  }

  async get(){
    let jwt = await this.ctx.session.get(this.ctx.request.headers('x-token'));
    try {
      jwt = JSON.parse(jwt)
    } catch (e) {}
    return jwt;
  }
}
module.exports = Jwt;
