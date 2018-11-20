module.exports = function(obj, reg){
    let keys = Object.keys(obj);
    for(let key of keys){
        if(reg.test(key) === true){
            let val = obj[key];
            if(val === 'true'){
                return true;
            }
            if(val === 'false'){
                return false;
            }
            return val;
        }
    }
}