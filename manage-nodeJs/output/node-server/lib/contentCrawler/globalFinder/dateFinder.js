const matchDateText = require('../lib/matchDateText');
module.exports = function({allTags}){
    for(let eachTag of allTags){
        // console.log(eachTag.text);
        result = matchDateText(eachTag.text);
        if(result){
            return result;
        }
    }
}