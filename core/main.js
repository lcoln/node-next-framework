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
const path = require('path')
// let Mysql = require('mysqli')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'

class M {
  constructor(rootDir) {
    global.Controller = require('./renderer/controller')
    global.Utils = utils(this)
    global.Sec = crypto
    this.__CONFIG__ = config() || {}
    this.__QUEUE__ = []
    this._init(rootDir)
  }

  _init (rootDir) {
    this.jwt = Utils.bind(require('./session/jwt'))
    this.template = Utils.bind(require('./renderer/template'))
    this.router = new Router()
    this.cookie = new Cookie(this)
    this.mysql = Mysql
    this.ssr = next({ 
      dev,
      dir: rootDir
    })
    // console.log(this.ssr)
    /* const publish = this.ssr.hotReloader.webpackHotMiddleware.publish.bind(
      this.ssr.hotReloader.webpackHotMiddleware,
    );
  
    // Intercept publish events so we can send something custom
    this.ssr.hotReloader.webpackHotMiddleware.publish = (event, ...rest) => {
      let forwardedEvent = event;
  
      // upgrade from a "change" to a "reload" event to trick the browser into reloading
      if (event.action === 'change') {
        forwardedEvent = {
          action: 'reload',
          // Only `/_document` pages will trigger a full browser refresh, so we force it here.
          data: [],
        };
      }
  
      // Forward the (original or upgraded) event on to the browser
      publish(forwardedEvent, ...rest);
    }; */
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
    this.ssr.prepare().then(() => {
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
    })
  }

  use (cb) {
    this.__QUEUE__.push(cb.bind(this))
  }
}
module.exports = M