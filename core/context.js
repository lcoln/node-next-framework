const { v4: uuidv4 } = require('uuid');
const utils = require('../libs/utils');

class M {
  constructor(req, resp) {
    this.req = req;
    this.resp = resp;
    this.requestId = uuidv4();
  }
}
utils.defSinglePropOfClass(M, 'request', function () { return new (require('./router/request'))(this.req); });
utils.defSinglePropOfClass(M, 'response', function () { return new (require('./router/response'))(this.resp, this.requestId); });
utils.defSinglePropOfClass(M, 'sessionStrict', function () { return new (require('./session/redisStrict'))(this.get('session') || {}, this); });
utils.defSinglePropOfClass(M, 'session', function () { return new (require('./session/redis'))(this.get('session') || {}, this); });
utils.defSinglePropOfClass(M, 'jwt', function () { return new (require('./session/jwt'))(this, this.get('JWT')); });
utils.defSinglePropOfClass(M, 'cookie', function () { return new (require('./session/cookie'))(this); });
utils.defSinglePropOfClass(M, 'router', function () { return new (require('./router/router'))(this); });
utils.defSinglePropOfClass(M, 'log', function () { return new (require('./log'))(this); });
module.exports = M;
