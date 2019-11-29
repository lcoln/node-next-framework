const URL = require('url')
const formidable = require('formidable')
const util = require('util')
const path = require('path')
let tmpdir = ''

class M {
  constructor(req) {
    let { pathname, query } = URL.parse(req.url, true)
    this.req = req
    this.url = req.url
    this.pathname = pathname
    this.origin = this.headers('origin') 
    this.query = query 
    tmpdir = Utils.resolve(__dirname, '../../upload')
  }

  _resolve () {
    let result = ''
    for (let it of [...new Set(arguments)]) {
      result = path.join(result, it)
    }
    return result
  }

  _query (q) {

    let result = {}
    let start = q.indexOf('?')

    let querys = q.substr(start + 1, q.length).split('&')
    for (let it of querys) {
      if (it.indexOf('=') > -1) {
        let tmp = it.split('=')
        result[tmp[0]] = tmp[1]
      }
    }
    return result
  }

  get (key) {
    return key ? (key in this.query ? this.query[key] : '') : this.query
  }
  post () {
    return new Promise((yes, no) => {
      let form = new formidable.IncomingForm();
      form.uploadDir = tmpdir
      form.parse(this.req, function(err, fields, files) {
        let result = Object.empty(files) ? fields : { ...fields, files }
        yes(result)
      });
      form.on('fileBegin', function(name, file) {
        // console.log({name, file}, 'fileBegin')
      }).on('field', function(name, value) {
        // console.log({name, value}, 'field')
      }).on('file', function(name, file) {
        // console.log({name, file}, 'file')
      }).on('error', function(err) {
        console.log({err}, 'error')
      }).on('aborted', function(name, value) {
        // console.log({name, value}, 'aborted')
      }).on('end', function(name, value) {
        // console.log({name, value}, 'end')
      })
    })
  }
  headers (key) {
    return key ? (key in this.req.headers ? this.req.headers[key] : '') : this.req.headers
  }
  ip () {
    return this.headers('x-real-ip') || this.headers('x-forwarded-for') || this.req.connection.remoteAddress.replace('::ffff:', '')
  }
}

module.exports = M