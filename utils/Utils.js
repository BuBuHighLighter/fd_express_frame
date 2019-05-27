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
		if(typeof a[i] === 'object')
			obj[i] = copyOBJ(a[i], b[i], obj[i]);
	}
	return obj;
}

exports.FormatDate = FormatDate;
exports.copyOBJ = copyOBJ;