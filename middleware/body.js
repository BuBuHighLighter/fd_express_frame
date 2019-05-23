/**
 * 功能：用于把GET / POST请求过来的数据统一放到req.body中
 */
function main() {
    return function (req, res, next) {
        let method = req.method;
        if(method.toLowerCase() === 'get') {
            req.body = JSON.parse(JSON.stringify(req.query));
        }
        
        console.log(req.body);
        next();
    }
}

module.exports = main;