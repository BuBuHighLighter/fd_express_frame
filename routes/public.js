var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function (req, res, next) {
  g_mysql.Query('selesct * from fd', '', function (result) {
    if(result.code === -1)
      return res.fd.fail(result.msg);
    res.fd.success(JSON.stringify(result.msg.results));
  })
});

router.get('/test1', async function (req, res, next) {
  let result = await g_mysql.QuerySync('selsect * from fd', '');
  if (result.code === -1)
    return res.fd.fail(result.msg);
  res.fd.success(JSON.stringify(result.results));
});

router.get('/test2', function (req, res, next) {
  g_redis.Query('get1', 'fd', function (result) {
    if(result.code === -1) 
      return res.fd.fail(result.msg);
    res.fd.success(result.msg);
  })
});

router.get('/test3', async function (req, res, next) {
  let result = await g_redis.QuerySync('get1', 'fd');
  if(result.code === -1) 
      return res.fd.fail(result.msg);
  res.fd.success(result.msg);
});



module.exports = router;
