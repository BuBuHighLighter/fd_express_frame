const mysql = require('mysql');
const uuidv4 = require('uuid/v4');
/**
 * 功能：创建一个全局的mysql连接池
 */

function init(confName) {
    const databaseConf = require('../config/database')[confName];
    let exportOBJ = {};

    if (databaseConf.switch === true) {
        let pool = mysql.createPool(databaseConf);

        // 查询的异步写法
        function Query(sql, args, cb) {
            try {
                this.pool.query(sql, args, function (err, results, fields) {
                    if (err) {
                        let uuid = uuidv4();
                        console.log(err);
                        g_logger.error.log(err, uuid);
                        return cb({code: -1, msg: uuid});
                    }
                    cb({code: 0, msg:{results, fields}});
                })
            }
            catch (e) {
                let uuid = uuidv4();
                console.log(e);
                g_logger.error.log(e, uuid);
                return cb({code: -1, msg: uuid});
            }
        }

        // 查询的同步写法    
        function QuerySyncFunc(sql, args, that) {
            return new Promise((resolve, reject) => {
                try{
                    that.pool.query(sql, args, function (err, results, fields) {
                        if (err)
                            return reject(err);
                        let result = {
                            results: results,
                            fields: fields
                        }
                        return resolve({code: 0, msg: result});
                    })
                }
                catch(e) {
                    console.log(e);
                    let uuid = uuidv4();
                    g_logger.error.log(e.stack, uuid);
                    return resolve({code: -1, msg: uuid});
                }

            })
        }

        // 在外面包裹一层错误处理，如果出错返回null，否则返回对应值。（其他的操作也可以参照这个来写）
        let QuerySync = async function (sql, args) {
            try {
                let result = await QuerySyncFunc(sql, args, this);
                return Promise.resolve(result);
            }
            catch (e) {
                let uuid = uuidv4();
                console.log(e);
                g_logger.error.log(e.stack, uuid);
                return Promise.resolve({code: -1, msg: uuid});
            }
        };

        exportOBJ.pool = pool;
        exportOBJ.Query = Query;
        exportOBJ.QuerySync = QuerySync;
    }
    return exportOBJ;
}

module.exports = init;