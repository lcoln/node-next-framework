// 执行process异常监听
require('./log/process');
require('../libs/es.shim');

const Http = require('http');
const Crypto = require('crypto.js');
const Next = require('next');
const Fs = require('iofs');
const Mysql = require('./dbmanager/mysql');
const Context = require('./context');

const utils = require('../libs/utils');
const config = require('./configure');
const commonMiddleWare = require('../libs/middleware');
// let Mysql = require('mysqli')
const dev = process.env.NODE_ENV !== 'production';

class M {
  constructor(rootDir) {
    // eslint-disable-next-line no-proto
    // 已从web标准废弃
    // Context.prototype.__proto__ = this;
    Reflect.setPrototypeOf(Context.prototype, this);
    global.Controller = require('./renderer/controller');
    global.Utils = utils(this);
    global.Sec = Crypto;
    global.Fs = Fs;
    global.APP = this;
    this.__CONFIG__ = config() || {};
    // 预先加载options处理与跨域处理中间件
    this.__QUEUE__ = commonMiddleWare;
    this._init(rootDir);
  }

  _init(rootDir) {
    // this.template = global.Utils.bind(require('./renderer/template'));
    this.ssr = Next({
      dev,
      dir: rootDir,
    });
    this.Mysql = Mysql;
  }

  set(obj) {
    // eslint-disable-next-line no-unused-vars
    for (const i in obj) {
      if (!global.Utils.isArray(obj[i]) && !global.Utils.isObject(obj[i])) {
        this.__CONFIG__[i] = obj[i];
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
      // console.log(err);
      return null;
    }
  }

  start(port) {
    // this.ssr.prepare().then(() => {
      Http
        .createServer(async (req, resp) => {
          try {
            const ctx = new Context(req, resp);
            let i = -1;
            if (/(_next|favicon.ico|static\/chunks)/.test(ctx.request.pathname)) {
              ctx.router.ssrRender();
              return;
            }
            const nextFunc = async function () {
              i++;
              if (!ctx.__QUEUE__.length || ctx.__QUEUE__.length <= i) {
                await ctx.router.init();
                return;
              }
              const cb = ctx.__QUEUE__[i];
              if (global.Utils.isFunction(cb)) {
                await cb(ctx, nextFunc);
              }
            };
            await nextFunc();
            // 如果不是走ssr则返回请求结果
            if (!ctx.isSSR) {
              ctx.response.end();
            }
          } catch (e) {
            this.ctx.log.error('外层框架报错', e);
          }
        })
        .listen(port, '0.0.0.0');
    // });
  }

  use(cb) {
    this.__QUEUE__.push(cb.bind(this));
  }
}
module.exports = M;
