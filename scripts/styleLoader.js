module.exports = function (source) {
  source = `if (process.browser) {\n${source}\nexports.use();}`;
  return source;
};
