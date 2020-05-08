'use strict';

const Redis = require('ioredis');

class M {
  constructor(conf) {
    // console.log({ conf });
    const { master = {} } = conf;
    const defaultConf = {
      host: master.host || '127.0.0.1',
      port: master.port || 6379,
      db: master.db || 0,
      password: master.password || '',
    };

    this.redis = new Redis(defaultConf);

    this.ttl = master.ttl || 60 * 60 * 24 * 15; // 15天缓存
  }

  addCommonPopAndPush() {
    Redis.Command.setReplyTransformer('get', (result) => {
      if (!result) return null;
      return result;
    });
    Redis.Command.setReplyTransformer('set', (result) => {
      if (!result) return null;
      return result;
    });
  }

  // 获取session字段值, 需要yeild指令
  get(key) {
    return new Promise((yes, no) => {
      this.redis.get(key, (err, obj) => {
        if (err) { return no(err); }

        return yes(obj);
      });
    });
  }

  // 设置session字段值
  set(key, val, ttl) {
    ttl = !ttl ? this.ttl : ttl;
    if (!val) { return null; }

    if (Object.prototype.toString.call(val) === '[object Number]') { val += ''; }

    if (Object.prototype.toString.call(val) !== '[object String]') { return null; }

    this.redis.set(key, val);
    this.redis.expire(key, ttl);

    return true;
  }

  // 删除key
  delete(key) {
    this.redis.del(key);
  }
}

module.exports = M;
