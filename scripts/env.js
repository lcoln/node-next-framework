const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const argv = process.argv.filter((v) => v.indexOf('projects') > -1);
const project = argv && argv[0] && argv[0].slice(argv[0].lastIndexOf('/') + 1);
// console.log(argv, project, __dirname);

let packageJson = {};
try {
  packageJson = require(path.resolve(__dirname, '..', 'projects', project, 'package.json'));
} catch (e) {}

const ENV = {
  isProd,
  project,
  packageJson,
};
module.exports = ENV;
