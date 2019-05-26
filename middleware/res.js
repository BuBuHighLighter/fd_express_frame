/**
 * 功能：给res封装一个send方法
 */
function main() {
    return function (req, res, next) {
        res.fd_send = function(args) {
            console.log(args);
            res.end(args);
        }
        next();
    }
}

module.exports = main;