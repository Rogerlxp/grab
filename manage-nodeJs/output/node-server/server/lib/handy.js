module.exports = {
    dbDate(date){
        const parse = function(num){
            if(num < 10){
                return '0' + num;
            }else{
                return num + '';
            }
        }
        let year = date.getFullYear() + '';
        let month = parse(date.getMonth() + 1);
        let day = parse(date.getDate());
        let hour = parse(date.getHours());
        let minute = parse(date.getMinutes());
        let second = parse(date.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    now: function(){
        return this.dbDate(new Date());
    }
}