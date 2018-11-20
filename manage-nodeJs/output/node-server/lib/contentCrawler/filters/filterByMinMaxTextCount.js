module.exports = function({tagList, minTextCount, maxTextCount}){
    // console.log(allTags);
    tagList =  tagList.map(eachTag=>{
        eachTag.text = eachTag.tag.text().trim();
        eachTag.textCount = eachTag.text.length;
        return eachTag;
    });
    return tagList.filter(eachTag => {
        if(eachTag.textCount > maxTextCount){
            return false;
        }
        if(eachTag.textCount < minTextCount){
            return false;
        }
        return true;
    });
}