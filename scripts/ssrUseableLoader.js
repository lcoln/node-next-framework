// eslint-disable-next-line no-unused-vars
module.exports = function (source) {
  this.cacheable(true);
  this.sourceMap = false;
  return 'exports.use = exports.ref = exports.unuse = exports.unref = function() {};';
};
