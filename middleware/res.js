const colors = require('colors');
/**
 * 功能：给res封装一个send方法
 */
function main() {
    return function (req, res, next) {
        res.fd = req.fd;

        // 响应成功
        res.fd.success = function(data) {
            _print(this.uuid, data, this.time);
            let logContent = `${this.ip} ${this.method} ${this.pathName} ${JSON.stringify(data)}`;
            this.logger.response.log(logContent);
            let ret = JSON.stringify({code: 0, data: data});
            res.end(ret);
        }

        // 响应失败
        res.fd.fail = function(data) {
            _print(this.uuid, data, this.time);
            let logContent = `${this.ip} ${this.method} ${this.pathName} ${JSON.stringify(data)}`;
            this.logger.response.log(logContent);
            let ret = JSON.stringify({code: -1, data: data});
            res.end(ret);
        }

        // 自定义响应
        res.fd.response = function(code, data) {
            _print(this.uuid, data, this.time);
            let logContent = `${this.ip} ${this.method} ${this.pathName} ${JSON.stringify(data)}`;
            this.logger.response.log(logContent);
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

function _print(uuid, data, startDate=null) {
    let date = g_utils.FormatDate('yyyy-MM-dd hh:mm:ss:S');

    if(typeof data === 'object')
        data = JSON.stringify(data);

    let useTime = 0;
    if(startDate !== null)
        useTime = parseInt(new Date(date).getTime()) - parseInt(new Date(startDate).getTime());

    console.log(colors.green(`[${date}]`), colors.blue(`(${uuid})`), useTime+colors.green('ms'), data);
}

module.exports = main;