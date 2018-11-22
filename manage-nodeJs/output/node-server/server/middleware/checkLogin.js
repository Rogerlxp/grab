const request = require('request-promise-native');
const ajax = require('../lib/ajax');
const loginUrl = 'https://login.flyme.cn/login/login.html';
const logoutUrl = 'https://login.flyme.cn/sso/logout?useruri=';
const getUserInfoUrl = 'https://i.flyme.cn/uc/sign/getLoginInfoByTicket?';
const getAccessTokenUrl = 'https://i.flyme.cn/uc/sign/getTokenByTicket?';
const freshAccessTokenUrl = 'https://i.flyme.cn/uc/webservice/refreshTokenByTicket?';
const signLib = require('../lib/sign');
const userLib = require('../lib/user');
const URL_DEF = require('../../common/URL');
const getKeyByReg = require('../lib/getKeyByReg');
const userModel = require('../model/user');
const dns = require('dns');
module.exports = async function(req, res, next){
<<<<<<< HEAD
	return next();
=======
>>>>>>> 25f81651ca73ec7ec1117b96898122ec79e9134e
    // console.log('check login');
    // console.log('is xhr: ', req.xhr);
    const cookies = req.cookies;
    const uTicket = getKeyByReg(cookies, /uTicket/i);
    const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const loginUrl = URL_DEF.userLogin.value + '?useruri=' +  encodeURIComponent(currentUrl);
    if(req.session && req.session.user){
        // global.setting.isDev && console.log('user already login.');
        // console.log(req.session.user);
        const loginTime = req.session.user.loginTime;
        if(loginTime){
            if(loginTime + 20*60*1000 < Date.now()){
                console.log('fresh user token.');
                let freshRes = await userLib.freshUserToken(uTicket);
                if(+freshRes.code === 200 && freshRes.value === true){
                    console.log('user token fresh success.');
                    req.session.user.loginTime = Date.now();
                    next();
                    return;
                }
                console.warn(freshRes);
                if(req.xhr){
                    res.json({
                        code: 401,
                        message: res.message,
                        value: res.value
                    });
                }else{
                    res.redirect(loginUrl);
                }
                return;
            }
        }
        next();
        return;
    }
    if(!uTicket){
        console.log('Can not get ticket, redirect to login page.');
        res.redirect(loginUrl);
        return;
    }
    if(uTicket){
        let userInfo = await userLib.getUserInfo(uTicket);
        // console.log(userInfo);
        if(+userInfo.code === 200){
            if(!userInfo.value || !userInfo.value.name){
                console.log(userInfo);
                console.log('user ticket expired, redirect to: ' + loginUrl);
                dns.lookup('i.flyme.cn', function(err, address){
                    if(err){
                        throw err;
                    }
                    console.log('i.flyme.cn host ip: ' + JSON.stringify(address));
                });
                res.redirect(loginUrl);
                return;
            }else{
                const newUser = {
                    uTicket: uTicket + '',
                    name: userInfo.value.name,
                    id: userInfo.value.uid + '',
                    permissions: []
                };
                req.session.user = {
                    id: newUser.id,
                    loginTime: Date.now()
                };
                userModel.pushUnique(newUser);
                req.session.save(function(err){
                    if(err){
                        console.error(err);
                        return;
                    }
                    next();
                });
                // console.log('use info: ', userInfo);
                return;
            }
        }else if(+userInfo.code === 400){
            const errorMessage = ['Ticket is not valid. This situation most happened when you switch from Inweb to production environment.'];
            dns.lookup('i.flyme.cn', (err, address)=>{
                if(err){
                    throw err;
                }
                if(global.setting.isDev){
                    errorMessage.push(getUserInfoUrl + urlParamText);
                    errorMessage.push('Your ticket: ' + uTicket);
                    errorMessage.push('Please manually go to:' + loginUrl);
                    errorMessage.push('Server error message: ' + userInfo.message);
                    errorMessage.push('i.flyme.cn DNS: ' + JSON.stringify(address));
                    errorMessage.push('Cookie has been clear. Please try again.');
                    console.log(errorMessage.join('\n'));
                }
                let keys = Object.keys(cookies);
                keys.forEach(function(key){
                    errorMessage.push('clear cookie: ' + key);
                    res.clearCookie(key);
                });
                const logoutUrl = 'https://login.flyme.cn/sso/logout?useruri=' + encodeURIComponent(req.protocol + '://' + req.get('host'));
                if(req.xhr){
                    res.json({
                        code: 401,
                        message: res.message,
                        value: res.value
                    });
                }else{
                    res.redirect(loginUrl);
                }
            });
        }
    }
}