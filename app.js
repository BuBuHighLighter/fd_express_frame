const createError = require('http-errors');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

// 引入全局方法（也不知道全局是不是比局部好，暂时先这么做）
global.g_utils = require('./utils/Utils');
global.g_mysql = require('./DAO/mysql');
global.g_redis = require('./DAO/redis');

// 路由文件
const publicRouter = require('./routes/public');
const privateRouter = require('./routes/private');

// 自定义中间件
const fd_log = require('./middleware/log');
const fd_body = require('./middleware/body');
const fd_res = require('./middleware/res');
const fd_req = require('./middleware/req');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'icon', 'favicon.ico')));            // 获取网站图标
app.use(express.json());                                                            // 解析请求参数
app.use(express.urlencoded({ extended: false }));                                   // 解析请求参数（不是很清楚）
app.use(fd_body());                                                                 // 把请求参数全部放在req.body中
app.use(fd_req());                                                                  // 给req封装自定义属性和方法（fd_uid,以及日志的写入）
app.use(fd_log());                                                                  // 定义日志
app.use(fd_res());                                                                  // 给res封装自定义方法(这个必须放在fd_log和fd_req后面，因为需要用到这两个定义的东西)
app.use(express.static(path.join(__dirname, 'public')));                            // 静态路径

app.use('/public', publicRouter);                                                   // 公共接口，无需token
app.use('/private', privateRouter);                                                 // 私有接口，需要token

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.fd.logger.error.log(err.stack);                         // 把错误写入日志
    console.log(err.stack);


    res.render('error');
});

module.exports = app;


/**
 * 1.把redis、mysql的报错写入日志
 */
