const Fs = require('iofs');
const path = require('path');

module.exports = Fs.ls(
  path.resolve(__filename, '..'),
).filter(
  (v) => !/\/middleware\/index\.js$/.test(v),
).map(
  (v) => require(v),
);
