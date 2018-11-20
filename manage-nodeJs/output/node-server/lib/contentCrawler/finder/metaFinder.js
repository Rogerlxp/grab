module.exports = function({$, metaName}){
    let sourceMeta = $('meta[name='+metaName+']');
    let text = sourceMeta.attr('content');
    if(text){
        return text;
    }
    return '';
}