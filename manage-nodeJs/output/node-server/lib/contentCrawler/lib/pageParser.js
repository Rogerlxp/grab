
const cheerio = require('cheerio');
const getSpecificText = require('./getSpecificText');
const keywordFinder = require('../globalFinder/keywordFinder');
const getContent = require('./getContent');

module.exports = function({html, url, rule, result = {}}){
    const $ = cheerio.load(html);
    $('script, style, iframe').remove();
    const $body = $('body');
    result.content === undefined && (result.content = '');
    result.imgMap === undefined && (result.imgMap = []);
    // get content
    let contentObj = getContent({
        $body,$,
        url,rule
    });
    result.content += contentObj.content;
    result.imgMap = result.imgMap.concat(contentObj.imgMap);

    // get keywords
    result.keywords === undefined && (result.keywords = keywordFinder({$}));
    // title
    if(result.title === undefined){
        result.title = getSpecificText({
            bigChangeTags: ['h3', 'h4', 'h5', 'header', 'div'],
            perfectTags: ['h1', 'h2'],
            maxTextCount: 100,
            minTextCount: 5,
            searchKeywords: ['title', 'headline'],
            scopeTag: $body,
            $,
            rule,
            type: 'text',
            field: 'title',
            extraProp: ['id', 'itemprop']
        });
    }

    // source
    if(result.source === undefined){
        result.source = getSpecificText({
            bigChangeTags: ['a', 'span', 'div', 'p', 'em', 'strong'],
            maxTextCount: 20,
            minTextCount: 3,
            searchKeywords: ['source', 'publisher', 'name', 'from'],
            scopeTag: $body,
            excludeRegexp: /^查看原文$/,
            $,
            rule,
            type: 'text',
            field: 'source',
            extraProp: ['itemprop', 'id']
        });
    }
    // author
    if(result.author === undefined){
        result.author = getSpecificText({
            bigChangeTags: ['a', 'span', 'div', 'p', 'em', 'strong'],
            maxTextCount: 20,
            minTextCount: 3,
            searchKeywords: ['author'],
            scopeTag: $body,
            $,
            rule,
            type: 'text',
            field: 'author',
            extraProp: ['itemprop', 'id']
        });
    }
    // date
    if(result.date === undefined){
        result.date = getSpecificText({
            bigChangeTags: ['span', 'div', 'p', 'em', 'strong'],
            maxTextCount: 50,
            minTextCount: 4,
            searchKeywords: ['date', 'time'],
            scopeTag: $body,
            $,
            rule,
            type: 'date',
            field: 'publish-time',
            extraProp: ['id']
        });
    }
    return result;
};