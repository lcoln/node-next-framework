/**
 * [String extend]
 * @authors linteng (875482941@qq.com)
 * @date    2018-09-25 19:49:30
 */
/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
'use strict'

if (!String.prototype.tohtml) {
  Object.defineProperty(String.prototype, 'tohtml', {
    value: function () {
      return this.replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&amp;/gi, '&')
    },
    enumerable: false
  })
}
