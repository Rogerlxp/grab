const fs = require('fs-extra');
const path = require('path');
module.exports = {
    cache: {},
    requireFile(filePath){
        if(fs.existsSync(filePath)){
            return require(filePath);
        }
    },
    getFromCache(filePath){
        if(this.cache[filePath] !== undefined){
            return this.cache[filePath];
        }
    },
    getAndCache(filePath){
        const fileCache = this.getFromCache(filePath);
        if(fileCache){
            return fileCache;
        }
        this.cache[filePath] = this.requireFile(filePath);
        return this.cache[filePath];

    },
    tableDefinitionCache: {},
    getTableDefinition(tableDefName){
        const cwd = global.setting.cwd;
        const dbPath = path.join(cwd, 'common', 'db', tableDefName + '.js');
        if(this.tableDefinitionCache[dbPath]){
            return this.tableDefinitionCache[dbPath];
        }
        const dbFields = this.requireFile(dbPath);
        if(dbFields){
            for(const field of dbFields){
                if(field.isPrimaryKey){
                    if(field.tableDefName){
                        throw new Error('Can not use this name in field definition: tableDefName.');
                    }
                    field.tableDefName = tableDefName;
                    break;
                }
            }
            this.tableDefinitionCache[dbPath] = dbFields;
            return this.tableDefinitionCache[dbPath];
        }
        console.warn('No table fields defined: ' + tableDefName);
        return [];
    }
}