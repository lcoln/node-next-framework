require('./tools/es.shim')
const Http = require('http')
const Request = require('./router/request')
const Response = require('./router/response')
const Router = require('./router/router')
const Redis = require('./session/redis')
const Cookie = require('./session/cookie')
const Mysql = require('./dbmanager/mysql')
const utils = require('./tools/utils')
const crypto = require('crypto.js')
const config = require('./configure')
// let Mysql = require('mysqli')

class M {
  constructor(dir) {
    global.Controller = require('./renderer/controller')
    global.Utils = utils(this)
    global.Sec = crypto
    this.__CONFIG__ = config() || {}
    this.__QUEUE__ = []
    this._init()
  }

  _init () {
    this.jwt = Utils.bind(require('./session/jwt'))
    this.template = Utils.bind(require('./renderer/template'))
    this.router = new Router()
    this.cookie = new Cookie(this)
    this.mysql = Mysql
    // this.mysql = new Mysql(this.get('db'))
  }

  set (obj) {
    for (let i in obj) {
      if (!Utils.isArray(obj[i])) {
        if (!this.__CONFIG__[i]) {
          this.__CONFIG__[i] = obj[i]
        } else {
          try {
            Object.assign(this.__CONFIG__, obj)
          } catch (err) {
            console.log(err)
          }
        }
      } else {
        this.__CONFIG__[i] = obj[i]
      }
    }
    return this
  }

  // 获取全局配置
  get (key) {
    if (!key)
      return this.__CONFIG__
    try {
      return this.__CONFIG__[key]
    } catch (err) {
      console.log(err)
      return null
    }
  }
  
  start (port) {
    Http
    .createServer(async (request, response) => {
      this.request = new Request(request)
      this.response = new Response(response)
      this.session = new Redis(this.get('session') || {}, this)
      let _this = this
      ;(async function next () {
        if (!_this.__QUEUE__.length) {
          return
        }
        let cb = _this.__QUEUE__.shift()
        Utils.isFunction(cb) && await cb(_this.request, _this.response, next)
      })();
      this.router.init.call(this)
    })
    .listen(port, '0.0.0.0');
  }

  use (cb) {
    this.__QUEUE__.push(cb.bind(this))
  }
}
module.exports = M