(async function () {
  const { project, packageJson } = require('./env');
  const { version, name } = packageJson;
  // const uploadqiniu = require('../libs/qiniu/uploadqiniu.js');
  const { uploadqiniu } = require('../libs/qiniu');
  const path = require('path');
  const excludeList = /\.DS_Store/g;
  const fs = require('iofs');
  const staticPath = path.resolve(__dirname, '..', 'projects', project, '.next', 'static');

  const filenames = fs.ls(staticPath, true);
  // filenames = filenames.slice(20, 25);
  // console.log({ filenames, staticPath, project });
  if (filenames.length) {
    for (let i = 0; i < filenames.length; i++) {
      const index = filenames[i].indexOf('.next') + 6;
      const filename = filenames[i].slice(index);
      if (!fs.isdir(filenames[i])) {
        const realFilename = `projs/${project}/${version}/_next/${filename}`;
        // console.log(realFilename);
        const matchList = realFilename.match(excludeList);
        if (matchList && matchList.length) {
          continue;
        }
        /**
         * [prefix description] 资源前缀
         * [suffix description] 资源后缀
         * [useFileName description] 是否使用本地文件名
         * [useDate description] 是否使用日期
         * @type {String}
         */
        // eslint-disable-next-line no-await-in-loop
        const { url } = await uploadqiniu(filenames[i], {
          realFilename,
          // prefix: 'chuanghu',
          suffix: '',
          // useFileName: true,
          useDate: true,
        });
        console.log(`upload ${url} done !`);
      }
      // https://static.igeekee.cn/projs/service/1.0.0/_next/static/runtime/main-b837e1882c9b54a44160.js
    }
  }
}());
