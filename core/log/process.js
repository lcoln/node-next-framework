const dateFormat = require('../../libs/dateFormat')
process.on('uncaughtException', (error, origin) => {
  const timestemp = Date.now();
  const err = ['code', 'message', 'name', 'stack'].reduce((item, next) => {
    item[next] = error[next];
    return item;
  }, {});
  console.log(JSON.stringify({
    description: '捕获到未 try catch 的错误',
    level: origin,
    result: { error: err },
    timestemp,
    date: dateFormat(timestemp),
  }));
  process.exit(1);
});
