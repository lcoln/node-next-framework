/**
 * [JSON extend]
 * @authors linteng (875482941@qq.com)
 * @date    2018-10-23 17:55:13
 */
/* eslint no-extend-native: ["error", { "exceptions": ["JSON"] }] */
'use strict'

if (!JSON.then) {
  Object.defineProperty(JSON, 'then', {
    value: function (callback) {
      if (typeof callback === 'function') callback(this.result)
      return this.result
    },
    enumerable: false
  })
}

if (!JSON.parseTry) {
  Object.defineProperty(JSON, 'parseTry', {
    value: function (str, callback) {
      let rawParse = JSON.parse

      try {
        this.result = rawParse(str)
      } catch (err) {
        console.error(`JSON解析失败：${str}, ${err.stack}`)
        return this
      }
      return this
    },
    enumerable: false
  })
}
