const envConf = require('../env_config.json');

let exportOBJ = {
    mysql: {
        host: envConf.mysql.host || '127.0.0.1',
        user: envConf.mysql.user || 'root',
        password: envConf.mysql.password || '',
        database: envConf.mysql.host || 'test',
        connectionLimit: envConf.mysql.connectionLimit || 10
    }
}

module.exports = exportOBJ;