const envConf = require('../env_config.json');

let exportOBJ = {
    mysql: {
        switch: envConf.mysql.switch || false,
        host: envConf.mysql.host || '127.0.0.1',
        user: envConf.mysql.user || 'root',
        password: envConf.mysql.password || '',
        database: envConf.mysql.database || 'test',
        connectionLimit: envConf.mysql.connectionLimit || 10
    }
}

module.exports = exportOBJ;