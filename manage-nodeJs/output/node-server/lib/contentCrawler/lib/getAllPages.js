const urlLib = require('url');
const request = require('./request');
const cheerio = require('cheerio');
let getUrlWithoutQuery = function(urlObj){
    return urlObj.protocol + '//' + urlObj.host + urlObj.pathname;
}
module.exports = function({rule, html, url}){
    return new Promise((resolve, reject)=>{
        let pages = [];
        let urlObj = urlLib.parse(url);
        let firstPage = {};
        firstPage.url = getUrlWithoutQuery(urlObj);
        firstPage.html = html;
        // constants
        const hostReg = new RegExp(urlObj.host.replace('.', '\.'));
        // recursive get pages
        function getPages(eachHtml){
            let $ = cheerio.load(eachHtml);
            let pageEls = $(rule.pageRule);
            pageEls.each((index, el)=>{
                let $el = $(el);
                let href = $el.attr('href');
                if(!href){
                    return;
                }
                console.log('found page href: ' + href);
                let hrefObj = urlLib.parse(href);
                if(!hrefObj.host){
                    hrefObj.host = urlObj.host;
                }
                if(!hrefObj.protocol){
                    hrefObj.protocol = urlObj.protocol;
                }
                let fullHref = hrefObj.format();
                if(pages.find(each=>each.url === fullHref)){
                    return;
                }
                pages.push({url: fullHref, index: pages.length});
            });
            let noHtmlPage = pages.find(each=>each.html === undefined);
            if(!pages.find(each=>each.html === undefined)){
                console.log('全部分页已获取成功. ');
                resolve(pages);
                return;
            }
            request(noHtmlPage.url, rule)
                .then(function(html){
                    noHtmlPage.html = html;
                    getPages(noHtmlPage.html);
                });
        };
        pages.push(firstPage);
        getPages(firstPage.html);
    });
    
}