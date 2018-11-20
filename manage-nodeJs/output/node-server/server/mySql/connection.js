const mysql = require('mysql');
const CONSTANTS = require('../../common/CONSTANTS');
const MYSQL_CONFIG =     {
    host: global.setting.mysql_host,
    user: global.setting.mysql_user_name,
    password: global.setting.mysql_user_password,
    port: global.setting.mysql_port,
    connectionLimit: global.setting.mysql_connect_limit,
    database: CONSTANTS.CONTENT_DB_NAME
};
if(typeof MYSQL_CONFIG.port === 'string'){
    MYSQL_CONFIG.port = +MYSQL_CONFIG.port;
}
if(typeof MYSQL_CONFIG.connectionLimit === 'string'){
    MYSQL_CONFIG.connectionLimit = +MYSQL_CONFIG.connectionLimit;
}
if(!MYSQL_CONFIG.port){
    MYSQL_CONFIG.port = 3306;
}
if(!MYSQL_CONFIG.connectionLimit){
    MYSQL_CONFIG.connectionLimit = 1;
}
/** 
 * Force to change connect config.
 * Make sure comment out when deploying outside production environment.
*/
// with li feng dev machine. 
MYSQL_CONFIG.host = '172.16.187.146';
MYSQL_CONFIG.user = 'root';
MYSQL_CONFIG.password = 'meizu.com';
MYSQL_CONFIG.connectionLimit=1;
MYSQL_CONFIG.database='GRAB';

console.log('MySql connect config: ');
console.log(MYSQL_CONFIG);
const connection = mysql.createPool(MYSQL_CONFIG);
module.exports = connection;