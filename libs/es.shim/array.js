/**
 * [Array extend]
 * @authors linteng (875482941@qq.com)
 * @date    2018-10-10 22:52:22
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
'use strict';

if (!Array.prototype.ensure) {
  Object.defineProperty(Array.prototype, 'ensure', {
    value(item) {
      if (this.indexOf(item) === -1) return this.push(item);
      return [...new Set(this)];
    },
    enumerable: false,
    writable: true,
    configurable: true,
  });
}

if (!Array.prototype.equals) {
  Object.defineProperty(Array.prototype, 'equals', {
    value(array) {
      if (!array) { return false; }
      if (this.length !== array.length) { return false; }
      for (let i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
          if (!this[i].equals(array[i])) { return false; }
        } else if (this[i] instanceof Object && array[i] instanceof Object) {
          const keys1 = Object.keys(this[i]);
          const keys2 = Object.keys(array[i]);
          if (keys1.length !== keys2.length) return false;
          if (keys1.equals(keys2)) {
            let it;
            for (it of keys1) {
              if (JSON.stringify(this[i][it]) !== JSON.stringify(array[i][it])) return false;
            }
          }
        } else if (this[i] !== array[i]) {
          return false;
        }
      }
      return true;
    },
    enumerable: false,
    writable: true,
    configurable: true,
  });
}
