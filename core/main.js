require('../libs/es.shim');
const Http = require('http');
const Crypto = require('crypto.js');
const Next = require('next');
const Fs = require('iofs');
const Request = require('./router/request');
const Response = require('./router/response');
const Router = require('./router/router');
const RedisStrict = require('./session/redisStrict');
const Redis = require('./session/redis');
const Cookie = require('./session/cookie');
const Mysql = require('./dbmanager/mysql');

const utils = require('../libs/utils');
const config = require('./configure');
// let Mysql = require('mysqli')
const dev = process.env.NODE_ENV !== 'production';

class M {
  constructor(rootDir) {
    global.Controller = require('./renderer/controller');
    global.Utils = utils(this);
    global.Sec = Crypto;
    global.Fs = Fs;
    global.APP = this;
    this.__CONFIG__ = config() || {};
    this.__QUEUE__ = [];
    this._init(rootDir);
  }

  _init(rootDir) {
    this.jwt = global.Utils.bind(require('./session/jwt'));
    this.template = global.Utils.bind(require('./renderer/template'));
    this.router = new Router();
    this.cookie = new Cookie(this);
    console.log({ dev });
    this.ssr = Next({
      dev,
      dir: rootDir,
    });
    this.Mysql = Mysql;
  }

  set(obj) {
    // eslint-disable-next-line no-unused-vars
    for (const i in obj) {
      if (!global.Utils.isArray(obj[i])) {
        if (!this.__CONFIG__[i]) {
          this.__CONFIG__[i] = obj[i];
        } else {
          try {
            Object.assign(this.__CONFIG__, obj);
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        this.__CONFIG__[i] = obj[i];
      }
    }
    return this;
  }

  // 获取全局配置
  get(key) {
    if (!key) { return this.__CONFIG__; }
    try {
      return this.__CONFIG__[key];
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  start(port) {
    this.ssr.prepare().then(() => {
      Http
        .createServer(async (request, response) => {
          this.request = new Request(request);
          this.response = new Response(response);
          this.sessionStrict = new RedisStrict(this.get('session') || {}, this);
          this.session = new Redis(this.get('session') || {}, this);
          const _this = this;
          (async function nextFunc(i) {
            if (!_this.__QUEUE__.length || _this.__QUEUE__.length <= i) {
              return;
            }
            const cb = _this.__QUEUE__[i];
            if (global.Utils.isFunction(cb)) {
              await cb(_this.request, _this.response, nextFunc.bind(null, i + 1));
            }
          }(0));
          this.router.init.call(this);
        })
        .listen(port, '0.0.0.0');
    });
  }

  use(cb) {
    this.__QUEUE__.push(cb.bind(this));
  }
}
module.exports = M;
