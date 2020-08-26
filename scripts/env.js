const path = require('path');

// eslint-disable-next-line camelcase
const { pm_exec_path } = process.env;

const project = pm_exec_path.slice(
  pm_exec_path.slice(0, -7).lastIndexOf(path.sep) + 1,
  -7,
);
// console.log({ project }, process.env.PWD);

let packageJson = {};
try {
  packageJson = require(path.resolve(pm_exec_path.slice(0, -7), 'package.json'));
} catch (e) {}

const ENV = {
  cwd: path.resolve(__dirname, '..'),
  isProd: process.env.NODE_ENV === 'production',
  project,
  packageJson,
};
module.exports = ENV;
