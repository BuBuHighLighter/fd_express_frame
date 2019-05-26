/**
 * 功能：封装req自定义属性和方法
 */
const uuid = require('uuid');
const uuidv4 = require('uuid/v4');

function main() {
    return function (req, res, next) {
        req.fd_uuid = uuidv4();
        next();
    }
}

module.exports = main;