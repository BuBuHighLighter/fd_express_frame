const uuidv4 = require('uuid/v4');
Date.prototype.Format = function (fmt) 
{
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function FormatDate(mat, date = null)
{
    if(date === null)
        date = new Date();
	return new Date(date).Format(mat);
}

// 把对象A合并到对象B中，并把合并结果obj返回(如果出现同名属性，b的会把a的覆盖)
function copyOBJ(a, b, obj={}) {
	obj = Object.assign(obj, b, a);						// a放后面，因为如果有同名属性，后面的源对象会覆盖前面的源对象
	for(let i in a) {
		if(typeof a[i] === 'object' && typeof b !== 'undefined')
			obj[i] = copyOBJ(a[i], b[i], obj[i]);
	}
	return obj;
}

/**
 * 封装http/https请求
 * @param {string} isHttp - http或https协议
 * @return {object} - 对应协议封装的各请求方式
 */
function Request(isHttp = 'http') {

	let obj = {};
	obj.uuid = uuidv4();

	let protocol = http;
	if (isHttp.toLowerCase() === 'https') {
		protocol = https;
	}
	/**
	 * 异步post方法
	 * @param {object} opt - 发送请求的配置参数
	 * @property {string} opt.host - 发送请求的host地址
	 * @param {object} data - 请求的数据
	 * @param {function} cb - 回调函数
	 */
	obj.post = function (opt, data, cb) {
		opt.method = 'POST';
		const req = protocol.request(opt, (res) => {
			res.setEncoding('utf8');
			let body = '';
			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				console.log(colors.blue(`(${this.uuid})`), body);
				g_logger.log.log(body, this.uuid);

				return cb({ code: 0, uuid: this.uuid, data: body });
			})
		})

		req.on('error', (e) => {
			console.log( colors.blue(`(${this.uuid})`), e);
			g_logger.log.log(body, this.uuid);
			return cb({ code: -1, uuid: this.uuid });
		})

		req.write(data);
		console.log(colors.blue(`(${this.uuid})`), opt);
		g_logger.log.log(opt, this.uuid);
		g_logger.log.log(body, this.uuid);
		req.end();
	}

	/**
	 * 同步post方法
	 * @param {object} opt - 发送请求的配置参数
	 * @property {string} opt.host - 发送请求的host地址
	 * @param {object} data - 请求的数据
	 * @return {object} - 如果object.code=0,则有object.data；否则只有object.uuid
	 */
	obj.postSync = function (opt, data) {
		return new Promise((resolve, reject) => {
			opt.method = 'POST';
			const req = protocol.request(opt, (res) => {
				res.setEncoding('utf8');
				let body = '';

				res.on('data', (chunk) => {
					body += chunk;
				});

				res.on('end', () => {
					console.log(colors.blue(`(${this.uuid})`), body);
					g_logger.log.log(body, this.uuid);
					return resolve({ code: 0, data: body });
				})
			})

			req.on('error', (e) => {
				console.log(colors.blue(`(${this.uuid})`), e);
				g_logger.log.log(body, this.uuid);
				return resolve({ code: -1, uuid: this.uuid });
			})

			req.write(data);
			console.log(colors.blue(`(${this.uuid})`), opt);
			g_logger.log.log(opt, this.uuid);
			g_logger.log.log(body, this.uuid);
			req.end();
		})
	}

	/**
	 * 异步get方法
	 * @param {object} opt - 发送请求的配置参数
	 * @property {string} opt.host - 发送请求的host地址
	 * @param {object} data - 请求的数据
	 * @param {function} cb - 回调函数
	 */
	obj.get = function (opt, data, cb) {
		console.log(colors.blue(`(${this.uuid})`), opt);
		g_logger.log.log(opt, this.uuid);
		g_logger.log.log(data, this.uuid);

		const req = protocol.request(opt.host + '?' + querystring.stringify(data), (res, fd) => {
			let body = '';
			res.on('data', (chunk) => {
				body += chunk;
			})
			res.on('end', () => {
				console.log(colors.blue(`(${this.uuid})`), body);
				g_logger.log.log(body, this.uuid);
				cb(body);
			})	
		})
		req.end();
	}

	/**
	 * 同步get方法
	 * @param {object} opt - 发送请求的配置参数
	 * @property {string} opt.host - 发送请求的host地址
	 * @param {object} data - 请求的数据
	 * @return {object} - 如果object.code=0,则有object.data；否则只有object.uuid
	 */
	obj.getSync = function (opt, data) {
		return new Promise((resolve, reject) => {
			console.log(colors.blue(`(${this.uuid})`), opt);
			g_logger.log.log(opt, this.uuid);
			g_logger.log.log(data, this.uuid);

			const req = protocol.request(opt.host + '?' + querystring.stringify(data), (res) => {
				res.setEncoding('utf8');
				let body = '';
				res.on('data', (chunk) => {
					body += chunk;
				})

				res.on('end', () => {
					console.log(colors.blue(`(${this.uuid})`), body);
					g_logger.log.log(body, this.uuid);
					return resolve({code: 0, data: body});	
				})
			})

			req.on('error', (e) => {
				console.log(colors.blue(`(${this.uuid})`), e);
				g_logger.log.log(e.stack, this.uuid);
				return resolve({ code: -1, uuid: this.uuid });
			})
			req.end();
		})
	}
	return obj;
}
exports.FormatDate = FormatDate;
exports.copyOBJ = copyOBJ;
exports.Request = Request;
