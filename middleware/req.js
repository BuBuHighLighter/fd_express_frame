
const uuidv4 = require('uuid/v4');
const url = require('url');
/**
 * 功能：封装req自定义属性和方法
 */
function main() {
    return function (req, res, next) {
        req.fd = {};
        req.fd.uuid = uuidv4();                             // 为每个请求分配一个uuid

        let ip = req.headers['x-forwarded-for'] ||          // 判断是否有反向代理 IP
                req.connection.remoteAddress ||             // 判断 connection 的远程 IP
                req.socket.remoteAddress ||                 // 判断后端的 socket 的 IP
                req.connection.socket.remoteAddress;

        if (ip.includes('::ffff:'))
            ip = ip.replace(/^:*f*:/, '');

        req.fd.ip = ip;                                     // 请求IP

        req.fd.time = g_utils.FormatDate('yyyy-MM-dd hh:mm:ss:S');
        req.fd.method = req.method.toLowerCase();
        req.fd.pathName = url.parse(req.url).pathname;


        next();
    }
}

module.exports = main;