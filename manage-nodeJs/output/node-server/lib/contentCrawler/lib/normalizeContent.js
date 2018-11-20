const travelNode = require('../lib/travelNode');
const MEDIA_TYPE_IMG = "IMG",
MEDIA_TYPE_VIDEO = "VIDEO",
MEDIA_TYPE_MUSIC = "MUSIC";
const IMG_PREFIX = 'img_';
module.exports = function({
    $,
    contentTag,
    rule
}){
    let result = {
        imgMap: [],
        content: ''
    };
    if(!contentTag || contentTag.length === 0){
        console.error('Can not find content tag.');
        return result;
    }
    // add p
    let makeP = function(text){
        return '<p>' + text.trim() + '</p>';
    }
    let makeImg = function(src, index){
        let id = IMG_PREFIX + index;
        result.imgMap.push({
            id,
            url: src,
            mediaType: MEDIA_TYPE_IMG,
        });
        return `<p class="reader_img_box"><img id="${id}" class="reader_img" src="${src}" /></p>`
    }
    let contentArr = [];
    let contents;
    let filterRuleArr = [];
    if(rule && rule.contentPRule){
        filterRuleArr.push(rule.contentPRule);
    }else{
        filterRuleArr.push('p');
    }
    if(rule && rule.contentImgRule){
        filterRuleArr.push(rule.contentImgRule);
    }else{
        filterRuleArr.push('img');
    }
    if(filterRuleArr.length){
        console.log('filter rule: ', filterRuleArr);
        if(rule && rule.contentNotRule){
            contentTag.find(rule.contentNotRule).remove();
        }
        contents = contentTag.find(filterRuleArr.join(','));
    }
    let imgCount = 0;
    contents.each(function(){
        if(this.name === 'img'){
            let src = this.attribs.src || this.attribs['data-src'];
            if(!src){
                let keys = Object.keys(this.attribs);
                for(let key of keys){
                    let val = this.attribs[key];
                    if(/[jpe?g|png|gif]/.test(val)){
                        src = val;
                        break;
                    }
                }
            }
            contentArr.push(makeImg(src, imgCount));
            imgCount++;
        }else{
            let text = $(this).text().trim();
            if(!text){
                return;
            }
            contentArr.push(makeP(text));
            return;
        }
        // travelNode(this, function(node){
        //     if(node.type === 'comment'){
        //         return;
        //     }
        //     if(node.type === 'text'){
        //         let text = node.data.trim();
        //         if(!text){
        //             return;
        //         }
        //         contentArr.push(makeP(text));
        //         return;
        //     }
        //     if(node.type === 'tag'){
        //         if(node.name === 'img'){
        //             const src = node.attribs.src || node.attribs['data-src'];
        //             if(!src){
        //                 let keys = Object.keys(node.attribs);
        //                 for(let key of keys){
        //                     let val = node.attribs[key];
        //                     if(/[jpe?g|png|gif]/.test(val)){
        //                         src = val;
        //                         break;
        //                     }
        //                 }
        //             }
        //             contentArr.push(makeImg(src, imgCount));
        //             imgCount++;
        //         }
        //         return;
        //     }
        // });
    });
    result.content = contentArr.join('');
    // console.log(result);
    return result;
}