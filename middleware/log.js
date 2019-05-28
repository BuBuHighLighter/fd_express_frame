const colors = require('colors');
const path = require('path');
const fs = require('fs');
const logConf = require('../config/log')
/**
 * 功能：用于自己生成日志格式
 */
function main() {
    // 创建日志文件夹(目前只支持二级json结构，即：log/log，并不支持更多级)
    const absDir = path.join(__dirname, '../');
    createFile(path.join(absDir, logConf.dir_name));                                       // 创建顶层文件夹
    let keys = Object.keys(logConf);

    global.g_logger = {};

    for (let i = 0; i < keys.length; i++) {
        if (keys[i] == 'dir_name')
            continue;
        let item = logConf[keys[i]];
        g_logger[keys[i]] = createLogWriter(path.join(process.cwd(), logConf.dir_name, item.dir_name), item);
        createFile(path.join(absDir, logConf.dir_name, item.dir_name));
    }
    return function (req, res, next) {
        // 获取客户端的IP地址
        let ip = req.fd.ip;

        // 获取访问时间
        let date = req.fd.time;

        // 获取请求方法
        let method = req.fd.method;

        // 获取访问路径
        let pathName = req.fd.pathName;

        // 获取请求参数
        let body = JSON.stringify(req.body);

        // uuid
        let uuid = req.fd.uuid;

        req.fd.logger = g_logger;

        for(let i in req.fd.logger) {
            req.fd.logger[i].uuid = req.fd.uuid;
        }

        console.log(colors.green(`[${date}]`),colors.blue(`(${uuid})`), colors.yellow(ip), colors.magenta(method), pathName, body);

        let logContent = ` ${ip} ${method} ${pathName} ${body}`;

        req.fd.logger.request.log(logContent);
        next();
    }
}

function createFile(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function createLogWriter(absDir, obj) {
    let retOBJ = {};
    // 写入对应日志的操作（异步）
    retOBJ.log = function(msg='', cb=null) {
        let fileName = obj.file_name;
        let fileNameExt = '';
        if(obj.rotate_switch == true) {
            switch(obj.rotate) {
                case 'minute': fileNameExt = g_utils.FormatDate('_yyyy_MM_dd_hh_mm'); break;
                case 'hour': fileNameExt = g_utils.FormatDate('_yyyy_MM_dd_hh'); break;
                case 'day': fileNameExt = g_utils.FormatDate('_yyyy_MM_dd'); break;
                case 'month': fileNameExt = g_utils.FormatDate('_yyyy_MM'); break;
                case 'year': fileNameExt = g_utils.FormatDate('_yyyy'); break;
                default: fileNameExt = g_utils.FormatDate('_yyyy_MM_dd'); break;
            }
        }
        fileName = fileName + fileNameExt + '.txt';

        if(typeof msg === 'object')
            msg = JSON.stringify(msg);

        let msgHead = `[${g_utils.FormatDate('yyyy-MM-dd hh:mm:ss:S')}] (${this.uuid}) `;
        msg = msgHead + msg + ' \r\n';
        let writeFilePath = path.join(absDir, fileName);
        let fileWriteStream = fs.createWriteStream(writeFilePath, { flags: 'a+' });
        fileWriteStream.write(msg, 'utf8');
        fileWriteStream.end();

        fileWriteStream.on('error', function (err) {
            console.error(err);
            // 写入另一个日志中
            fs.writeFileSync(path.join(absDir, 'error', 'log_err.txt'), msg, 'utf-8', { flags: 'a+' });
        })
    }
    return retOBJ;
}

module.exports = main;

