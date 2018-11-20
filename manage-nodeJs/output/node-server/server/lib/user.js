const ajax = require('./ajax');
const signLib = require('./sign');
const URL_DEF = require('../../common/URL');
const SERVICE = 'contents';
const makeQuery = function(uTicket){
    let urlParam = [];
    let signedText = signLib.uaParams({ticket: uTicket});
    urlParam.push('ticket=' + uTicket);
    urlParam.push('service=' + SERVICE);
    urlParam.push('sign=' + signedText);
    return urlParam.join('&');
}
module.exports = {
    async freshUserToken(uTicket){
        let queryText = makeQuery(uTicket);
        const url = URL_DEF.refreshUserToken.value + '?' + queryText;
        //console.log('fresh token url: ', url);
        let res = await ajax.get(url);
        //console.log('fresh token:', res);
        return res;
    },
    async getUserInfo(uTicket){
        let queryText = makeQuery(uTicket);
        const url = URL_DEF.getUserInfo.value + '?' + queryText;
        //console.log('get user url: ', url);
        let userInfoData =  await ajax.get(url);
        //console.log('get user info: ', userInfoData);
        return userInfoData;
    },
    makeLoginUrl(req){
        const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        return URL_DEF.userLogin.value + '?useruri=' +  encodeURIComponent(requestUrl);
    }
}