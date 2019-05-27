/**
 * 功能：封装req自定义属性和方法
 */
const uuidv4 = require('uuid/v4');
const url = require('url');

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

        req.fd.time = g_utils.FormatDate('yyyy-MM-dd hh:mm:ss');
        req.fd.method = req.method.toLowerCase();
        req.fd.pathName = url.parse(req.url).pathname;

        // 响应成功
        req.fd.success = function(data) {
            console.log(req.fd.uuid, data);
            // TODO:写入响应日志中

            let ret = JSON.stringify({code: 0, data: data});
            res.end(ret);
        }

        // 响应失败
        req.fd.fail = function(data) {
            console.log(req.fd.uuid, data);
            // TODO:写入响应日志中

            let ret = JSON.stringify({code: -1, data: data});
            res.end(ret);
        }

        // 自定义响应
        req.fd.response = function(code, data) {
            console.log(req.fd.uuid, data);
            // TODO:写入响应日志中

            if(code === 0 ) {
                this.success(data);
            }
            else if(code === -1) {
                this.fail(data);
            }
            else {
                let ret = JSON.stringify({code: code, data: data});
                res.end(ret);
            }
        }


        next();
    }
}

module.exports = main;