module.exports = function({tagList, perfectTags}){
    if(!perfectTags){
        return tagList;
    }
    return tagList.map(eachTag => {
        (eachTag.tagName === undefined) && (eachTag.tagName = eachTag.tag[0].name);
        // console.log(eachTag.tagName);
        if(perfectTags.includes(eachTag.tagName)){
            eachTag.isKeep = true;
        }
        return eachTag;
    });
}