module.exports = {
  master: {
    connectionLimit : 10,
    host: 'localhost',
    port: 3306,
    user: 'lt',
    password: 'qwer0987'
  },
  slave: [{
    connectionLimit : 10,
    host: "localhost",
    port: 3306,
    user: "lt",
    password: 'qwer0987'
  }]
}