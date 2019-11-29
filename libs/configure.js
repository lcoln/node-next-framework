module.exports = function () {
  const { resolve } = Utils
  return {
    VIEWS: resolve(__dirname, './views'),
    db: {
      master: {
        connectionLimit : 10,
        host: '127.0.0.1',
        port: 3306,
        user: 'test',
        password: 'test',
        database: 'test'
      },
      slave: [{
        connectionLimit : 10,
        host: "127.0.0.1",
        port: 3306,
        user: "test",
        password: "test",
        database: 'test'
      }]
    },
    session: {
      strict: false,   //true: ip + useragent. false: useragent
      sentinels: {
        master: {
          sentinels: [
            { host: "localhost", port: 26379 }
          ],
          name: "mymaster",
          role: "master",
        },
        slave: {
          sentinels: [
            { host: "localhost", port: 26379 }
          ],
          name: "mymaster",
          role: "slave",
        },
      },
      master: [{
        port: 6379, // Redis port
        host: "127.0.0.1", // Redis host
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: "auth",
        db: 0,
        role: "master"
      }],
      slave: [{
        port: 6380, // Redis port
        host: "127.0.0.1", // Redis host
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: "auth",
        db: 0,
        role: "slave"
      }]
    },
    // 设置了jwt与cookie时优先采用jwt, 默认cookie
    cookie: {
      httpOnly: true,
      // expires: new Date(Date.now() + 25000).toGMTString(),   // 过期时间, 单位GMT 或 UTC 格式的时间
      // 'max-age': 5,     // 过期时间, 优先级高于expires, 单位s
      path: '/'
    }
  }
}