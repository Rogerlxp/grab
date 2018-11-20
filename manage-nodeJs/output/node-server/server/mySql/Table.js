const logger = require('../lib/logger');
const handy = require('../lib/handy');
const connection = require('./connection');
const tableHelper = require('./helper');
class Table {
    constructor(tableDefName){
        if(!tableDefName){
            throw new Error('You must provide tableName.');
        }
        this.FIELD_DEF = tableHelper.getTableDefinition(tableDefName);
        this.fields = this.FIELD_DEF.filter(field=>!!field.keyName);
        this.primaryField = this.FIELD_DEF.find(field=>field.isPrimaryKey);
        this.tableName = this.primaryField.tableName || tableDefName;
    }
    query(query){
        return new Promise((resolve, reject)=>{
            try{
                console.log(query);
                connection.query(query, (err, res)=>{
                    if(err){
                        logger.error('exec sql query error: ');
                        logger.error(query);
                        logger.error(err);
                        reject(err);
                        throw err;
                    }
                    resolve(res);
                });
            }catch(error){
                logger.error('exec sql query error: ');
                logger.error(query);
            }
        });
    }
    async distinct({keyName}){
        let query = `SELECT * FROM ${this.tableName} GROUP BY ${keyName}`;
        return await this.query(query);
    }
    async getByKeyName({keyName, keyValue}){
        let query = `SELECT * FROM ${this.tableName} WHERE ${keyName}='${keyValue}';`;
        return await this.query(query);
    }
    async getList({from, eachLength, filter, sort}){
        console.warn('This code has beed deprecated. Please use querier instead.');
        if(!this.tableName){
            throw new Error(`'tableName' is required`);
        }
        if(!from && from !== 0){
            throw new Error(`'from' is required`);
        }
        if(!eachLength && eachLength !== 0){
            throw new Error(`'eachLength' is required`);
        }
        return await this.listTable(...arguments);
    }
    // this is only used for single db query not for sharding
    async listTable({from, eachLength, filter, sort}){
        let countQuery = `SELECT COUNT(*) FROM ${this.tableName}`;
        let listQuery = `SELECT * FROM ${this.tableName}`;
        if(filter){
            const filtersDef = require('../../common/filter/' + this.tableName + '.js');
            const fields = require('../../common/db/' + this.tableName + '.js');
            let where = '';
            let keys = Object.keys(filter);
            let query = [];
            keys.forEach(key=>{
                let value = filter[key];
                let field = fields.find(item=>item.keyName === key);
                let filterDef = filtersDef.find(item=>item.keyName === key);
                // join
                if(filterDef.join){
                    let joinStr = '';
                    filterDef.join.forEach(joinDef => {
                        let joinTypeStr = '';
                        if(joinDef.joinType === 'inner'){
                            joinTypeStr = 'INNER JOIN';
                        }else{
                            throw new Error('You have to define join type, like INNER JOIN etc.');
                        }
                        const onStr = `${joinDef.tableName}.${joinDef.keyName}=${joinDef.joinTable}.${joinDef.joinKey}`;
                        joinStr += ` ${joinTypeStr} ${joinDef.tableName} ON ${onStr}`;
                    });
                }
                let searchMode = filterDef.searchMode || '=';
                let valueType = field.valueType || 'string';
                if(valueType === 'string'){
                    if(searchMode.toUpperCase() === 'LIKE'){
                        value = "'%" + value + "%'";
                    }else{
                        value = "'" + value + "'";
                    }
                }else if(valueType === 'number'){
                    // nothing will do
                }
                if(searchMode.toUpperCase() === 'LIKE'){
                    searchMode = (' ' + searchMode + ' ');
                }
                query.push(`${key}${searchMode}${value}`);
            });
            if(query.length){
                where += ` WHERE ${query.join(' AND ')}`; 
            }
            listQuery += where;
            countQuery += where;
        }
        if(sort && sort.by){
            listQuery += ` ORDER BY ${sort.by} ${sort.order}`
        }
        countQuery += ';';
        listQuery += ` LIMIT ${from},${eachLength};`;
        let list = await this.query(listQuery);
        let countRes = await this.query(countQuery);
        let count = 0;
        if(Array.isArray(countRes) && countRes[0]){
            count = countRes[0]['COUNT(*)'];
        }
        return {list, count};
    }
    async getOne(keyValue){
        const keyName = this.primaryField.keyName;
        if(typeof keyValue === 'string'){
            keyValue = ("'" + keyValue + "'");
        }
        const queryText = `SELECT * FROM ${this.tableName} WHERE ${keyName}=${keyValue} LIMIT 1`;
        return await this.query(queryText);
    }
    normalizeValue(value){
        const valueType = typeof value;
        if(valueType === 'string'){
            return `'${value}'`;
        }else if(valueType === 'number'){
            return value;
        }
    }
    async deleteOne(keyValue){
        if(keyValue !== 0 && !keyValue){
            return false;
        }
        const keyName = this.primaryField.keyName;
        if(this.primaryField.relativeTables){
            const tables = this.primaryField.relativeTables;
            for(let table of tables){
                if(table.isSyncDelete){
                    if(!table.keyName){
                        const message = 'Can not delete relative table contents without keyName. Please finish relative table arguments.';
                        logger.error(message);
                        logger.error(this.primaryField);
                        throw new Error(message);
                    }
                    const value = this.normalizeValue(keyValue);
                    const query = `DELETE FROM ${table.tableName} WHERE ${table.keyName}=${value};`;
                    const deleteRes = await this.query(query);
                }
            }
        }
        let query = `DELETE FROM ${this.tableName} WHERE ${keyName}='${keyValue}' LIMIT 1;`;
        const deleteRes =  await this.query(query);
        if(deleteRes.affectedRows === 1){
            return true;
        }else{
            return false;
        }
    }
    async duplicateOne({keyValue}){
        if(!keyValue){
            throw new Error('Can not find row by empty primary key value.');
        }
        const FIELD_DEF = require('../../common/db/'+this.tableName);
        const primaryField = FIELD_DEF.find(field=>field.isPrimaryKey);
        if(!primaryField){
            throw new Error('Can not find primary key. Please define in common constant variables.');
        }
        const filter = function(each){
            return !each.isPrimaryKey;
        };
        const copyFields = FIELD_DEF.filter(filter).map(each=>{
                return each.keyName;
        }).join(',');
        const copyValues = FIELD_DEF.filter(filter).map(each=>{
                if(each.type === 'create-time'){
                    return 'NOW()';
                }
                return each.keyName;
        }).join(',');
        return this.query(`INSERT INTO ${this.tableName}(${copyFields})
        SELECT ${copyValues} FROM ${this.tableName} WHERE ${primaryField.keyName}=${keyValue}`);
    }
    async upsert(fields){
        // console.log(fields);
        // if fields not provide primary key, it will process add-a-new-row action.
        if(!fields){
            throw new Error('Can not update empty field.');
        }
        if(Array.isArray(fields)){
            throw new Error('"fields" can not be an array.');
        }
        if(typeof fields !== 'object'){
            throw new Error('"Fields" must be JSON object.');
        }
        // if(fields.length === 0){
        //     throw new Error('Must update at least one field.');
        // }
        const FIELD_DEF = require('../../common/db/'+this.tableName);
        // find update target
        const primaryField = FIELD_DEF.find(field=>field.isPrimaryKey);
        if(!primaryField){
            logger.error('Can not find primary key. Please define in common constant variables.');
            return;
        }
        const keyName = primaryField.keyName;
        const keyValue = fields[keyName];
        let isEditing = true;
        if(!keyValue){
            // console.log('add new');
            isEditing = false;
        }
        // fill update time
        const updateTimeFields = FIELD_DEF.filter(field => field.type === 'update-time');
        updateTimeFields.forEach(each=>!each.defaultValue && (fields[each.keyName] = handy.now()));
        if(!isEditing){
            FIELD_DEF.filter(field => field.type === 'create-time').forEach(each=>!each.defaultValue && (fields[each.keyName] = handy.now()));
        }
        let query = '';
        if(isEditing){
            query = `UPDATE ${this.tableName} SET`;
        }else{
            query = `INSERT INTO ${this.tableName}`;
        }
        let set = [];
        let addKeys = [];
        let addValues = [];
        FIELD_DEF.filter(field=>field.defaultValue !== undefined).forEach(each=>{
            // when add a new row, set default value.
            if(!isEditing && (fields[each.keyName] === undefined)){
                fields[each.keyName] = each.defaultValue;
            }
        });
        let keys = Object.keys(fields);
        keys.forEach(key=>{
            let value = fields[key];
            const valueType = typeof value;
            if(valueType === 'number'){
                value = value + '';
            }else if([null, undefined, 'NULL', 'null'].includes(value)){
                value = 'NULL';
            }else if(value === ''){
                value = "''";
            }else if(typeof value === 'string'){
                value = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                value = "'"+value+"'";
            }else if(typeof value === 'object'){
                value = `'${JSON.stringify(value)}'`;
                // throw new Error('Can not update Object or Array value.');
            }
            if(isEditing){
                set.push(`${key}=${value}`);
            }else{
                addKeys.push(key);
                addValues.push(value);
            }
        });
        if(isEditing){
            query += (' ' + set.join(','));
            query += ` WHERE ${keyName}='${keyValue}'`;
        }else{
            query += (` (${addKeys.join(',')})`);
            query += ` VALUES `;
            query += (`(${addValues.join(',')})`);
        }
        query += ';';
        // console.log(query);
        return await this.query(query);
    }
}
module.exports = Table;