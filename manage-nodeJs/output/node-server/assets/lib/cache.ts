const shortid = require('shortid');
const cache:any = {};
cache.files = {
    list: [],
    get(id){
        return this.list.find(each=>each.id === id);
    },
    add(file){
        const id = shortid.generate();
        this.list.push({
            id,
            file
        });
        return id; 
    },
    remove(id){
        this.list = this.list.filter(each=>each.id !== id);
        return this.list;
    }
};
export default cache;