module.exports = {
  // sentinels: {
  //   master: {
  //     sentinels: [
  //       { host: "localhost", port: 26379 }
  //     ],
  //     name: "mymaster",
  //     role: "master",
  //     retryTime: 5
  //   },
  //   slave: {
  //     sentinels: [
  //       { host: "localhost", port: 26379 }
  //     ],
  //     name: "mymaster",
  //     role: "slave",
  //     retryTime: 5
  //   },
  // },
  master: [{
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: "auth",
    db: 0,
    role: "master"
  }],
  // slave: [{
  //   port: 6380, // Redis port
  //   host: "127.0.0.1", // Redis host
  //   family: 4, // 4 (IPv4) or 6 (IPv6)
  //   password: "auth",
  //   db: 0,
  //   role: "slave"
  // }]
}