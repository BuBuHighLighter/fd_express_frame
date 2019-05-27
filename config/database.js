const envConf = require('../env_config.json');

let defaultConf = {
    mysql: {
        switch: false,
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'test',
        connectionLimit: 1
    },
    redis: {
        switch: false,
        host: '127.0.0.1',
        password: '',
        port: '6379',
        return_buffers: false,
        db: 0,
    }
}
let exportOBJ = g_utils.copyOBJ(defaultConf, envConf.database);          // 把envConf与defaultConf合并，并把合并结果返回

module.exports = exportOBJ;