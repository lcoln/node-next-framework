const { isArray, isObject } = Utils

const reg1 = /<!--{if ([\w\W].*?)}-->([\s\S]*)<!--{else if ([\w\W].*?)}-->([\s\S]*)<!--{else}-->([\s\S]*)<!--{\/if}-->/gi
const reg2 = /<!--{if ([\w\W].*?)}-->([\s\S]*)<!--{else if ([\w\W].*?)}-->([\s\S]*)<!--{\/if}-->/gi
const reg3 = /<!--{if ([\w\W].*?)}-->([\s\S]*)<!--{else}-->([\s\S]*)<!--{\/if}-->/gi
const reg4 = /<!--{if ([\w\W].*?)}-->([\s\S]*)<!--{\/if}-->/gi

module.exports = {
  _variable: {},
  _html: '',
  render (ctx, h, t) {
    ctx.response.setHeader('Content-Type', 'text/html; charset=utf-8')
    this.html = h
    this._fixTpl(h)
    return ctx.response.end(this.html)
  },
  assign (ctx, key, val) {
    this._variable[key] = val
  },
  _fixTpl (h) {
    this._fixIf()._fixVal()
  },
  _fixVal (html) {

    this.html = this.html.replace(/<!--{=([a-zA-Z.]+)}-->/g, ($1, $2, $3) => {
      let val = new Function(`o`, `return o.${$2}`)(this._variable)

      if (val || val == 0) {
        if (isArray(val) || isObject(val)) {
          return JSON.stringify(val)
        }
        return val
      }
      return ''
    })

    return this
  },
  _fixIf (html) {
    let finalReg = ''
    let regIndex = -1
    let regs = [reg1, reg2, reg3, reg4]
    while (regs.length && !finalReg) {
      let reg = regs.shift()
      finalReg = reg.test(this.html) && reg
      regIndex++
    }
    // console.log(this.html)

    this.html = this.html.replace(finalReg, ($1, $2, $3, $4, $5, $6) => {
      /*console.log({_variable: this._variable})
      console.log($2, $2.replace(/([a-zA-Z]+)/g, 'console.log(this._variable)'))*/
      if ($2 && eval($2.replace(/([a-zA-Z]+)/g, 'this._variable.$1'))) {
        return $3.replace(/(\n)([\s\S]*)(\n)/, function ($1, $2, $3, $4) {
          return $3
        })
      } else if ($4 && eval($4.replace(/([a-zA-Z]+)/g, 'this._variable.$1'))) {
        return $5.replace(/(\n)([\s\S]*)(\n)/, function ($1, $2, $3, $4) {
          return $3
        })
      } else if (regIndex === 1 || regIndex === 3) {
        return ''
      } else if ($6) {
        return $6.replace(/(\n)([\s\S]*)(\n)/, function ($1, $2, $3, $4) {
          return $3
        })
      }
      return $1
    })
    return this
  }
}