const tech = require('./libs/main')
const app = new tech()
const { resolve } = Utils
const env = process.env.NODE_ENV
/* const aow = require('./config/white/allow_origin_white')
const sessionConfig = require(`./config/cache/${env}_redis`)
const dbConfig = require(`./config/db/${env}_db`) */

app.set({
  BASE: __dirname,
  APPS: resolve(__dirname, './apps'),
  CORE: resolve(__dirname, './libs'),
  VIEWS: resolve(__dirname, './views'),
  TOOLS: resolve(__dirname, './libs/tools'),
  ISDEBUG: env === 'development' ? true : false,
  THROWERROR: [],
  /* session: {
    strict: true,   //ip + useragent
    ...sessionConfig
  },
  db: {
    ...dbConfig
  }, */
  jwt: {
    screct: '1111111',
    white: ['login']     // jwt白名单里的不进行token判断
  },
  // 设置了jwt与cookie时优先采用jwt, 默认cookie
  cookie: {
    domain: env === 'development' ? 'cncoders.tech' : 'cncoders.tech',
    httpOnly: true,
    // expires: new Date(Date.now() + 25000).toGMTString(),   // 过期时间, 单位GMT 或 UTC 格式的时间
    // 'max-age': 5,     // 过期时间, 优先级高于expires, 单位s
    path: '/'
  },
})
app.use(function (req, res, next) {
  // aow.includes(req.origin) && res.set('Access-Control-Allow-Origin', req.origin)
  this.mysql = new this.mysql(this.get('db'))
  /*this.mysql = new this.mysql({
    host: 'localhost', // IP/域名
    post: 3306, //端口， 默认 3306
    user: 'root', //用户名
  })*/

  // this.session.start()
  /*if (this.get('jwt')) {
    this.jwt.verify() ? next() : res.send(400, '未登录')
  } else if (this.get('session')) {
    this.session.verify() ? next() : res.send(400, '未登录')
  } else {
    next()
  }*/
})
/*app.use((req, res, next) => {
  res.send(200, 'succ')
  next()
})*/
app.start(8000)