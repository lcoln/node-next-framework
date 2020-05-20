module.exports = function (source) {
  if (this.target === 'web') {
    return `${source}\nexports.use();`;
  }
  return ';';
};
