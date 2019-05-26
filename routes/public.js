var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  g_mysql.Query('select * from fd', '', function(results, fields) {
    res.end(JSON.stringify(results) );
  })
});

router.get('/test1', async function(req, res, next) {
  let result = await g_mysql.QuerySync('select * from fd', '');
  if(result === null)
    return res.end('err');
  res.end(JSON.stringify(result.results));
});

router.get('/test2', function(req, res, next) {
  g_redis.Query('get', 'fd', function(result) {
    console.log(result);
    res.end(result);
  })
});

router.get('/test3', async function(req, res, next) {
  let result = await g_redis.QuerySync('get', 'fd');
  res.fd_send(result);
});

module.exports = router;
