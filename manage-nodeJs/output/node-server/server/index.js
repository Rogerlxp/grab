const path = require('path');
const express = require('express');
const ip = require('ip');
const lowdb = require('lowdb');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const setting = require('./lib/setting');
const elasticsearch = require('./lib/elasticsearch');
const SYSTEM = require('../common/SYSTEM');
// setting
global.setting = {
    cwd: path.join(__dirname, '../')
};
fs.emptyDirSync(path.join(global.setting.cwd + 'temp'));
fs.removeSync(path.join(global.setting.cwd + 'db', 'session.json'));
const init = async function(){
    const app = express();
    global.setting.isDev = app.get('env') === 'development';
    global.setting.isPrd = !global.setting.isDev;
    await setting.init();
    const urlPrefix = '/' + SYSTEM.urlVersion.value;
    const checkLoginMiddleWare = require('./middleware/checkLogin');
    const router = require('./router/index');
    const LowdbSession = require('./common/lowdb-session')(session);
    const localIp = ip.address();
    // lowdb
    const sessionModel = require('./model/session');
    // is development environment
    if(global.setting.isDev){
        console.log('Node server is running in development mode.');
    }else{
        console.log('Node server is running in production mode.');
    }
    // elasticsearch
    // elasticsearch.init();
    // session
    app.set('trust proxy', 1);
    app.use(session({
        secret: 'content platform manager system made by meizu/flyme/yinjianqiang',
        resave: false,
        saveUninitialized: false,
        // cookie: {maxAge: 5*24*60*60*1000}, // 5 days
        store: new LowdbSession({
            db: sessionModel.db
        }),
    }));
    app.use(cookieParser());
    // body parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    const staticPath = path.join(global.setting.cwd, 'dist', global.setting.isDev ? 'development':'production');
    app.use(urlPrefix, express.static(staticPath));
    // router
    app.use(function(req, res, next){
        res.set('Access-Control-Allow-Origin', '*');
        // remove outdate session in db
        let sessionDb = sessionModel.getListInstance();
        sessionDb.value().forEach(function(each){
            let sessionDate = new Date(each.session.cookie.expires).getTime();
            let currentDate = Date.now();
            if(sessionDate < currentDate){
                sessionDb.remove({sid: each.sid}).write();
            }
        });
        next();
    });
    
    const homePage = urlPrefix + '/page/contents';
    // app.get('/test.html', function(req, res){
    //     res.sendFile(path.join(staticPath, 'test.html'));
    // });
    app.get('/', checkLoginMiddleWare, (req, res)=>{
        res.redirect(homePage);
    });
    app.get(urlPrefix, checkLoginMiddleWare, (req, res)=>{
        res.redirect(homePage);
    });
    app.use(urlPrefix + '/api', router);
    // this should be put in the last
    app.get(urlPrefix + '/html/:name', function(req, res){
        res.sendFile(path.join(staticPath, req.params.name + '.html'));
    });
    app.get(urlPrefix + '/page/*', checkLoginMiddleWare, function(req, res){
        // sendDataWithHtml(path.join(staticPath, 'main.html'), {user: req.session.user}, res);
        res.sendFile(path.join(staticPath, 'main.html'));
    });
    app.listen(global.setting.serverPort, ()=>{
        console.log(`Content manager system listening on  ${localIp}:${global.setting.serverPort} !`);
    });
}
init();