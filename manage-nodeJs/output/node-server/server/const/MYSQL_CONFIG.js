// todo: change to production config
const CONFIG = {
    // host: '172.16.187.146',
    // user: 'root',
    // password: 'meizu.com',
    // port: 3306
};
// this is development config

// test
// if(global.setting.isDev){
//     CONFIG.host = '172.16.178.242';
//     CONFIG.user = 'mysqlusers';
//     CONFIG.password = 'ffmysqlusers';
//     CONFIG.port = 3306;
//     CONFIG.connectionLimit = 1;
// }

// dev
// if(global.setting.isDev){
//     CONFIG.host = '172.16.187.146';
//     CONFIG.user = 'root';
//     CONFIG.password = 'meizu.com';
//     CONFIG.port = 3306;
//     CONFIG.connectionLimit = 1;
// }
module.exports = CONFIG;
