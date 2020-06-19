const utils = require('../libs/utils');

class M {
  constructor(req, resp) {
    this.req = req;
    this.resp = resp;
  }
}
utils.defSinglePropOfClass(M, 'request', function () { return new (require('./router/request'))(this.req); });
utils.defSinglePropOfClass(M, 'response', function () { return new (require('./router/response'))(this.resp); });
utils.defSinglePropOfClass(M, 'sessionStrict', function () { return new (require('./session/redisStrict'))(this.get('session') || {}, this); });
utils.defSinglePropOfClass(M, 'session', function () { return new (require('./session/redis'))(this.get('session') || {}, this); });
utils.defSinglePropOfClass(M, 'jwt', function () { return new (require('./session/jwt'))(this, this.get('JWT')); });
utils.defSinglePropOfClass(M, 'cookie', function () { return new (require('./session/cookie'))(this); });
utils.defSinglePropOfClass(M, 'router', function () { return new (require('./router/router'))(this); });
module.exports = M;
