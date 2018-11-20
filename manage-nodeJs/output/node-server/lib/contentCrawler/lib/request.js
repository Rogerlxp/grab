const chromeFetch = require('../fetchEngine/chrome');
const zombieFetch = require('../fetchEngine/zombie');
const ajaxFetch = require('../fetchEngine/ajax');
module.exports = async function(url, rule){
    // check environment
    let isNode = false;
    if (typeof process === 'object') {
        if (typeof process.versions === 'object') {
          if (typeof process.versions.node !== 'undefined') {
            isNode = true;
          }
        }
      }
    console.log('requesting page data: ' + url);
    let fetchEngine = 'ajax';
    let isNeedScroll = false;
    if(rule){
        fetchEngine = rule.fetchEngine || fetchEngine;
        isNeedScroll = rule.isNeedScroll === undefined ? isNeedScroll : rule.isNeedScroll;
    }
    if(isNode){
        console.log('running in node.js environment.');
        let html = '';
        console.log('fetch html engine: ' + fetchEngine);
        if(fetchEngine === 'chrome'){
            html = await chromeFetch(url, rule);
        }else if(fetchEngine === 'zombie'){
            html = await zombieFetch(url);
        }else if(fetchEngine === 'ajax'){
            html = await ajaxFetch(url);
        }
        if(!html){
            throw new Error('can not get page html.');
        }
        return html
    }else{
        const res = await axios({
            url,
            method: 'get'
        });
        console.log('res: ', res);
        if(res.status !== 200){
            console.error('Request failed: ' + url);
            return;
        }else{
            res.data;
        }
    }
}