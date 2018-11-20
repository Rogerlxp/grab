module.exports = function({$}){
    let result = [];
    $('meta').each(function(){
        if(result.length){
            return;
        }
        let $this = $(this);
        let name = $this.attr('name');
        if(/keywords?/i.test(name)){
            let val = $this.attr('content');
            if(val){
                result = val.split(/[,\s?|;]/);
                result = result.filter(eachResult => !!eachResult);
            }
        }
    });
    return result;
}