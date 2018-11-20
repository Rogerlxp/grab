module.exports = function({tagList}){
    if(tagList.length > 2){
        let allPropVal = [];
        tagList.forEach(each=>{
            allPropVal = allPropVal.concat(each.propVal);
        });
        tagList = tagList.filter(each=>{
            let recursiveFind = function(val, count, lastIndex = 0){
                let index = allPropVal.indexOf(val, lastIndex);
                if(index !== -1){
                    count++;
                    return recursiveFind(val, count, index+1);
                }
                return count;
            }
            for(let val of each.propVal){
                let result = recursiveFind(val, 0, 0);
                if(result > 1){
                    return false;
                }
            }
            return true;
        });
        tagList.sort((a, b)=>{
            return a.tagIndex - b.tagIndex;
        });
    }
    return tagList;
}