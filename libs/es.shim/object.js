/**
 * [Object extend]
 * @authors linteng (875482941@qq.com)
 * @date    2018-08-22 20:29:32
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Object"] }] */
'use strict';

if (!Object.merge) {
  Object.defineProperty(Object, 'merge', {
    value(target = {}) {
      // eslint-disable-next-line prefer-rest-params
      const args = Array.from(arguments);

      for (let i = 0; i < args.length; i++) {
        const source = args[i] || {};
        let prop;
        for (prop in source) {
          if (source[prop] !== undefined) target[prop] = source[prop];
        }
      }
      return target;
    },
    enumerable: false,
    writable: true,
  });
}

/**
 * [判断对象/数组是否为空]
 * eg.
 * Object.empty(obj/arr)
 */
if (!Object.empty) {
  Object.defineProperty(Object, 'empty', {
    value(obj) {
      if (
        !['[object Array]', '[object Object]'].includes(
          Object.prototype.toString.call(obj),
        )
      ) {
        if ([undefined, null].includes(obj)) return true;
        return false;
      }
      try {
        let i;
        for (i in obj) {
          if (obj[i]) return false;
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
      return true;
    },
    enumerable: false,
  });
}
