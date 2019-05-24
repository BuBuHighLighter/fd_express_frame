var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  g_mysql.Query('selsect * from fd', '', function(results, fields) {
    res.end(JSON.stringify(results) );
  })
});

router.get('/test1', async function(req, res, next) {
  let result = await g_mysql.QuerySync('select * from fd', '');
  if(result === null)
    return res.end('err');
  res.end(JSON.stringify(result.results));
});

module.exports = router;
