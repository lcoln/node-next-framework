function createLogContext(result, params, level, { requestId, req, request }) {
  params = params
    ? (Utils.isString(params) ? params : JSON.stringify(params))
    : (request.query ? JSON.stringify(request.query) : null);

  result = result
    ? (Utils.isString(result) ? result : JSON.stringify(result))
    : null;
  const { method, headers } = req;
  const timestemp = Date.now();
  // console.log({headers})
  return {
    level, // debug, error
    apiUrl: `${headers.host}/${req.url}`,
    method,
    params,
    result,
    requestId,
    userAgent: headers['user-agent'],
    timestemp,
    date: Utils.dateFormat(timestemp),
  };
}

function Log(ctx) {
  this.ctx = ctx;
  process.on('uncaughtException', (err, origin) => {
    console.log(createLogContext(
      `捕获的异常: ${err}\n异常的来源: ${origin}`, null, 'process:uncaughtException', ctx,
    ));
  });
  process.on('exit', (code) => {
    console.log(createLogContext(
      `进程 exit 事件的代码: ${code}`, null, 'process:exit', ctx,
    ));
  });
}

/**
 * error日志
 * @param {any} result 输出结果
 * @param {any} params 请求参数, 如果是get默认会填上参数不需要传
 * @returns {Object}
 * {
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
Log.prototype.error = function (result, params) {
  console.log(createLogContext(result, params, 'error', this.ctx));
};
Log.prototype.info = function (result, params) {
  console.log(createLogContext(result, params, 'info', this.ctx));
};

module.exports = Log;
