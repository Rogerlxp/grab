const normalizeContent = require('./normalizeContent');
const autoContent = require('../autoEngine/content');
module.exports = function({
    $body,
    $,
    url,
    rule
}){
    let output = {};
    if(rule && rule.contentRule){
        output.contentTag = $body.find(rule.contentRule);
        if(output.contentTag.length === 0){
            console.error('can not find content by rule.');
            console.log($body.html());
        }else{
            console.log('found content.');
            // console.log(output.contentTag);
        }
    }
    if(!output.contentTag || output.contentTag.length === 0){
        console.warn('using auto content crawler.');
        output.contentTag = autoContent({$body, $});
    }
    let normalizedContent = normalizeContent({$, contentTag: output.contentTag, url, rule});
    output.content = normalizedContent.content;
    output.imgMap = normalizedContent.imgMap;
    return output;
}