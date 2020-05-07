/**
 * [Object extend]
 * @authors linteng (875482941@qq.com)
 * @date    2018-08-22 20:29:32
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Object"] }] */
'use strict'

if (!Object.merge) {
  Object.defineProperty(Object, 'merge', {
    value: function (target = {}) {
      let args = Array.from(arguments)

      for (let i = 0; i < args.length; i++) {
        let source = args[i] || {}
        for (let prop in source) {
          source[prop] !== undefined && (target[prop] = source[prop])
        }
      }
      return target
    },
    enumerable: false,
    writable: true
  })
}

/**
 * [判断对象/数组是否为空]
 * eg.
 * Object.empty(obj/arr)
 */
if (!Object.empty) {
  Object.defineProperty(Object, 'empty', {
    value: function (obj) {
      if (!['[object Array]', '[object Object]'].includes(Object.prototype.toString.call(obj))) {
        if ([undefined, null].includes(obj)) return true
        else return false
      }
      try {
        for (let i in obj) {
          if (obj[i]) return false
        }
      } catch (e) {}
      return true
    },
    enumerable: false
  })
}
