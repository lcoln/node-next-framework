const msg = require('./http-code-msg.json')
class M {
  constructor(res) {
    this.res = res;
    this.lock = false     //如果同时发送两次请求将锁住
  }

  setHeader (key, val) {
    this.res.setHeader(key, val)
  }

  header (key = '') {
    return this.res.getHeader(key)
  }

  send (code = 200, msg, data, type = {'Content-Type': 'application/json; charset=utf-8'}) {
    if (this.lock)
      return
    this.res.writeHead(code, type)
    let out = { code, msg, data }
    this.end(JSON.stringify(out))
  }

  end (msg) {
    this.lock = true
    this.res.end(msg)
  }

  error (code, msg, end) {
    if (!end)
      return this.send(code, msg)
    this.res.writeHead(code, {'Content-Type': 'text/html; charset=utf-8'})
    this.end(`<fieldset><legend>Http Status: ${code}</legend><pre>${msg}</pre></fieldset>`)
  }
}

module.exports = M