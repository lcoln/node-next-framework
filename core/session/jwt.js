function jwt () {
  let { jwtScrect } = this.get('session')
  this.header = Sec.base64encode({
    'typ': 'JWT',
    'alg': 'HS256'
  })
  this.payload = Sec.base64encode(payload)
  this.signature = Sec.sha256(`${header}.${payload}`, jwtScrect)
  this.ctx = {
    header: {
      'typ': 'JWT',
      'alg': 'HS256'
    },
    payload
  }
  return `${this.header}.${this.payload}.${this.signature}`
}
jwt.decode = function (auth) {
  if (/^Bearer /.test(auth)) {
    auth = auth.slice(7).split('.').filter(String)
    return auth.length && Sec.sha256(`${auth[0]}.${auth[1]}`, jwtScrect) === auth[2]
  }
  return false
}
jwt.verify = function (ctx) {
  const { white } = ctx.get('jwt')
  if (white && white.length && white.some(v => ctx.request.pathname.indexOf(v) > -1)) {
    return true
  }
  return this.decode(ctx.request.headers('Authorization'))
}

module.exports = jwt