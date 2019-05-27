const envConf = require('../env_config.json')

let defaultConf = {
    log: {
        error_log_file: "/log/err",
        log_path: "/log/api"
    }
}

let exportOBJ = g_utils.copyOBJ(defaultConf, envConf.log);          // 把envConf与defaultConf合并，并把合并结果返回

module.exports = exportOBJ;