/**
 * 重写console.log
 */

const colors = require('colors');

function main() {
    global.console.log = (function (oriLogFunc) {
        return function (...strs) {
            oriLogFunc.call(console, colors.green(`[${g_utils.FormatDate('yyyy-MM-dd hh:mm:ss:S')}]`) + strs.join(' '));
        }
    })(console.log);
    
    return function (req, res, next) {
        next();
    }
}

module.exports = main;