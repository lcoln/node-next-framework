module.exports = {
  master: {
    connectionLimit : 10,
    host: 'localhost',
    port: 3306,
    user: 'root'
  },
  slave: [{
    connectionLimit : 10,
    host: "localhost",
    port: 3306,
    user: "root"
  }]
}