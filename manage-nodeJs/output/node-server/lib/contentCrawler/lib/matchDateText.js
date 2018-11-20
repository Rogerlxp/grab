module.exports = function(text){
    text = text.trim();
    let match = text.match(/^[\D]{0,4}(\d{4})[\D](\d{1,2})[\D](\d{1,2})[\D]+(\d{1,2})[\D](\d{1,2})[\D]?(\d{1,2})?[\D]*/);
    if(match){
        let year = +match[1];
        let month = (+match[2] -1);
        let day = +match[3];
        let hour = +match[4] || 0;
        let minute = +match[5] || 0;
        let second = +match[6] || 0;
        let date = new Date(year, month, day, hour, minute, second);
        return date.toISOString();
    }
    match = text.match(/^(\d{1,2})[\D](\d{1,2})[\D](\d{1,2})[\D](\d{1,2})/);
    if(match){
        let now = new Date();
        let year = now.getFullYear();
        let month = (+match[1] - 1);
        let day = +match[2];
        let hour = +match[3];
        let minute = +match[4];
        let date = new Date(year, month, day, hour, minute);
        return date.toISOString();
    }
    match = text.match(/(\d*)年(\d*)月(\d*)日/);
    if(match){
        let year = +match[1];
        let month = (+match[2] - 1);
        let day = +match[3];
        let date = new Date(year, month, day);
        return date.toISOString();
    }
}