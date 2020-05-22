/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');

function asyncReaddir(path, option) {
  return new Promise((resolve, _) => {
    fs.readdir(path, option, (err, files) => {
      if (err) {
        throw err;
      }
      resolve(files);
    });
  });
}
function asyncStat(path) {
  return new Promise((resolve, _) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        throw err;
      }
      resolve(stats);
    });
  });
}

function parsePath(p) {
  return p.replace(/\\/g, '\\\\');
}

async function loadModule(modulePath, addImportFun, varAsyncComponent) {
  let resultJs = '{\n';
  const files = await asyncReaddir(modulePath);
  let asyncModule;
  // let asyncLayout;
  // let moduleConfig;
  let hasChilds = false;
  for (const file of files) {
    if (file === 'index.json') {
      // eslint-disable-next-line no-continue
      continue;
    }
    const absPath = path.resolve(modulePath, file);
    const stats = await asyncStat(absPath);
    if (stats.isDirectory()) {
      if (!hasChilds) {
        hasChilds = true;
        resultJs += 'children:{\n';
      }
      const dirModule = await loadModule(absPath, addImportFun, varAsyncComponent);
      resultJs += `'${file}':${dirModule},\n`;
    } else if (/^index\.(js|jsx|mjs|ts|tsx)$/.test(file)) {
      asyncModule = file;
    // } else if (/^layout\.(js|jsx|mjs|ts|tsx)$/.test(file)) {
    //   asyncLayout = file;
    // } else if (/^_config\.(js|jsx|mjs|ts|tsx|json)$/.test(file)) {
    //   moduleConfig = file;
    } else {
      const match = /^([^_].*)\.(js|jsx|mjs|ts|tsx)$/.exec(file);
      if (match) {
        if (!hasChilds) {
          hasChilds = true;
          resultJs += 'children:{\n';
        }
        if (varAsyncComponent) {
          resultJs += `'${match[1]}': {\n${varAsyncComponent}(component: () => import(/* webpackPrefetch: true */ '${parsePath(
            absPath,
          )}'))\n},\n`;
        } else {
          resultJs += `'${match[1]}': {\ncomponent: ${addImportFun(
            parsePath(absPath),
          )}\n},\n`;
        }
      }
    }
  }
  if (hasChilds) {
    resultJs += '},\n';
  }
  if (asyncModule) {
    if (varAsyncComponent) {
      resultJs += `component: ${varAsyncComponent}(() => import(/* webpackPrefetch: true */ '${parsePath(
        path.resolve(modulePath, asyncModule),
      )}')),\n`;
    } else {
      resultJs += `component: ${addImportFun(
        parsePath(path.resolve(modulePath, asyncModule)),
      )},\n`;
    }
  }
  // if (asyncLayout) {
  //   resultJs += `layout: () => import(/* webpackPrefetch: true */ '${parsePath(
  //     path.resolve(modulePath, asyncLayout),
  //   )}'),\n`;
  // }
  // if (moduleConfig) {
  //   resultJs += `_config: ${addImportFun(
  //     parsePath(path.resolve(modulePath, moduleConfig)),
  //   )},\n`;
  // }
  resultJs += '}';
  return resultJs;
}

function addImport(result) {
  let count = 0;
  return (module) => {
    count++;
    result.import += `import _${count} from '${module}';\n`;
    return `_${count}`;
    // return `require('${module}').default`;
  };
}

module.exports = function () {};

module.exports.pitch = function (request) {
  this.cacheable(true);
  this.sourceMap = false;
  if (this.target === 'node' && !this.query.ssr) {
    return 'export default {}';
  }
  const callback = this.async();
  (async () => {
    const result = {
      import: '',
      js: '',
    };
    const addImportFun = addImport(result);
    let varAsyncComponent;
    if (this.target === 'web') {
      varAsyncComponent = addImportFun('@/utils/asyncComponent');
    }
    const moduleJs = await loadModule(this.context, addImportFun, varAsyncComponent);
    result.js = `export default ${moduleJs}`;
    callback(null, result.import + result.js);
  })();
};
