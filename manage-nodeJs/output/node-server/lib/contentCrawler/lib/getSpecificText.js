const matchDateText = require('./matchDateText');
const filterByTags = require('../filters/filterByTags');
const filterByPropKeyword = require('../filters/filterByPropKeyword');
const filterByExcludeRegexp = require('../filters/filterByExcludeRegexp');
const filterByMinMaxTextCount = require('../filters/filterByMinMaxTextCount');
const keepPerfectTag = require('../filters/keepPerfectTag');
const removeSamePropVal = require('../filters/removeSamePropVal');
const dateFinder = require('../globalFinder/dateFinder');
const extractResult = require('../lib/extractResult');
const globalFinder = require('../globalFinder/globalFinder');
const getByRegexp = function({nodes, regexp, $}){
    let text = '';
    for(let node of nodes){
        const tag = node.tag;
        // only get the root level text
        const t = tag.first().contents().filter(function() {
            return this.type === 'text';
        }).text().trim();
        if(t){
            // console.log('match text: ' + t);
            let match = t.match(regexp);
            if(match){
                console.log('matched text: ', match)
                console.log(`input: '${t}'`);
                text = match[1];
                // cheerio can break out loop early. just return false to achieve.
                break;
            }
        }
    }
    console.log('found content by reg expression: ' + text);
    return text;
}

module.exports = function({
    minTextCount,
    maxTextCount,
    bigChangeTags,
    searchKeywords,
    scopeTag,
    excludeRegexp,
    perfectTags,
    $,
    type,
    field,
    extraProp,
    rule,
}){
    let result  = '';
    let allTags;
    let tagList = [];
    let regexp;
    if(rule){
        // eq() is not implement by cheerio, so here is a advance select function.
        const advSelect = function(selector){
            let eqRegexp = /\:eq\((\d)\)/;
            let matchEq = selector.match(eqRegexp);
            let tags;
            let list = [];
            if(matchEq){
                selector = selector.replace(eqRegexp, '');
                let index = (+matchEq[1]);
                tags = $(selector).eq(index);
            }else{
                tags = $(selector);
            }
            tags.each(function(){
                let $tag = $(this);
                list.push({tag: $tag});
            });
            return list;
        }
        switch(field){
            case 'title':
                rule.titleRule && (tagList = advSelect(rule.titleRule));
                regexp = rule.titleRegexp;
                break;
            case 'source':
                rule.sourceRule && (tagList = advSelect(rule.sourceRule));
                regexp = rule.sourceRegexp;
                break;
            case 'author':
                rule.authorRule && (tagList = advSelect(rule.authorRule));
                regexp = rule.authorRegexp;
                break;
            case 'publish-time':
                rule.publicDateRule && (tagList = advSelect(rule.publicDateRule));
                regexp = rule.publicDateRegexp;
        }
        if(regexp){
            if(/^\/[^\/*]+.*\/$/.test(regexp)){ // check this weather a valid reg expression.
                // this can prevent some secure issue although not necessary.
                console.log('find text by reg expression: ', regexp);
                regexp = eval(regexp);
                
                if(tagList.length){
                    result = getByRegexp({regexp, $, nodes:tagList});
                }
                if(!result){
                    console.warn('found no match node. use all tags for reg express match.');
                    const allTags = [];
                    $('*').each(function(){
                        const $this = $(this);
                        allTags.push({tag: $this});
                    });
                    result = getByRegexp({regexp, $, nodes: allTags});
                }
            }else{
                console.warn('不是合法的Reg expression: ' + regexp);
                regexp = '';
            }
        }
    }
    if(!tagList[0]){
        console.warn('finding in narrow mode.');
        //basic filters
        allTags = filterByTags({scopeTag, bigChangeTags, perfectTags, $});
        allTags = filterByMinMaxTextCount({tagList: allTags, minTextCount, maxTextCount});
        allTags = filterByExcludeRegexp({tagList: allTags, excludeRegexp});
        // next level
        tagList = keepPerfectTag({tagList: allTags, perfectTags});
        tagList = filterByPropKeyword({tagList, perfectTags, extraProp, searchKeywords, bigChangeTags});
        tagList = removeSamePropVal({tagList});
    }
    // dirty way
    if(result){
        console.log('found result: ' + result);
    }else if(type === 'text'){
        let firstTag = tagList[0];
        if(firstTag){
            result = firstTag.tag.text().trim();
        }else{
            console.warn('finding ' + field + ' in dirty mode...');
            if(field === 'source'){
                result = globalFinder({$, field});
                if(!result && rule && rule.siteName){
                    result = rule.siteName;
                }
            }else if(field === 'author'){
                result = globalFinder({$, field});
            }else if(field === 'title'){
                result = $('title').text().trim();
            }
        }
    }else if(type === 'date'){
        if(tagList.length){
            for(let each of tagList){
                let match = matchDateText(each.tag.text());
                if(match){
                    result = match;
                    break;
                }
            }
        }else{
            // dirty mode
            console.warn('finding date in dirty mode...');
            let found = dateFinder({allTags});
            if(found){
                result = found;
            }else{
                console.warn('Can not find matched date tag, using current time.');
                result = new Date().toISOString();
            }
        }
    }
    return extractResult({text:result, field});
}