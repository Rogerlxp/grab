const mysql = require('mysql');
const CONSTANTS = require('../../common/CONSTANTS');

const MYSQL_CONFIG =     {
    host: global.setting.mysql_host,
    user: global.setting.mysql_user_name,
    password: global.setting.mysql_user_password,
    port: global.setting.mysql_port,
    connectionLimit: global.setting.mysql_connect_limit,
    database: CONSTANTS.CONTENT_SHARDING_DB,
};

// console.log(MYSQL_CONFIG);
const connection = mysql.createPool(MYSQL_CONFIG);

module.exports = connection;