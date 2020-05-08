/**
 * [Promise extend]
 * @authors linteng (875482941@qq.com)
 * @date    2018-08-22 22:27:19
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Promise"] }] */
'use strict';

if (!Promise.defer) {
  Promise.defer = function () {
    const obj = {};
    obj.promise = new Promise((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = reject;
    });
    return obj;
  };
}
