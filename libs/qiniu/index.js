/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2018-10-31 22:50:14
 */

'use strict';

const ACCESS_KEY = 'VBvN33BnrqcaAqrbOHLD4EbTuIwxwjA_VSdUo6B5';
const SECRET_KEY = 'fdSgoq2c71UX8rJ8luX5zf3BsC03TmDmbOdKnr7e';
const store = {
  imgtest: 'http://imgtest.clickwifi.net',
  merchant: 'http://phpyi268u.bkt.clouddn.com',
  igeekee: 'http://static.igeekee.cn',
  hotmall: 'http://ppmqx596q.bkt.clouddn.com',
};
const M = {};
const utils = require('../utils');

function createUpToken(scope = 'merchant') {
  scope = process.env.NODE_ENV === 'development' ? 'imgtest' : scope;

  const domain = store[scope];
  const para = {
    scope,
    deadline: Math.floor(Date.now() / 1000) + 3600,
  };

  const encodePutPolicy = Sec.base64encode(JSON.stringify(para)).replace(/\+/g, '-').replace(/\//g, '_');

  const encodedSign = Sec.hmac('sha1', encodePutPolicy, SECRET_KEY, 'base64').replace(/\+/g, '-').replace(/\//g, '_');

  const accessToken = `${ACCESS_KEY}:${encodedSign}:${encodePutPolicy}`;
  return { uptoken: accessToken, domain };
}

utils.defSingleProp(M, 'createUpToken', () => createUpToken);
utils.defSingleProp(M, 'uploadqiniu', () => require('./uploadqiniu'));

module.exports = M;
