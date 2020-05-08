const knex = require('knex');
const utils = require('../../libs/utils');

class M {
  constructor(dbConfig) {
    this._dbCacheObj = {};
    const keys = Object.keys(dbConfig);
    let key;
    for (key of keys) {
      const item = {};
      this._dbCacheObj[key] = item;

      let obj = dbConfig[key];
      if (!global.Utils.isArray(obj)) {
        obj = [obj];
      }
      item.connCfgList = [];
      // item.currIdx = 0;
      for (let i = 0; i < obj.length; i++) {
        const objItem = obj[i];
        const config = {
          client: objItem.client,
          pool: {
            min: objItem.connMin || 0,
            max: objItem.connMax || 10,
          },
        };
        switch (objItem.client) {
          case 'mysql':
            config.connection = {
              host: objItem.host,
              port: objItem.port || 3306,
              user: objItem.user,
              password: objItem.password,
            };
            break;
          default:
        }
        item.connCfgList.push(config);
      }
      item.dbKnexCaches = {};
    }
  }

  useDB(database, type = 'master') {
    const dbCache = this._dbCacheObj[type];
    if (!dbCache) {
      return null;
    }
    let dbKnexCache = dbCache.dbKnexCaches[database];
    if (!dbKnexCache) {
      dbKnexCache = {
        idx: 0,
        knexObjs: [],
      };
      dbCache.dbKnexCaches[database] = dbKnexCache;
    }
    let dbKnexObj = dbKnexCache.knexObjs[dbKnexCache.idx];
    if (!dbKnexObj) {
      const knexCfg = utils.deepClone(dbCache.connCfgList[dbKnexCache.idx]);
      knexCfg.connection.database = database;
      dbKnexObj = knex(knexCfg);
      dbKnexCache.knexObjs[dbKnexCache.idx] = dbKnexObj;
    }
    if (dbCache.connCfgList.length > 1) {
      dbKnexCache.idx = dbKnexCache.idx + 1 >= dbCache.connCfgList.length ? 0 : dbKnexCache.idx + 1;
    }
    return dbKnexObj;
  }
}

module.exports = M;
