const Redis = require('ioredis');
// 连接超时处理
const defaultConf = {
  sentinelRetryStrategy(times) {
    if (times >= this.retryTime) {
      process.exit();
    }
    return 1500;
  },
  retryTime: 5,
};
class M {
  constructor({ sentinels, master, slave }, ctx) {
    master = sentinels && sentinels.master ? sentinels.master : master;
    slave = sentinels && sentinels.slave ? sentinels.slave : (slave || master);
    this.isStart = false;
    try {
      // console.log(Object.assign(defaultConf, master))
      if (sentinels) {
        this.master = new Redis(Object.assign(defaultConf, master));
        this.slave = new Redis(Object.assign(defaultConf, slave));
      } else {
        this.master = new Redis(master);
        this.slave = new Redis(slave);
      }
      this.ctx = ctx;
    } catch (e) { }
  }

  start() {
    if (this.isStart) { return; }
    const opt = this.ctx.get('session') || {};
    this.uuid = `${this.ctx.request.headers('user-agent')}_${Date.now()}`;
    if (opt.strict) {
      this.uuid = `${this.uuid}_${this.ctx.request.ip()}`;
    }
    this.uuid = global.Sec.md5(this.uuid);
    this.master.expire(this.uuid, opt.ttl || 3600);
    this.isStart = true;
  }

  verify(uuid) {
    return this.uuid === uuid;
  }

  async get() {
    return new Promise((yes) => {
      this.slave.hgetall(this.uuid, (err, obj) => {
        yes(obj);
      });
    });
  }

  set(key, val) {
    this.master.hset(this.uuid, key, val);
  }

  unset(key) {
    this.master.hdel(this.uuid, key);
  }

  clear() {
    // console.log(this.uuid, this.master.del)
    this.master.del(this.uuid);
  }
}

module.exports = M;
