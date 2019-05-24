const mysql = require('mysql');
/**
 * 功能：创建一个全局的mysql连接池
 */

 let exportOBJ = {};

 let pool = mysql.createPool();
