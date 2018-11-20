module.exports = function({$, regexp}){
    let matches = [];
    let allTags = $('*');
    allTags.each(function(){
        let $this = $(this);
        let text = $this.text();
        text = text.trim();
        if(!text){
            return;
        }
        let match = text.match(/来源[：|\s][\s]?(.+)/);
        if(match){
            // console.log('match: ', match);
            matches.push(match);
        }
    })
    if(matches.length === 1){
        let match = matches[0];
        return match[1];
    }
    return '';
}