const errorKeys = ['code', 'message', 'name', 'stack'];
function createLogContext(desc, result = {}, params, level, { requestId, req, request }) {
  if (!Utils.isString(desc)) {
    return {
      code: 400,
      data: desc,
      type: 'ReferenceError',
      msg: '日志缺少描述',
    };
  }
  params = params
    ? (Utils.isString(params) ? params : JSON.stringify(params))
    : (request.query ? JSON.stringify(request.query) : null);
  let res = {};
  if (result) {
    // 如果是字符串则赋值给data
    if (Utils.isString(result)) {
      res.data = result;
    } else {
      // 如果是一个抛出异常, 则赋值给res.error, res.data赋值null
      if (result instanceof Error) {
        res.error = Object.getPrototypeOf(result);
        res.data = null;
      } else if (result.error && result.error instanceof Error) {
        // 如果有error对象, 则赋值给res.error
        res.error = Object.getPrototypeOf(result.error);
      }
      if (res.error) {
        res.error = errorKeys.reduce((item, next) => {
          item[next] = res.error[next];
          return item;
        }, {});
      }
      // 如果有data对象, 则赋值给res.data
      if (result.data) {
        res.data = result.data;
      }
      res = JSON.stringify(res);
    }
  }

  const { method, headers } = req;
  const timestemp = Date.now();

  // console.log({headers})
  return {
    code: 200,
    data: {
      description: desc,
      level, // info, error
      apiUrl: `${headers.host}/${req.url}`,
      method,
      params,
      result: res,
      requestId,
      userAgent: headers['user-agent'],
      timestemp,
      date: Utils.dateFormat(timestemp),
    },
  };
}

function Log(ctx) {
  this.ctx = ctx;
}

/**
 * error日志
 * 用法:
 *  class M extends Controller {
 *    test () {
 *      try {
 *         throw (global.ReferenceError(3333));
 *       } catch (e) {
 *         this.log.error('异常', e);
 *       }
 *    }
 *  }
 * @param {any} desc   日志描述
 * @param {any} result 输出结果
 * @param {any} params 请求参数, 如果是get默认会填上参数不需要传
 * @returns {console.log}
 * {
 *   description: '',
 *   level: 'error',
 *   apiUrl: 'localhost:3334//hotmall/test',
 *   method: 'GET',
 *   params: '{"test":"test"}',
 *   result: 'test',
 *   requestId: '65e62118-92b3-40ac-8ac7-f7d426139fa7',
 *   userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4)...',
 *   timestemp: 1599235840661,
 *   date: '2020-09-05 00:10:40'
 * }
 */
Log.prototype.error = function (desc, result, params) {
  const logContext = createLogContext(desc, result, params, 'error', this.ctx);
  if (logContext.code >= 400 && global[logContext.type]) {
    throw (global[logContext.type](logContext.msg));
  }
  console.log(JSON.stringify(logContext.data));
  return logContext;
};
Log.prototype.info = function (desc, result, params) {
  const logContext = createLogContext(desc, result, params, 'info', this.ctx);
  if (logContext.code >= 400 && global[logContext.type]) {
    throw (global[logContext.type](logContext.msg));
  }
  console.log(JSON.stringify(logContext.data));
  return logContext;
};

module.exports = Log;
