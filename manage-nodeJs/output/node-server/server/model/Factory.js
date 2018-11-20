const path = require('path');
const fs = require('fs-extra');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');

module.exports = function({name}){

    let dbPath = path.join(global.setting.cwd, 'db', name + '.json');
    
    fs.ensureFileSync(dbPath);

    const dbAdapter = new FileSync(dbPath);
    this.db = lowdb(dbAdapter);
    this.db.defaults({
        [name]: []
    }).write();
    this.pushUnique = (item)=>{
        let items = this.db.get(name);
        let foundItem = items.find({id:item.id}).value();
        if(foundItem){
            return;
        }
        this.push(item);
    };
    this.push = (item)=>{
        if(!item.id){
            item.id = shortid.generate();
        }
        this.db.get(name).push(item).write();
    };
    this.getList = ()=> {
        return this.db.get(name).value();
    };
    this.getOneById = (id)=>{
        return this.db.get(name).find({id}).value();
    };
    this.getListInstance = ()=>{
        return this.db.get(name);
    };
    this.save = (item)=>{
        if(item.id){
            let found = this.db.get(name).find({id: item.id});
            if(!found.value()){
                const errorMsg = 'Can not edit a not exist item.';
                console.error(errorMsg);
                return errorMsg;
            }
            delete item.id;
            found.assign(item).write();
            return;
        }
        this.push(item);
    };
    this.removeOne = (id)=>{
        this.db.get(name).remove({id}).write();
    };
}