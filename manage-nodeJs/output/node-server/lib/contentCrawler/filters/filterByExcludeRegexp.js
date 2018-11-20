module.exports = function({tagList, excludeRegexp}){
    if(excludeRegexp === undefined){
        return tagList;
    }
    return tagList.filter(each=>{
        if(each.text === undefined){
            each.text = each.tag.text();
        }
        if(excludeRegexp.test(each.text) === true){
            return false;
        }
        return true;
    });
}