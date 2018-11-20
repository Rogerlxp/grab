const metaFinder = require('../finder/metaFinder');
const regexpFinder = require('../finder/regexpFinder');

module.exports = function({$, field}){
    let result = metaFinder({$, metaName: field});
    if(!result){
        if(field === 'source'){
            result = regexpFinder({
                $,
                regexp: /来源[：|\s][\s]?(.+)/
            });
        }else if(field === 'author'){
            result = regexpFinder({
                $,
                regexp: /作者[：|\s][\s]?(.+)/
            });
        }
    }
    return result;
}