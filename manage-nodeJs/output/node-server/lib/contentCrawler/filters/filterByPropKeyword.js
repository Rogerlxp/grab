module.exports = function({tagList, perfectTags, extraProp, searchKeywords, bigChangeTags}){
    let newTagList = [];
    for(let eachTag of tagList){
        let allMayTags = perfectTags ? perfectTags.concat(bigChangeTags) : bigChangeTags;
        eachTag.tagIndex = allMayTags.indexOf(eachTag.tagName);
        let searchProps = ['class'];
        eachTag.propVal = [];
        if(Array.isArray(extraProp)){
            searchProps = searchProps.concat(extraProp);
        }
        searchProps.forEach(eachProp=>{
            let propVal = eachTag.tag.attr(eachProp);
            propVal && (eachTag.propVal = eachTag.propVal.concat(propVal.split(' ')));
        });
        block1: {
            for(let propVal of eachTag.propVal){
                if(searchKeywords.includes(propVal)){
                    // perfect match prop
                    eachTag.perfectPropMatch = true;
                    newTagList.push(eachTag);
                    break block1;
                }
            }
        }
        if(eachTag.perfectPropMatch === true){
            continue;
        }
        let propRegex = new RegExp(searchKeywords.join('|'), 'i');
        let isMatchKeyword = propRegex.test(eachTag.propVal.join(''));
        if(isMatchKeyword === true || eachTag.isKeep === true){
            eachTag.tagIndex = bigChangeTags.indexOf(eachTag.tagName);
            newTagList.push(eachTag);
        }
    }
    let perfectTagList = newTagList.filter((eachTag)=>{
        return eachTag.perfectPropMatch === true;
    });
    if(perfectTagList.length){
        return perfectTagList;
    }
    return newTagList;
}