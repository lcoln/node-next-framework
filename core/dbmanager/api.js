/* eslint-disable max-classes-per-file */

function join(v) {
  return v.filter((item) => item).join().trim();
}

class SqlErr {
  constructor(msg = '', sql = '') {
    this.message = msg;
    this.sql = sql;
    Object.defineProperty(this, 'stack', {
      value: msg,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }

  toString() {
    return this.message;
  }
}

const parse = {
  select({
    select = [], where, group = [], order, limit,
  }) {
    select = select || ['*'];
    if (!select || !this._table) { return this._error(); }
    let base = `select ${select.join(',')} from ${this._table} `;
    if (where) { base += `where ${where} `; }
    if (group) { base += `group by ${group.join(',')} `; }
    if (order) {
      const key = Object.keys(order)[0];
      const val = order[key];
      base += `order by ${key} ${Math.sign(val) > -1 ? 'asc' : 'desc'}`;
    }
    if (limit) {
      const { start, size } = limit;
      if (start && size) {
        base += `limit ${start}, ${size} `;
      } else {
        this._error('缺少参数');
      }
    }
    // console.log({ base });
    return base;
  },
  insert({ data }) {
    if (!data || !Object.keys(data).length) {
      return this._error('缺少参数');
    }
    let keys = [];
    let vals = [];
    // eslint-disable-next-line no-unused-vars
    for (const i of Object.keys(data)) {
      keys.push(i);
      vals.push(data[i] || '');
    }
    keys = `(${keys.join()})`;
    vals = vals.reduce((item, next) => {
      item += `'${next}',`;
      return item;
    }, '').slice(0, -1);
    vals = `(${vals})`;
    return keys.length && vals.length && `insert into ${this._table} ${keys} values ${vals}`;
  },
  update({ data, where }) {
    if (!data || !Object.keys(data).length || !where) {
      return this._error('缺少参数');
    }
    let sql = '';
    // eslint-disable-next-line no-unused-vars
    for (const i of Object.keys(data)) {
      sql += `${i}=${data[i]},`;
    }
    sql = sql.slice(0, -1);
    return `update ${this._table} set ${sql} where ${where}`;
  },
  delete({ where }) {
    if (!where) {
      return this._error('缺少参数');
    }
    return `delete from ${this._table} where ${where}`;
  },
  count({ select = '*', where }) {
    where = where ? `where ${where}` : '';
    return `select count(${select}) from ${this._table} ${where}`;
  },
  truncate() {
    return `truncate table ${this._table}`;
  },
  drop() {
    return `drop table ${this._table}`;
  },
  createTable() {
    let {
      name, charset, collate, table, comment,
    } = this._orm;
    charset = charset || 'utf8';
    collate = collate || 'utf8_general_ci';
    if (!name || !table) {
      return this._error('缺少参数');
    }

    const shell = `CREATE TABLE ${name}`;
    const sqls = [];
    let primary = '';
    const unique = [];
    const key = [];

    // eslint-disable-next-line no-unused-vars
    for (const it of table) {
      sqls.push(`${it.key} ${it.type} ${it.notNull ? 'NOT NULL ' : ''}${it.inc ? 'AUTO_INCREMENT ' : ''}${it.default ? `DEFAULT ${it.default} ` : ''}${it.comment ? `COMMENT ${it.comment} ` : ''}`);
      if (!primary) { primary = it.primary ? `PRIMARY KEY (${it.key})` : ''; }
      unique.push(it.key ? `UNIQUE KEY ${name}_${it.key}_UN (${it.key})` : '');
      key.push(it.index ? `KEY ${name}_${it.key}_IDX (${it.key}) USING BTREE` : '');
    }
    if (!primary) {
      return this._error('缺少参数');
    }
    const conf = join([
      join(sqls),
      primary,
      join(unique),
      join(key),
    ]);
    comment = comment ? ` COMMENT=${comment}` : '';
    return `${shell} (${conf}) ENGINE=InnoDB DEFAULT CHARSET=${charset} COLLATE=${collate} ${comment}`;
  },
  createDB() {
    if (!this._database) { return this._error('请指定数据库名称'); }
    return `CREATE DATABASE ${this._database}`;
  },
};

class Table {
  constructor({ type, database, ctx }, table) {
    this.poolCluster = ctx.poolCluster;
    this._database = database;
    this._table = table;
    this._orm = {};
    this._dbs = { [database]: { [table]: {} } };
    this.type = type;
  }

  getConnection(type) {
    type = this.type || 'MASTER';
    const defer = Promise.defer();

    if (!this.pool) {
      this.poolCluster.getConnection(type, (err, conn) => {
        if (err) {
          defer.reject(new SqlErr(`Mysql Connect Error: ${err}`));
        } else {
          this.pool = conn;
          if (this._orm && this._orm.act !== 'createDB') {
            conn.query(`use ${this._database}`, (err) => {
              if (err) {
                defer.reject(new SqlErr(`Use DB Error: ${err}`));
              } else {
                defer.resolve(conn);
              }
            });
          } else {
            defer.resolve(conn);
          }
        }
      });
    } else {
      this.pool.query(`use ${this._database}`, () => {
        defer.resolve(this.pool);
      });
    }
    return defer.promise;
  }

  _fixSql(sql) {
    if (!sql) {
      const { act } = this._orm;
      return act && parse[act] && parse[act].call(this, this._orm);
    }
    return sql;
  }

  query(sql, database) {
    const defer = Promise.defer();
    sql = this._fixSql(sql);
    console.log({ sql });
    if (sql.length) {
      this.getConnection().then((conn) => {
        console.log({ conn });
        conn.query({ sql, timeout: 100 }, (err, res) => {
          console.log({ err, res });
          if (err) {
            defer.reject(new SqlErr(`Sql Error, sql: ${sql}, Error: ${err}`, sql));
          } else {
            defer.resolve(res);
          }
        });
      }).catch((e) => { defer.reject(new SqlErr(`Mysql Connect Error: ${e}`, sql)); });
    } else {
      this._error('sql执行错误');
    }
    return defer.promise;
  }

  selectAll(orm = {}) {
    this._orm = orm;
    this._orm.act = 'select';
    return this.query();
  }

  select(orm = {}) {
    this._orm = orm;
    this._orm.act = 'select';
    return this.query();
  }

  // insert into poi select * FROM ;
  /* insert into ap.ap_18 (ap_id, ap_ssid, ap_bssid, p_id, ap_create_time, ap_update_time, ap_delete_time, ap_security, ap_code, ap_longitude, ap_latitude,ap_city_id)
  VALUES (3541785, 'IFS Residences', '60:0b:03:4d:de:20', 2479598, 1529394139087, 1529394139087,0,0,'418acbe64798452ef97d39b829cda7e1',0,0,0) */
  insert(orm = {}) {
    this._orm = orm;
    this._orm.act = 'insert';
    return this.query();
  }

  // UPDATE ap set ap_code=MD5(CONCAT(ap_ssid, "_", UPPER(ap_bssid))) where ap_ssid='Gymboree' and ap_bssid='88:25:93:bc:a6:6c'
  update(orm = {}) {
    this._orm = orm;
    this._orm.act = 'update';
    return this.query();
  }

  delete(orm = {}) {
    this._orm = orm;
    this._orm.act = 'delete';
    return this.query();
  }

  count(orm = {}) {
    this._orm = orm;
    this._orm.act = 'count';
    return this.query();
  }

  truncate(orm = {}) {
    this._orm = orm;
    this._orm.act = 'truncate';
    return this.query();
  }

  drop(orm = {}) {
    this._orm = orm;
    this._orm.act = 'drop';
    return this.query();
  }

  /* CREATE TABLE `table1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `param1` varchar(100) NOT NULL,
  `param2` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table1_UN` (`param1`),
  KEY `table1_param1_IDX` (`param1`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf32_hungarian_ci; */
  createTable(orm = {}) {
    this._orm = orm;
    this._orm.act = 'createTable';
    return this.query();
  }

  createDB(orm = {}) {
    this._orm = { act: 'createDB' };
    return this.query();
  }

  _error(err) {
    if (this.pool) {
      this.pool.destroy();
    }
    throw new SqlErr(`数据库连接出现错误: ${err}`);
  }
}

module.exports = class Database {
  constructor(ctx, database, type) {
    this.database = database;
    this.type = type;
    this.ctx = ctx;
  }

  table(table) {
    return new Table(this, table);
  }

  createTable(data) {
    return new Table(this).createTable(data);
  }

  createDB(data) {
    return new Table(this).createDB(data);
  }

  query(sql) {
    const t = new Table(this);
    return t.query(sql);
  }
};
