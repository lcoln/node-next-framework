const Mysql = require('mysql');
const Api = require('./api')

class M {
  constructor({ master, slave }) {
    this._dbs = {}
    this._database = ''
    this._table = ''
    this.poolCluster = Mysql.createPoolCluster({
      removeNodeErrorCount: 1, // Remove the node immediately when connection fails.
      defaultSelector: 'ORDER'
    });
    master && this.poolCluster.add('MASTER', master);
    slave && this.poolCluster.add('SLAVE', slave);
    this.queue = []
  }

  useDB (database, type = 'MASTER') {
    let pool = new Api(this, database, type = 'MASTER')
    return pool
  }

  createDB (database, type = 'MASTER') {
    return new Api(this, database, type = 'MASTER').createDB()
  }

}

module.exports = M