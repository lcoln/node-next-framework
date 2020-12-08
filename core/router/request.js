const URL = require('url');
const formidable = require('formidable');
const path = require('path');

let tmpdir = '';

class M {
  constructor(req) {
    const { pathname, query } = URL.parse(req.url, true);
    this.req = req;
    this.url = req.url;
    this.pathname = pathname;
    this.origin = this.headers('origin');
    this.query = query;
    this.put = this.post;
    this.patch = this.post;
    this.delete = this.post;
    tmpdir = global.Utils.resolve(__dirname, '../../upload');
  }

  _resolve(...rest) {
    let result = '';
    // eslint-disable-next-line no-unused-vars
    for (const it of [...new Set(rest)]) {
      result = path.join(result, it);
    }
    return result;
  }

  _query(q) {
    const result = {};
    const start = q.indexOf('?');

    const querys = q.substr(start + 1, q.length).split('&');
    // eslint-disable-next-line no-unused-vars
    for (const it of querys) {
      if (it.indexOf('=') > -1) {
        const tmp = it.split('=');
        result[tmp[0]] = tmp[1];
      }
    }
    return result;
  }

  get(key) {
    return key ? (key in this.query ? this.query[key] : '') : this.query;
  }

  post() {
    return new Promise((yes) => {
      const form = new formidable.IncomingForm();
      form.uploadDir = tmpdir;
      form.parse(this.req, (err, fields, files) => {
        const result = Object.empty(files) ? fields : { ...fields, files };
        yes(result);
      });
      form.on('fileBegin', () => {
        // console.log({}, 'fileBegin')
      }).on('field', () => {
        // console.log({name, value}, 'field')
      }).on('file', () => {
        // console.log({name, file}, 'file')
      }).on('error', (err) => {
        // console.log({ err }, 'error');
      })
        .on('aborted', () => {
        // console.log({}, 'aborted')
        })
        .on('end', () => {
        // console.log({name, value}, 'end')
        });
    });
  }

  headers(key = '') {
    key = key.toLocaleLowerCase();
    return key ? (key in this.req.headers ? this.req.headers[key] : '') : this.req.headers;
  }

  ip() {
    return this.headers('x-real-ip') || this.headers('x-forwarded-for') || this.req.connection.remoteAddress.replace('::ffff:', '');
  }
}

module.exports = M;
