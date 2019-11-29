class M {
  constructor(mysql) {
    this.conn = mysql
    this.db = mysql.useDB('store')
    this.table1 = this.db.table('table1')
    this.table2 = this.db.table('table2')

    /*this.conn = mysql.emit(false, 'store')
    this.table1 = this.conn.table('table1')
    this.table2 = this.conn.table('table2')*/
  }

  query () {
    // return Promise.all([this.table1.getAll(), this.table2.getAll()])
    return this.conn.useDB('store').query('select * from table1')
    // return this.conn.useDB('test').query('select * from test1')
  }

  select () {
    // console.log(this.table1, this.table2)
    return this.table2
    .select({
      select: ['id', 'param1'],
      group: ['param2'],
      limit: {
        start: 2,
        size: 2
      }
    })
  }

  insert (data) {
    return this.table1
      .insert({
        data
      })
  }

  update (data) {
    return this.table1
      .update({
        data,
        where: `id = ${data.id}`
      })
  }

  createTable (para) {
    return this.db
      .createTable(para)
  }

  createDB ({ name }) {
    return this.conn
      .createDB(name)
  }

  count () {

    return this.table1
      .count({
        data,
        where: `id = ${data.id}`
      })
  }
}

module.exports = M