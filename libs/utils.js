const path = require('path');

const optc = (obj) => Object.prototype.toString.call(obj);

function bind(ctx) {
  // eslint-disable-next-line no-unused-vars
  for (const i of Object.keys(ctx)) {
    ctx[i] = typeof ctx[i] === 'function' ? ctx[i].bind(ctx, this) : ctx[i];
  }
  return ctx;
}

function checkFields(para, fields) {
  if (Object.empty(para)) { return 'params'; }

  // eslint-disable-next-line no-unused-vars
  for (const it of fields) {
    if (!para[it] && para[it] !== 0) { return it; }
  }
  return true;
}

function isFunction(obj) {
  return typeof obj === 'function';
}

function isArray(obj) {
  return optc(obj) === '[object Array]';
}

function isObject(obj) {
  return optc(obj) === '[object Object]';
}

function isString(obj) {
  return optc(obj) === '[object String]';
}

function sleep(time = 1000) {
  return new Promise((yes) => {
    setTimeout(() => {
      yes();
    }, time);
  });
}

function tocode(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quto;');
  str = str.replace(/'/g, '&#39;');
  str = str.replace(/`/g, '&#96;');
  str = str.replace(/\//g, '&#x2F;');
  return str;
}

function tohtml(str) {
  str = str.replace(/&amp;/g, '&');
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&quto;/g, '"');
  str = str.replace(/&#39;/g, '\'');
  str = str.replace(/&#96;/g, '`');
  str = str.replace(/&#x2F;/g, '/');
  return str;
}

function resolve(...rest) {
  let result = '';
  // eslint-disable-next-line no-unused-vars
  for (const it of [...new Set(rest)]) {
    result = path.join(result, it);
  }
  return result;
}

function query(q) {
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

function suffix(str) {
  if (!isString(str)) { return 'arguments is not string'; }
  return str.slice(str.lastIndexOf('.') + 1);
}

/**
 * [对象深拷贝]
 */
function deepClone (obj) {
  var copy;
 
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

module.exports = function (ctx) {
  return {
    resolve,
    isArray,
    isFunction,
    isObject,
    sleep,
    tocode,
    tohtml,
    suffix,
    bind: bind.bind(ctx),
    query,
    checkFields,
  };
};

module.exports.isFunction = isFunction;
module.exports.deepClone = deepClone;
