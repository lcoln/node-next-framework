/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2018-06-07 16:27:03
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const NodeRSA = require('node-rsa');

const MAX_DECRYPT_BLOCK = 128; // RSA最大解密密文大小

class RSA {
  rsaEncode(data = {}, act = 'public') {
    const RSA_KEY = new NodeRSA({ b: 1024 }); // 1024位加密
    RSA_KEY.setOptions({ encryptionScheme: 'pkcs1' }); // RSA公开密钥算法加密和签名机制
    if (act === 'public') {
      RSA_KEY.importKey(RSA.PUBLIC_KEY);
      data = RSA_KEY.encrypt(JSON.stringify(data), 'base64');
    } else {
      RSA_KEY.importKey(RSA.PRIVATE_KEY);
      data = RSA_KEY.encryptPrivate(JSON.stringify(data), 'base64');
    }

    return data;
  }

  rsaDecode(str, act = 'private') {
    let decryptedData = null;
    if (act === 'private') {
      try {
        decryptedData = crypto.privateDecrypt({
          key: RSA.PRIVATE_KEY,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(str));
      } catch (e) {
        return `${e}`;
      }
    } else {
      try {
        decryptedData = crypto.publicDecrypt({
          key: RSA.PUBLIC_KEY,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(str));
      } catch (e) {
        return `${e}`;
      }
    }

    return decryptedData;
  }

  rsaPublicDecode(str, act) {
    let res = null;
    try {
      const encryptedBuffer = Buffer.from(str, 'base64');
      const decryptedBuffers = [];

      const totalBuffers = encryptedBuffer.length / MAX_DECRYPT_BLOCK;
      for (let i = 0; i < totalBuffers; i++) {
        const tempBuffer = Buffer.from(MAX_DECRYPT_BLOCK);
        encryptedBuffer.copy(tempBuffer, 0, i * MAX_DECRYPT_BLOCK, (i + 1) * MAX_DECRYPT_BLOCK);
        const decryptedBuffer = this.rsa_decode(tempBuffer, act);
        decryptedBuffers.push(decryptedBuffer);
      }

      res = Buffer.concat(decryptedBuffers).toString('utf8');
    } catch (e) {
      return false;
    }
    return res;
  }

  createSign(data) {
    const sign = crypto.createSign('RSA-SHA1');
    if (Object.prototype.toString.call(data) !== '[object String]') { data = JSON.stringify(data); }
    sign.write(data);
    sign.end();
    const caiqrSignature = sign.sign(RSA.PRIVATE_KEY, 'base64');
    return caiqrSignature;
  }

  verifySign(data, sign) {
    const verify = crypto.createVerify('RSA-SHA1');
    if (Object.prototype.toString.call(data) !== '[object String]') {
      data = JSON.stringify(data);
    }
    verify.write(data);
    verify.end();
    const signature = Buffer.from(sign, 'base64');
    return verify.verify(RSA.PUBLIC_KEY, signature);
  }

  cipherivEncode(str, key, iv = global.SEC.rand(16)) {
    const cipherChunks = [];
    const ciper = crypto.createCipheriv('aes-128-cbc', key, iv);
    cipherChunks.push(ciper.update(str, 'utf-8', 'hex'));
    cipherChunks.push(ciper.final('hex'));
    return iv + cipherChunks.join('') + key;
  }

  cipherivDecode(str) {
    const iv = str.slice(0, 16);
    const key = str.slice(str.length - 16, str.length);
    const data = str.slice(16, -16);

    const cipherChunks = [];
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    cipherChunks.push(decipher.update(data, 'hex', 'utf-8'));
    cipherChunks.push(decipher.final('utf-8'));
    return cipherChunks.join('');
  }

  cipherivEncodeBykey(str, key, iv = global.SEC.rand(16)) {
    const cipherChunks = [];
    const ciper = crypto.createCipheriv('aes-128-cbc', key, iv);
    cipherChunks.push(ciper.update(str, 'utf-8', 'hex'));
    cipherChunks.push(ciper.final('hex'));
    return iv + cipherChunks.join('');
  }

  cipherivDecodeBykey(str, key) {
    const iv = str.slice(0, 16);
    const data = str.slice(16);

    const cipherChunks = [];
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    cipherChunks.push(decipher.update(data, 'hex', 'utf-8'));
    cipherChunks.push(decipher.final('utf-8'));
    return cipherChunks.join('');
  }
}

RSA.PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, '../config/crypto/rsa_public_key.pem'), {
  encoding: 'utf-8',
});
RSA.PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, '../config/crypto/rsa_private_key.pem'), {
  encoding: 'utf-8',
});
module.exports = RSA;
