/**
 * 
 * @authors linteng (875482941@qq.com)
 * @date    2018-06-07 16:27:03
 */

'use strict'

let crypto = require('crypto')
const fs = require('fs');
const path = require('path')

let NodeRSA = require('node-rsa');
const MAX_DECRYPT_BLOCK = 128 //RSA最大解密密文大小

class RSA {

	constructor(pubkey, prikey) {
		/* pubkey && (PUBLIC_KEY = pubkey)
		prikey && (PRIVATE_KEY = prikey) */
		/*this.RSA_PUBLIC_KEY = new NodeRSA({b: 1024}); 		//1024位加密
		this.RSA_PUBLIC_KEY.setOptions({encryptionScheme: 'pkcs1'}) 		//RSA公开密钥算法加密和签名机制
		this.RSA_PUBLIC_KEY.importKey(RSA.PUBLIC_KEY)*/
	}

	checkType(data) {
		let type = Object.prototype.toString.call(data)
		switch (type) {
			case "[object Array]":
				return 1;
				break;
			case "[object Object]":
				return 2;
				break;
			case "[object String]":
				return 3;
				break;
			case "[object Number]":
				return 4;
				break;
			default:
				return 0;
				break;
		}
	}

	rsa_encode(data, act = 'public') {
		if (this.checkType(data) !== 2)
			data = {}

		let RSA_KEY = new NodeRSA({b: 1024}); 		//1024位加密
		RSA_KEY.setOptions({encryptionScheme: 'pkcs1'}) 		//RSA公开密钥算法加密和签名机制
		if(act === 'public'){
			RSA_KEY.importKey(RSA.PUBLIC_KEY)
			data = RSA_KEY.encrypt(JSON.stringify(data), 'base64')
		}else{
			RSA_KEY.importKey(RSA.PRIVATE_KEY)
			data = RSA_KEY.encryptPrivate(JSON.stringify(data), 'base64')
		}


		return data

	}

	rsa_decode(str, act = 'private') {

		let decryptedData = null
		if(act === 'private'){
			try{
				decryptedData = crypto.privateDecrypt({key: RSA.PRIVATE_KEY, padding: crypto.constants.RSA_PKCS1_PADDING}, Buffer.from(str))
			}catch(e){
				return e + ''
			}
		}else{
			try{
				decryptedData = crypto.publicDecrypt({key: RSA.PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING}, Buffer.from(str))
			}catch(e){
				return e + ''
			}
		}

		return decryptedData

	}


	rsa_public_decode(str, act) {
		let res = null
		try {
			let encryptedBuffer = Buffer.from(str, 'base64');
			let decryptedBuffers = [];

			let totalBuffers = encryptedBuffer.length / MAX_DECRYPT_BLOCK;
			for (let i = 0; i < totalBuffers; i++) {
				let tempBuffer = new Buffer(MAX_DECRYPT_BLOCK);
				encryptedBuffer.copy(tempBuffer, 0, i * MAX_DECRYPT_BLOCK, (i + 1) * MAX_DECRYPT_BLOCK);
				let decryptedBuffer = this.rsa_decode(tempBuffer, act)
				decryptedBuffers.push(decryptedBuffer)
			}

			res = Buffer.concat(decryptedBuffers).toString('utf8')
		} catch (e) {
			return false
		}
		return res
	}

	create_sign(data) {

    var sign = crypto.createSign('RSA-SHA1');
    if (Object.prototype.toString.call(data) !== '[object String]')
    	data = JSON.stringify(data)
    sign.write(data);
    sign.end();
    var caiqrSignature = sign.sign(RSA.PRIVATE_KEY, 'base64');
    return caiqrSignature
	}


	verify_sign(data, sign){
	    const verify = crypto.createVerify('RSA-SHA1');
    if (Object.prototype.toString.call(data) !== '[object String]')
    	data = JSON.stringify(data)
	    verify.write(data);
	    verify.end();
	    const signature = new Buffer(sign,'base64');
	    return verify.verify(RSA.PUBLIC_KEY, signature)
	}

	cipheriv_encode(str, key, iv = null) {

		var iv = iv ? iv : libs.SEC.rand(16);

		const cipherChunks = [];
		const ciper = crypto.createCipheriv('aes-128-cbc', key, iv);
		cipherChunks.push(ciper.update(str, 'utf-8', 'hex'));
		cipherChunks.push(ciper.final('hex'));
		return iv + cipherChunks.join('') + key

	}

	cipheriv_decode(str) {
		var iv = str.slice(0, 16)
		var key = str.slice(str.length - 16, str.length)
		var data = str.slice(16, -16)

		const cipherChunks = [];
		const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
		cipherChunks.push(decipher.update(data, 'hex', 'utf-8'));
		cipherChunks.push(decipher.final('utf-8'));
		return cipherChunks.join('');
	}

	cipheriv_encode_bykey(str, key, iv = null) {

		var iv = iv ? iv : libs.SEC.rand(16);

		const cipherChunks = [];
		const ciper = crypto.createCipheriv('aes-128-cbc', key, iv);
		cipherChunks.push(ciper.update(str, 'utf-8', 'hex'));
		cipherChunks.push(ciper.final('hex'));
		return iv + cipherChunks.join('')

	}

	cipheriv_decode_bykey(str, key) {
		var iv = str.slice(0, 16)
		var data = str.slice(16)

		const cipherChunks = [];
		const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
		cipherChunks.push(decipher.update(data, 'hex', 'utf-8'));
		cipherChunks.push(decipher.final('utf-8'));
		return cipherChunks.join('');
	}
}

RSA.PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, `../config/crypto/rsa_public_key.pem`), {
	encoding: 'utf-8'
})
RSA.PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, `../config/crypto/rsa_private_key.pem`), {
	encoding: 'utf-8'
})
module.exports = RSA