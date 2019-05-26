const envConf = require('../env_config.json');

let exportOBJ = {
    mysql: {
        switch: envConf.mysql.switch || false,
        host: envConf.mysql.host || '127.0.0.1',
        user: envConf.mysql.user || 'root',
        password: envConf.mysql.password || '',
        database: envConf.mysql.database || 'test',
        connectionLimit: envConf.mysql.connectionLimit || 10
    },
    redis: {
        switch: envConf.redis.switch || false,
        host: envConf.redis.host || '127.0.0.1',
        password: envConf.redis.password || '',
        port: envConf.redis.port || '6379',
        return_buffers: envConf.redis.return_buffers || false,
        db: envConf.redis.db || 0,
    }
}

module.exports = exportOBJ;