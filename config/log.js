const envConf = require('../env_config.json')

let defaultConf = {
    dir_name: "log",
    request: {
        dir_name: "request",
        file_name: "req_log",
        rotate_switch: true,
        rotate: "day"
    },
    response: {
        dir_name: "response",
        file_name: "res_log",
        rotate_switch: true,
        rotate: "day"
    },
    error: {
        dir_name: "error",
        file_name: "err",
        rotate_switch: true,
        rotate: "day"
    }
}

let exportOBJ = g_utils.copyOBJ(defaultConf, envConf.log);          // 把envConf与defaultConf合并，并把合并结果返回

module.exports = exportOBJ;