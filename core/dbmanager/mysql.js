const Mysql = require('mysql');
const Api = require('./api');

class M {
  constructor({ master, slave }) {
    this._dbs = {};
    this._database = '';
    this._table = '';
    this.poolCluster = Mysql.createPoolCluster({
      removeNodeErrorCount: 1, // Remove the node immediately when connection fails.
      defaultSelector: 'ORDER',
    });
    if (master) {
      this.poolCluster.add('MASTER', master);
    }

    if (slave) {
      if (!global.Utils.isArray(slave)) {
        slave = [slave];
      }
      // eslint-disable-next-line no-unused-vars
      for (const it of slave) {
        this.poolCluster.add('SLAVE', it);
      }
    }
    this.queue = [];
  }

  useDB(database, type = 'MASTER') {
    const pool = new Api(this, database, type);
    return pool;
  }

  createDB(database, type = 'MASTER') {
    return new Api(this, database, type).createDB();
  }
}

module.exports = M;
