module.exports = function({text, field}){
    if(!text){
        return '';
    }
    if(field === 'author'){
        let sourceReg = /来源[\s|:|：](.+)[\s]*/;
        let matchSource = text.match(sourceReg);
        if(matchSource){
            return matchSource[1];
        }
        return text;
    }
    text = text.trim();
    return text;
}