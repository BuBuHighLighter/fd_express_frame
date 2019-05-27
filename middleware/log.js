const url = require('url');
const colors = require('colors');
const path = require('path');
const fs = require('fs');
const logConf = require('../config/log')
/**
 * 功能：用于自己生成日志格式
 * 参数：1.filePath 文件存储的路径（从项目的根目录开始）
 *      2.fileName 文件名
 */
function main() {

    // 创建日志文件夹(目前只支持二级json结构，即：log/log，并不支持更多级)
    const absDir = path.join(__dirname, '../');
    createFile(path.join(absDir, logConf.dir_name));                                       // 创建顶层文件夹
    let keys = Object.keys(logConf);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] == 'dir_name')
            continue;
        let item = logConf[keys[i]];
        createFile(path.join(absDir, logConf.dir_name, item.dir_name));
    }

    // 这里还要注册一些写入日志的对象方法

    return function (req, res, next) {
        // 获取客户端的IP地址
        let ip = req.fd.ip;

        // 获取访问时间
        let date = req.fd.date;

        // 获取请求方法
        let method = req.fd.method;

        // 获取访问路径
        let pathName = req.fd.pathname;

        // 获取请求参数
        let body = JSON.stringify(req.body);

        console.log(colors.green(`[${date}]`), colors.yellow(ip), colors.magenta(method), pathName, body);

        let logContent = `[${date}] ${ip} ${method} ${pathName} ${body} \r\n`;


        logDate = g_utils.FormatDate('yyyy-MM-dd');
        let writeFilePath = path.join(process.cwd(), filePath, fileName + '-' + logDate + '.txt');
        let fileReadStream = fs.createWriteStream(writeFilePath, { flags: 'a+' });
        fileReadStream.write(logContent, 'utf8');
        fileReadStream.end();
        // fileReadStream.on('end', function() { });
        fileReadStream.on('error', function (err) {
            console.error(err);

            // 把错误信息写入另一个错误日志
            fs.writeFileSync(path.join(__dirname, '../', logConf.log.error_log_file, errFileName + '-' + logDate + '.txt'), err, 'utf-8', { flags: 'a+' });
        })
        next();
    }
}

module.exports = main;

function createFile(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}