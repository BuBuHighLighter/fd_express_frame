/**
 * 功能：给res封装一个send方法
 */
function main() {
    return function (req, res, next) {
        res.fd = {};
        res.fd.success = req.fd.success;
        res.fd.fail = req.fd.success;
        res.fd.response = req.fd.response;
        
        next();
    }
}

module.exports = main;