const PROTOCOL = 'http:';
const DOMAIN = 'om.iflow.meizu.com';
const API = {
    MOVE_RULE_FILE: '/service/function/moveRuleFile',
    REFRESH_FUNCTION_CACHE: '/service/function/refreshCache',
};
const completeUrl = function(urls){
    const keys = Object.keys(urls);
    for(const key of keys){
        urls[key] = PROTOCOL + '//' + DOMAIN + urls[key];
    }
    return urls;
}
module.exports = completeUrl(API);