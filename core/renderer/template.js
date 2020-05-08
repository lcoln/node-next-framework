/* eslint-disable no-eval */
const { isArray, isObject } = global.Utils;

// const reg0 = /<!--{each ([\w\W].*?) in ([\w\W].*?)}-->([\s\S]*)<!--{\/each}-->/gi;
const reg1 = /<!--{if ([\w\W].*?)}-->([\s\S]*)<!--{else if ([\w\W].*?)}-->([\s\S]*)<!--{else}-->([\s\S]*)<!--{\/if}-->/gi;
const reg2 = /<!--{if ([\w\W].*?)}-->([\s\S]*)<!--{else if ([\w\W].*?)}-->([\s\S]*)<!--{\/if}-->/gi;
const reg3 = /<!--{if ([\w\W].*?)}-->([\s\S]*)<!--{else}-->([\s\S]*)<!--{\/if}-->/gi;
const reg4 = /<!--{if ([\w\W].*?)}-->([\s\S]*)<!--{\/if}-->/gi;

module.exports = {
  _variable: {},
  _html: '',
  render(ctx, h) {
    ctx.response.setHeader('Content-Type', 'text/html; charset=utf-8');
    this.html = h;
    this._fixTpl(h);
    return ctx.response.end(this.html);
  },
  assign(ctx, key, val) {
    this._variable[key] = val;
  },
  // eslint-disable-next-line no-unused-vars
  _fixTpl(h) {
    this._fixIf()._fixVal();
  },
  _fixVal() {
    // eslint-disable-next-line no-unused-vars
    this.html = this.html.replace(/<!--{=([a-zA-Z.]+)}-->/g, ($1, $2, $3) => {
      // console.log({$1, $2, $3}, this._variable)
      let val = null;
      try {
        val = this._variable[$2];
        // val = new Function('o', `return o.${$2}`)(this._variable);
        if (val || val === 0) {
          if (isArray(val) || isObject(val)) {
            return JSON.stringify(val);
          }
          return val;
        }
      } catch (e) {
        return '';
      }

      return '';
    });

    return this;
  },
  _fixIf() {
    let finalReg = '';
    let regIndex = -1;
    const regs = [reg1, reg2, reg3, reg4];
    while (regs.length && !finalReg) {
      const reg = regs.shift();
      finalReg = reg.test(this.html) && reg;
      regIndex++;
    }
    // console.log(this.html)

    this.html = this.html.replace(finalReg, ($1, $2, $3, $4, $5, $6) => {
      console.log({
        $1, $2, $3, $4, $5, $6,
      });
      /* console.log({_variable: this._variable})
      console.log($2, $2.replace(/([a-zA-Z]+)/g, 'console.log(this._variable)')) */
      /* eslint-disable no-shadow */
      /* eslint-disable no-unused-vars */
      if ($2 && eval($2.replace(/([a-zA-Z]+)/g, 'this._variable.$1'))) {
        return $3.replace(/(\n)([\s\S]*)(\n)/, ($1, $2, $3, $4) => $3);
      } if ($4 && eval($4.replace(/([a-zA-Z]+)/g, 'this._variable.$1'))) {
        return $5.replace(/(\n)([\s\S]*)(\n)/, ($1, $2, $3, $4) => $3);
      } if (regIndex === 1 || regIndex === 3) {
        return '';
      } if ($6) {
        return $6.replace(/(\n)([\s\S]*)(\n)/, ($1, $2, $3, $4) => $3);
      }
      /* eslint-enable no-shadow */
      /* eslint-enable no-unused-vars */
      return $1;
    });
    return this;
  },
};
