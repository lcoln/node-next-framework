const path = require('path');

const optc = (obj) => Object.prototype.toString.call(obj);

function bind(ctx) {
  // eslint-disable-next-line no-unused-vars
  for (const i of Object.keys(ctx)) {
    ctx[i] = typeof ctx[i] === 'function' ? ctx[i].bind(ctx, this) : ctx[i];
  }
  return ctx;
}
function checkFieldsArray(params, fields, key) {
  if (!params) {
    return 'params';
  }
  let check = true;
  for (const para of params) {
    check = checkFields(para, fields);
    if (check !== true) { return `${key}中的${check}`; }
  }
  return true;
}
function checkFields(para, fields) {
  const check = true;
  if (Object.empty(para)) {
    return 'params';
  }

  // eslint-disable-next-line no-unused-vars
  for (const it of fields) {
    if (!para[it] && para[it] !== 0) {
      return it;
    }
    // if (Object.prototype.toString.call(para[it]) === '[object object]') {
    //   check = checkFields(para[it],fields)
    //   if (check!== true)
    //     return check;
    // }
    // if (Object.prototype.toString.call(para[it]) === '[object Array]') {
    //   for (const pItem of para[it]) {
    //     check = checkFields(pItem,fields)
    //     if (check!== true)
    //       break
    //   }
    // }
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
  str = str.replace(/&#39;/g, "'");
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
  if (!isString(str)) {
    return 'arguments is not string';
  }
  return str.slice(str.lastIndexOf('.') + 1);
}

/**
 * [对象深拷贝]
 */
function deepClone(obj) {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    let attr;
    for (attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

function defSingleProp(obj, key, getter) {
  let val;
  Object.defineProperty(obj, key, {
    get() {
      if (!val) {
        val = getter();
      }
      Object.defineProperty(obj, key, {
        get() {
          return val;
        },
        configurable: true,
      });
      return val;
    },
    configurable: true,
  });
}

/**
 * 将驼峰转换成-
 * @param {String} str  // 需要转换的字符串
 * @param {String} key  // 通过该字符串连接str
 */
function connectStrBy(str, key = '-') {
  if (!str) {
    return '';
  }
  return str.replace(/([A-Z])/g, (...rest) => {
    if (rest[0]) {
      return `${key}${rest[0].toLocaleLowerCase()}`;
    }
  });
}

function cross(response, origin) {
  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, authorization');
}

module.exports = function (ctx) {
  return {
    resolve,
    isArray,
    isFunction,
    isObject,
    isString,
    sleep,
    tocode,
    tohtml,
    suffix,
    bind: bind.bind(ctx),
    query,
    checkFields,
    checkFieldsArray,
    connectStrBy,
    defSingleProp,
    cross,
  };
};

module.exports.defSingleProp = defSingleProp;
module.exports.isFunction = isFunction;
module.exports.deepClone = deepClone;
