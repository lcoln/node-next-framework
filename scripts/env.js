const path = require('path');

const projectsDir = 'projects';

const argv = process.argv.filter((v) => v.indexOf('projects') > -1)[0];
// console.log({ argv }, process.argv);
const index = argv ? argv.indexOf(projectsDir) + projectsDir.length + 1 : 0;
const project = argv.slice(index).split('/')[0];
// console.log({ ddd: __dirname }, project);

let packageJson = {};
try {
  packageJson = require(path.resolve(__dirname, '..', 'projects', project, 'package.json'));
} catch (e) {}

const ENV = {
  cwd: path.resolve(__dirname, '..'),
  isProd: process.env.NODE_ENV === 'production',
  project,
  packageJson,
};
module.exports = ENV;
