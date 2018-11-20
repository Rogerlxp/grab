module.exports = function({scopeTag, bigChangeTags, perfectTags, $}){
    if(perfectTags){
        bigChangeTags = bigChangeTags.concat(perfectTags);
    }
    let $tags = scopeTag.find(bigChangeTags.join(','));
    let tagList = [];
    $tags.each((index, tag)=>{
        tagList.push({tag: $(tag)});
    });
    return tagList;
}