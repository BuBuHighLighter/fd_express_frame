const url = require('url');
const colors = require('colors');
const path = require('path');
const fs = require('fs');
/**
 * 功能：用于自己生成日志格式
 * 参数：1.filePath 文件存储的路径（从项目的根目录开始）
 *      2.fileName 文件名
 */
function main(filePath = null, fileName = 'log', errFileName = 'err') {
    // 检查日志路径，不存在则创建
    let filePathArr = filePath.split(/[\/(\\)]/);
    let tempDir = '';
    for (let i = 0; i < filePathArr.length; i++) {
        tempDir = path.join(tempDir, filePathArr[i]);
        if (!fs.existsSync(path.join(__dirname, '../', tempDir)))
            fs.mkdirSync(path.join(__dirname, '../', tempDir));
    }

    // 检查错误日志路径，不存在则创建
    let errFilePathArr = g_config.error_log_file.split(/[\/(\\)]/);
    let errTempDir = '';
    for (let i = 0; i < errFilePathArr.length; i++) {
        errTempDir = path.join(errTempDir, errFilePathArr[i]);
        if (!fs.existsSync(path.join(__dirname, '../', errTempDir)))
            fs.mkdirSync(path.join(__dirname, '../', errTempDir));
    }

    return function (req, res, next) {
        // 获取客户端的IP地址
        let ip = req.headers['x-forwarded-for'] ||  // 判断是否有反向代理 IP
            req.connection.remoteAddress ||         // 判断 connection 的远程 IP
            req.socket.remoteAddress ||             // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
        if (ip.includes('::ffff:'))
            ip = ip.replace(/^:*f*:/, '');

        // 获取访问时间
        let date = g_utils.FormatDate('yyyy-MM-dd hh:mm:ss');

        // 获取请求方法
        let method = req.method;

        // 获取访问路径
        let pathName = url.parse(req.url).pathname;

        // 获取请求参数
        let body = JSON.stringify(req.body);

        console.log(colors.green(`[${date}]`), colors.yellow(ip), colors.magenta(method), pathName, body);

        let logContent = `[${date}] ${ip} ${method} ${pathName} ${body} \r\n`;

        if (filePath === null)
            return next();

        logDate = g_utils.FormatDate('yyyy-MM-dd');
        let writeFilePath = path.join(process.cwd(), filePath, fileName + '-' + logDate + '.txt');
        let fileReadStream = fs.createWriteStream(writeFilePath, { flags: 'a+' });
        fileReadStream.write(logContent, 'utf8');
        fileReadStream.end();
        // fileReadStream.on('end', function() { });
        fileReadStream.on('error', function (err) {
            console.error(err);

            // 把错误信息写入另一个错误日志
            fs.writeFileSync(path.join(__dirname, '../', g_config.error_log_file, errFileName+'-'+logDate+'.txt'), err, 'utf-8', { flags: 'a+' });
        })
        next();
    }
}

module.exports = main;