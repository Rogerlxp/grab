const getAllPages = require('./lib/getAllPages');
const pageParser = require('./lib/pageParser');
const request = require('./lib/request');

module.exports = async function({url, rule}){
    console.log('crawl url: ' + url);
    console.log('crawl rule: ', rule);
    let html;
    try{
        html = await request(url, rule);
    }catch(error){
        console.error(error);
        return {
            message: '请求网页失败，请重试',
            value: '',
            code: 501
        }
    }
    if(rule && rule.pageRule){
        let pages = await getAllPages({html, rule, url});
        let result = {};
        pages.forEach(page=>{
            pageParser({
                html: page.html,
                url: page.url,
                rule,
                result
            });
        });
        return result;
    }else{
        return pageParser({
            html,
            url,
            rule
        });
    }
};