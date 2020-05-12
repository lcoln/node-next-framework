/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2019-02-13 15:28:13
 */

'use strict';

const crypto = require('crypto.js');
const { Duplex } = require('stream');
const curl = require('superagent');
const qiniu = require('qiniu');
const fs = require('fs');

const ACCESS_KEY = 'VBvN33BnrqcaAqrbOHLD4EbTuIwxwjA_VSdUo6B5';
const SECRET_KEY = 'fdSgoq2c71UX8rJ8luX5zf3BsC03TmDmbOdKnr7e';
const TOKEN = 'QBox VBvN33BnrqcaAqrbOHLD4EbTuIwxwjA_VSdUo6B5:wsdrcfNf-gwyn843CWArsDWgH4Q=';

const d = new Date();
const day = `${d.getFullYear()}_${d.getMonth() - 0 + 1}_${d.getDate()}`;

const host = {
  imgtest: 'http://imgtest.clickwifi.net/',
  igeekee: 'https://static.igeekee.cn/',
};
const zone = {

  imgtest: 'Zone_z2',
  igeekee: 'Zone_z0',
};
// const bucket = 'igeekee';
const bucket = 'imgtest';
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
const config = new qiniu.conf.Config();
// config.zone = qiniu.zone.Zone_z0;
config.zone = qiniu[zone[bucket]];

const bucketManager = new qiniu.rs.BucketManager(mac, config);

const options = {
  scope: bucket,
};
const putPolicy = new qiniu.rs.PutPolicy(options);
let uploadToken = putPolicy.uploadToken(mac);

const userAgents = [
  'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  'Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JSS15Q) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
];

function post(url) {
  const random = Math.floor(Math.random() * 8);
  return new Promise((yes, no) => {
    curl.get(url)
      .set('Accept-Encoding', 'gzip')
      .set('User-Agent', userAgents[random])
      .timeout(10000)
      .end((err, res) => {
        if (err) { return yes({ code: 500, data: `${err}` }); }

        yes({ code: 200, data: res.body });
      });
  });
}

function qiniuStat(filename) {
  return new Promise(((resolve) => {
    bucketManager.stat(bucket, filename, (err, respBody, respInfo) => {
      if (err) {
        resolve(false);
      } else if (respInfo.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }));
}

async function uploadqiniu(url, uploadConfig = {
  realFilename: '',
  type: '',
  prefix: 'pd',
  suffix: '-180x180style',
  useFileName: false,
  useDate: true,
}) {
  const {
    realFilename,
    type,
    prefix,
    suffix,
    useFileName,
    useDate,
  } = uploadConfig;
  let res = {};
  // 如果是链接
  if (/^(http|https):/.test(url)) {
    url = url.replace(/([\u4e00-\u9fa5])/g, (v) => encodeURI(v));
    res = await post(url);
    return new Promise(async (yes) => {
      if (res.code < 400) {
        // let format = url.match(/bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp/i)
        let format = url.split('.')[url.split('.').length];
        format = format || 'jpg';

        const key = crypto.md5(`${res.data}`);
        // console.log({day})
        const filename = `${prefix}/${crypto.md5(key)}${useDate ? `_${day}` : ''}.${format}`;

        const buff = res.data;
        const stream = new Duplex();
        const hasFile = await qiniuStat(filename);
        console.log({ hasFile });

        if (hasFile) {
          return yes({ code: 201, url: host[bucket] + filename + suffix, sign: key });
        }
        stream.push(buff);
        stream.push(null);

        const putExtra = new qiniu.form_up.PutExtra();

        const formUploader = new qiniu.form_up.FormUploader(config);
        // var key = "menu_12161701_555221414.jpg";
        formUploader.putStream(uploadToken, filename, stream, putExtra, async (respErr,
          respBody, respInfo) => {
          // console.log(respInfo)
          if (respInfo && respInfo.status === 401) {
            const data = await post('http://boss.clickwifi.net/boss/uptoken/igeekee');
            // console.log({data})
            const { uptoken } = data.data.data;
            uploadToken = uptoken;
            await uploadqiniu(url, uploadConfig);
          }
          if (respErr) {
            yes({ code: 500 });
          }
          if (respInfo && respInfo.status) yes({ code: respInfo.status, url: host[bucket] + filename + suffix, sign: key });
        });
      } else {
        yes({ code: 500 });
      }
    });
  }
  // 如果是本地文件
  return new Promise(async (yes, no) => {
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    let format = url.slice(url.lastIndexOf('.') + 1);
    format = format || 'jpg';
    const key = type || (useFileName ? url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
      : crypto.md5(crypto.md5(`${fs.readFileSync(url)}`)));

    const localFile = url;
    let filename = '';
    if (realFilename) {
      filename = realFilename;
    } else {
      filename = format !== 'js' ? `${prefix}/${key}${useDate ? `_${day}` : ''}.${format}` : `${prefix}/${key}${useDate ? `_${day}` : ''}.${format}`;
    }

    const hasFile = await qiniuStat(filename);
    if (hasFile) {
      // console.log({hasFile})
      return yes({ code: 201, url: host[bucket] + filename + suffix, sign: key });
    }
    formUploader.putFile(uploadToken, filename, localFile, putExtra, async (respErr,
      respBody, respInfo) => {
      if (respInfo && respInfo.status === 401) {
        const data = await post('http://boss.clickwifi.net/boss/uptoken/igeekee');
        // console.log({data})
        const { uptoken } = data.data.data;
        uploadToken = uptoken;
        await uploadqiniu(url, uploadConfig);
        // console.log({respInfo})
      }
      if (respErr) {
        // console.log({respErr})
        yes({ code: 500 });
      }
      if (respInfo.statusCode === 614) {
        bucketManager.delete(options.scope, filename, async (err, respBody, respInfo) => {
          if (err) {
            console.error(`Got error: ${err.message}`);
            await uploadqiniu(url, uploadConfig);
          } else {
            await uploadqiniu(url, uploadConfig);
          }
        });
      }
      if (respInfo && respInfo.status == 200) {
        // console.log({respInfo})
        const sub = format !== 'js' ? suffix : '';
        yes({ code: respInfo.status, url: host[bucket] + filename + sub, sign: key });
      }
    });

    // console.log({filename})
    // 文件上传
  });
}
uploadqiniu.refresh = function (urls) {
  // console.log({urls})
  return new Promise((yes, no) => {
    curl.post('http://fusion.qiniuapi.com/v2/tune/refresh')
      .set('Authorization', TOKEN)
      .set('Content-Type', 'application/json')
      .send({ urls })
      .end((err, res) => {
        if (err) {
          // console.log(err)
          return yes({ code: 500, data: `${err}` });
        }

        yes({ code: 200, data: res.body });
      });
  });
};
module.exports = uploadqiniu;
// let result = await uploadqiniu(newUrl)
