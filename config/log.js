const logConf = require('../env_config.json')

let exportOBJ = {
    log: {
        error_log_file: logConf.log.error_log_file || "/log/err",
        log_path: logConf.log.log_path || "/log/api"
    }
}

module.exports = exportOBJ;