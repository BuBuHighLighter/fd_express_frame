const mysql = require('mysql');
const databaseConf = require('../config/database').mysql;
const uuidv4 = require('uuid/v4');
/**
 * 功能：创建一个全局的mysql连接池
 */

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
            if(that == null) {
                let uuid = uuidv4();
                function getException() {
                    try {
                        throw Error('无效的MySQL指针');
                    } catch (err) {
                        return err;
                    }
                }
                const err = getException();
                const stack = err.stack;
                console.log(stack);
                g_logger.error.log(stack, uuid);
                return resolve({code: -1, msg: uuid});
            }
            that.pool.query(sql, args, function (err, results, fields) {
                if (err)
                    return reject(err);
                let result = {
                    results: results,
                    fields: fields
                }
                return resolve({code: 0, msg: result});
            })

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
            console.log(e.stack);
            g_logger.error.log(e.stack, uuid);
            return Promise.resolve({code: -1, msg: uuid});
            // 这里需要写入err日志
        }
    };

    exportOBJ.pool = pool;
    exportOBJ.Query = Query;
    exportOBJ.QuerySync = QuerySync;
}

module.exports = exportOBJ;