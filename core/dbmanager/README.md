## mysql模块

一、实例连接

``` javascript
  const mysql = require('dbmanager/mysql')
  const conn = new mysql(dbConfig);
  eg: new mysql({
    master: {
      connectionLimit : 10,
      host: '10.10.116.174',
      port: 3306,
      user: 'geek',
      password: '123456'
    },
    slave: [{
      connectionLimit : 10,
      host: '10.10.116.174',
      port: 3306,
      user: 'geek',
      password: '123456'
    }]
  }) 
```

二、选择数据库

``` javascript
  /**
   * @param {Object} {
   *   database: String  // 数据库名称
   *   Master/Slave: String // 'Master' || 'Slave
   * }
   */
  const db = conn.useDB(database, Master/Slave);
```

三、选择表
``` javascript
  /**
   * @param {String} tableName // 表名
   */
  const table = db.table(tableName); 
```

四、sql
1. query
``` javascript
  /**
   * @param {String} // sql语句
   */
  table.query(sql); 
```
2. select
``` javascript
  /**
   * @param {Object} {
   *   select: <Array>,   // [keyName](要选择的字段名)
   *   where: <String>,   // `id = xx`(条件) 
   *   group: <Array>,    // group by keyName1, keyName2  
   *   order: <Object>,   // order by key val > -1 ? asc : desc
   *   limit: <Object>    // limit ${limit.start}, ${limit.size} 
   * }
   */
  table.select(params); 
```
3. insert
``` javascript
  /**
   * @param {Object} {
   *   data: <Object> // 入表的键值对
   * }
   */
  table.insert(params); 
```
4. update
``` javascript
  /**
   * @param {Object}{
   *   data: <Object>, // 更新表的键值对
   *   where: <String>  // 条件
   * }
   */
  table.update(params); 
```
5. count
``` javascript
  /**
   * @param {Object}{
   *   select: <String>, // 要count的字段名, 默认 '*'
   *   where: <String>  // 条件
   * }
   */
  table.count(params); 
```
6. delete
``` javascript
  /**
   * @param {Object}{
   *   where: <String>  // 条件
   * }
   */
  table.delete(params); 
```