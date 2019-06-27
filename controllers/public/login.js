let main = {
    post: function(req, res, next) {
        res.fd.success('ok');
    },

    get: function(req, res, next) {
        console.log('get ok');
        res.fd.success('ok');
    }
}

module.exports = main;