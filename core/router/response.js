// const msg = require('./http-code-msg.json');

class M {
  constructor(res, requestId) {
    this.res = res;
    this.requestId = requestId;
    this.lock = false; // 如果同时发送两次请求将锁住
    // this.code
    this.resHeader = { };
    // this.body
  }

  setHeader(key, val) {
    // this.res.setHeader(key, val);
    this.resHeader[key] = val;
  }

  header(key = '') {
    const val = this.resHeader[key];
    if (val) return val;
    return this.res.getHeader(key);
  }

  /**
   * [redirect 页面跳转]
   * @param  {String} url [要跳转的URL]
   * @param  {Boolean} f   [是否永久重定向]
   */
  redirect(url, f = false) {
    if (this.lock) {
      return;
    }
    if (!/^(http[s]?|ftp):\/\//.test(url)) {
      url = `//${url}`;
    }

    this.setHeader('Location', url);
    this.sendwithRestful(f ? 301 : 302);
    this.end('');
  }

  sendwithRestful(
    code = 200,
    msg,
    data,
    type = { 'Content-Type': 'application/json; charset=utf-8' },
  ) {
    if (this.lock) {
      return;
    }
    this.code = code;
    this.setHeader('Content-Type', type['Content-Type']);
    // this.res.writeHead(code, type);
    const out = {
      code, msg, data, requestId: this.requestId,
    };
    this.body = JSON.stringify(out);
    // this.end(JSON.stringify(out));
  }

  send(
    code = 200,
    msg,
    data,
    type = { 'Content-Type': 'application/json; charset=utf-8' },
  ) {
    if (this.lock) {
      return;
    }
    // console.log({ type });
    const out = {
      code, msg, data, requestId: this.requestId,
    };
    this.code = 200;
    this.setHeader('Content-Type', type['Content-Type']);
    // this.res.writeHead(200, type);
    this.body = JSON.stringify(out);
    // this.end(JSON.stringify(out));
  }

  error(code, msg, end) {
    if (this.lock) {
      return;
    }
    if (!end) {
      this.send(code, msg);
      return;
    }
    this.code = code;
    this.setHeader('Content-Type', 'text/html; charset=utf-8');
    // this.res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
    this.body = `<fieldset><legend>Http Status: ${code}</legend><pre>${msg}</pre></fieldset>`;
    // this.end(
    //   `<fieldset><legend>Http Status: ${code}</legend><pre>${msg}</pre></fieldset>`,
    // );
  }

  end() {
    if (this.lock) {
      return;
    }
    this.lock = true;
    if (!this.code) {
      this.resHeader['Content-Type'] = 'text/html; charset=utf-8';
      this.res.writeHead(404, this.resHeader);
      this.res.end(this.body || 'Func Not Found');
      return;
    }
    this.res.writeHead(this.code, this.resHeader);
    // console.log({ body: this.body, code: this.code, resHeader: this.resHeader });
    // for (const key of Object.keys(this.resHeader)) {
    //   try {
    //     this.res.setHeader(key, this.resHeader[key]);
    //   } catch (e) {
    //     console.log(key);
    //   }
    // }
    this.res.end(this.body);
  }
}

module.exports = M;
