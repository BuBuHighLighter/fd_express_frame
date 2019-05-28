const redis = require('redis');
const databaseConf = require('../config/database').redis;
const util = require('util');
const uuidv4 = require('uuid/v4');

/**
 * 功能：创建一个全局redis连接
 */

// redis的函数设置（连接）
const retry_strategy = function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('连接被拒绝');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('重试次数耗尽');
    }
    if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
}

// 初始化redis连接参数
databaseConf.retry_strategy = retry_strategy;
databaseConf.auth_pass = databaseConf.password;

let exportsOBJ = {};

if (databaseConf.switch == true) {
    // 只有开关打开时才创建连接对象
    const client = redis.createClient(databaseConf);

    // 暴露对象
    exportsOBJ.client = client;

    /**
     * 查询的异步方法
     */
    exportsOBJ.Query = function (com, args, cb) {
        if (this.client[com] == null || this.client[com] == undefined) {
            let uuid = uuidv4();
            function getException() {
                try {
                    throw Error('无效的redis方法');
                } catch (err) {
                    return err;
                }
            }
            const err = getException();
            const stack = err.stack;
            console.log(stack);
            g_logger.error.log(stack, uuid);
            return cb({ code: -1, msg: uuid });
        }
        this.client[com](args, function (err, res) {
            if (err) {
                console.log(err);
                let uuid = uuidv4();
                g_logger.error.log(err, uuid);
                return cb({ code: -1, msg: uuid });
            }
            return cb({ code: 0, msg: res });
        })
    }

    // 查询的同步方法
    let QuerySyncFunc = (com, args, that = null) => {
        return new Promise(async (resolve, reject) => {
            if (that === null) {
                let uuid = uuidv4();
                function getException() {
                    try {
                        throw Error('无效的redis指针')
                    } catch (err) {
                        return err;
                    }
                }
                const err = getException();
                const stack = err.stack;
                console.log(stack);
                g_logger.error.log(stack, uuid);
                return resolve({ code: -1, msg: uuid });
            }
            let querySync;
            try {
                querySync = util.promisify(that.client[com]).bind(that.client);
            }
            catch (e) {
                console.log(e.stack);
                let uuid = uuidv4();
                g_logger.error.log(e.stack, uuid);
                return resolve({ code: -1, msg: uuid });
            }
            let result = await querySync(args);

            return resolve({ code: 0, msg: result });
        })
    }

    // 对象的同步查询封装
    exportsOBJ.QuerySync = async function (com, args) {
        try {
            let result = await QuerySyncFunc(com, args, this);
            return Promise.resolve(result);
        }
        catch (e) {
            console.log(e);
            let uuid = uuidv4();
            g_logger.error.log(e.stack, uuid);
            return Promise.resolve({ code: -1, msg: uuid });
        }
    }
}


module.exports = exportsOBJ;