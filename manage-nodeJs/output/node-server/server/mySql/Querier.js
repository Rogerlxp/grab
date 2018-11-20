const path = require('path');
const fs = require('fs-extra');
const logger = require('../lib/logger');
const DB_STRUCTURE = require('./DB_STRUCTURE');
const CONSTANTS = require('../../common/CONSTANTS');
const tableHelper = require('./helper');
const connection = require('./connection');
const resultCache = {
    count: []
};
class Querier {
    constructor(){
        this.dbs = DB_STRUCTURE;
        this.dbName = CONSTANTS.CONTENT_DB_NAME;
        this.selectFields = [];
        this.joins = [];
        this.filters = [];
        this.fields = [];
        this.sortOrderValue = '';
        this.sortByField = '';
        this.actionType = 'list';
        this.limitCount;
        this.startPosition;
        this.isNeedTotal = false;
        this.isNeedDistinct;
        this.groupFields;
        this.primaryField;
        this.db = this.dbs.find(db=>db.name === this.dbName);
    }
    use(dbName){
        this.dbName = dbName || CONSTANTS.CONTENT_DB_NAME;
        this.db = this.dbs.find(db=>db.name === dbName);
        if(!this.db){
            const errMsg = 'Can not find this database in constants definition.';
            throw new Error(errMsg);
        }
        return this;
    }
    needTotal(){
        this.isNeedTotal = true;
    }
    select(fields){
        this.selectFields = fields;
        return this;
    }
    table(tableDefName){
        this.filterDef = [];
        this.fields = tableHelper.getTableDefinition(tableDefName);
        this.primaryField = this.fields.find(each=>each.isPrimaryKey);
        if(this.primaryField && this.primaryField.tableName){
            this.tableName = this.primaryField.tableName;
        }else{
            this.tableName = tableDefName;
        }
        const filterDefName = this.primaryField.filterDefName || this.primaryField.tableDefName || this.tableName;
        const cwd = global.setting.cwd;
        this.filterDef = tableHelper.getAndCache(path.join(cwd, 'common', 'filter', filterDefName + '.js'));
        return this;
    }
    addKeyValue(keyName, keyValue){
        if(!keyValue){
            const errMsg = `please provide '${keyName}' argument`;
            throw new Error(errMsg);
        }else if(typeof keyValue !== 'object'){
            const errMsg = `'${keyName}' argument must be an Array of Object.`;
            console.log(keyValue);
            console.log(keyName);
            throw new Error(errMsg);
        }
        if(!this[keyName]){
            this[keyName] = [];
        }
        const validate = function(eachValue){
            const keys = Object.keys(eachValue);
            if(keys.length === 0){
                const errMsg = `Please do not give me an empty '${keyName}' object, it mean nothing.`;
                throw new Error(errMsg);
            }else if(keys.length === 1){
                const key = keys[0];
                return {
                    value: eachValue[key],
                    key
                };
            }else{
                if(eachValue.key === undefined || eachValue.value === undefined){
                    const errMsg = `'${keyName}' should look like this: {key: 'keyName', value: xxx}`;
                    console.log(keyValue);
                    console.log(keyName);
                    throw new Error(errMsg);
                }
                return eachValue;
            }
        }
        if(Array.isArray(keyValue)){
            this[keyName] = this[keyName].concat(keyValue.map(eachValue=>validate(eachValue)));
        }else if(typeof keyValue === 'object' && keyValue.key !== undefined && keyValue.value !== undefined){
            this[keyName].push(validate(keyValue));
        }else{
            this[keyName] = this[keyName].concat(Object.keys(keyValue).map(key=>{
                return validate({key, value: keyValue[key]});
            }));
        }
        return this;
    }
    joinTable(joinsDef){
        this.joins = this.joins.concat(joinsDef);
        // if(!joinsDef){
        //     const errMsg = 'Can not join empty table.';
        //     throw new Error(errMsg);
        // }
        // const dealer = (joinDef)=>{
        //     if(!joinDef.joinKey){
        //         const errMsg = 'You must provide a joinKeyName when join action.';
        //         throw new Error(errMsg);
        //     }
        //     if(!joinDef.joinTable){
        //         const errMsg = 'need joinTable value';
        //         throw new Error(errMsg);
        //     }
        //     if(!joinDef.joinType){
        //         throw Error('Need joinType.');
        //     }else{
        //         if(joinDef.joinType.toUpperCase() === 'INNER'){
        //             joinDef.joinType = 'INNER JOIN';
        //         }else{
        //             throw new Error('dose not recognize this join type: ' + joinDef.joinType);
        //         }
        //     }
        //     if(!joinDef.keyName){
        //         throw new Error('Need keyName');
        //     }
        //     if(!joinDef.tableName){
        //         const errMsg = 'I can join not table without table name, obviously.';
        //         throw new Error(errMsg);
        //     }
        //     return joinDef;
        // }
        // if(Array.isArray(joinsDef)){
        //     const joins = joinsDef.map(joinDef=>dealer(joinDef)).filter(join=>!!join);
        //     if(joins.length){
        //         this.joins = this.joins.concat(joins);
        //     }
        // }else if(typeof joinsDef === 'object'){
        //     const join = dealer(joinsDef);
        //     if(join){
        //         this.joins.push(join);
        //     }
        // }else{
        //     const errMsg = 'Join table must be a specific structure Array or Object.';
        //     throw new Error(errMsg);
        // }
        return this;
    }
    needDistinct(isNeed = true){
        this.isNeedDistinct = isNeed;
    }
    filter(filters){
        this.filters = filters;
        return this;
    }
    sortBy(sortBy){
        this.sortByField = sortBy;
        return this;
    }
    sortOrder(sortOrder){
        this.sortOrderValue = sortOrder;
        return this;
    }
    offset(position){
        if(!position){
            position = 0;
        }
        if(typeof position !== 'number'){
            const errMsg = `start position must be a number type value.`;
            throw new Error(errMsg);
        }
        this.startPosition = position;
        return this;
    }
    limit(count){
        if(typeof count !== 'number'){
            const errMsg = 'limit function only accept number type value.';
            throw new Error(errMsg);
        }
        this.limitCount = count;
        return this;
    }
    type(type){
        this.actionType = type;
        return this;
    }
    group(groupFields){
        this.groupFields = groupFields;
    }
    query(query){
        return new Promise(resolve=>{
            connection.query(query, function(err, result, fields){
                if(err){
                    const errMsg = `Execute sql query error.`;
                    logger.error(errMsg);
                    logger.error(query);
                    logger.error(err.toString());
                    throw new Error(errMsg);
                }
                // console.log(result);
                resolve(result);
            });
        });
    }
    makeEachSelect({dbName, tableName}){
        const db = dbName || this.dbName;
        const table = tableName || this.tableName;
    }
    makeSelectStr(){
        const v = this.v;
        let fieldStr = this.selectFields.map(field=>{
            let str = `${this.tableName}.${field.keyName}`;
            if(field.tableName){
                str = `${field.tableName}.${field.keyName}`;
            }
            if(field.isSum){
                str = `SUM(${str}) AS ${field.keyName}`;
            }
            return str;
        }).join(',');
        let distinctStr = this.isNeedDistinct ? 'DISTINCT' : '';
        if(!fieldStr){
            fieldStr = '*';
        }
        return `SELECT ${distinctStr} ${fieldStr} FROM ${this.tableName}`;
    }
    // for stringify value to sql stander
    v(value){
        if(value === null){
            return 'NULL';
        }else if(value === undefined){
            return 'NULL';
        }else if(typeof value === 'number'){
            return value + '';
        }else if(typeof value === 'string'){
            return `'${value}'`;
        }else{
            const errMsg = 'This type of value is not acceptable: ' + typeof value;
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }
    makeFilterCondition(filter){
        // console.log('filter: ', filter);
        if([null, '', undefined].includes(filter.value)){
            return;
        }
        let value = this.v(filter.value);
        let mark = '=';
        if(filter.searchMode){
            // search mode is lower case
            filter.searchMode = filter.searchMode.toLowerCase();
        }else if(typeof filter.value === 'string' && /\%/.test(filter.value)){
            filter.searchMode = 'like';
        }
        if(filter.searchMode === 'like'){
            mark = 'LIKE';
        }else if(filter.searchMode === 'bitwise'){
            mark = '>>';
            value = value + '&1=1';
        }else if(filter.searchMode === 'in'){
            mark = 'IN';
            value = `(${value.replace(/'/g, '')})`;
        }
        if(/\!\=/.test(value)){
            mark = '!=';
            value = value.replace('!=', '');
        }
        let key = filter.keyName;
        if(filter.tableName){
            key = `${filter.tableName}.${filter.keyName}`;
        }else{
            key = `${this.tableName}.${filter.keyName}`;
        }
        if(filter.isReverse){
            return `${value} ${mark} ${key}`;
        }else{
            return `${key} ${mark} ${value}`;
        }
    }
    makeFilterStr(){
        const v = this.v;
        if(this.filters.length){
            const filterArr = this.filters.map(filter=>{
                const condition = this.makeFilterCondition(filter);
                if(!condition){
                    return;
                }
                return condition;
            }).filter(filter => !!filter);
            if(filterArr.length){
                return `WHERE ${filterArr.join(' AND ')}`
            }else{
                return '';
            }
        }else{
            return '';
        }
    }
    makeLimitStr(){
        let limitStr = '';
        if(this.limitCount){
            limitStr = `LIMIT ${this.limitCount}`;
        }
        return limitStr;
    }
    makeStartStr(){
        let offsetStr = '';
        if(this.startPosition){
            offsetStr = `OFFSET ${this.startPosition}`;
        }
        return offsetStr;
    }
    makeSortStr(){
        let orderBy = '';
        if(this.sortByField){
            if(this.db.isSharding){
                orderBy += `ORDER BY U.${this.sortByField}`;
            }else{
                orderBy += `ORDER BY ${this.sortByField}`;
            }
            if(this.sortOrderValue){
                orderBy += ` ${this.sortOrderValue}`;
            }
        }
        return orderBy;
    }
    makeJoinStr(){
        let joinStr = '';
        this.joins.forEach(joinDef => {
            // console.log('join def: ', joinDef);
            if(joinDef.table){
                joinStr += ` ${joinDef.type} ${joinDef.table} ON ${joinDef.on}`;
            }else{
                joinStr += ` AND ${joinDef.on}`;
            }
        });
        // console.log('join string: ', joinStr);
        return joinStr;
    }
    makeGroupStr(){
        let str = ``;
        if(this.groupFields){
            str = `GROUP BY ${this.tableName}.${this.groupFields}`;
        }
        return str;
    }
    removeExtraSpace(queryStr){
        return queryStr.replace(/\s+/g, ' ').replace(/\s*;/, ';');
    }
    async remove(){
        console.warn(`this function has not beed full tested, don't use it until you sure security.` );
        let filterStr = this.makeFilterStr();
        if(!filterStr){
            throw new Error('No condition delete is not allowed.');
        }
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE ${filterStr};`);

    }
    isNeedCache(queryStr){
        if(/ join /i.test(queryStr)){
            return true;
        }
        return false;
    }
    async exec(){
        if(!this.tableName){
            const errMsg = `You haven't select table yet.`;
            throw new Error(errMsg);
        }
        // if(this.dbName){
        //     await this.query(`USE ${this.db.name};`);
        // }
        if(this.actionType === 'list'){
            let queryStr = '';
            // select
            let selectStr = this.makeSelectStr();
            // join
            let joinStr = this.makeJoinStr();
            // start
            let startStr = this.makeStartStr();
            // limit
            let limitStr = this.makeLimitStr();
            // filter
            let filterStr = this.makeFilterStr();
            // console.log('filter string: ' + filterStr);
            // sort
            let sortStr = this.makeSortStr();
            // group
            let groupStr = this.makeGroupStr();
            // result
            const res = {};
            const listQuery = this.removeExtraSpace(`${selectStr} ${joinStr} ${filterStr} ${sortStr} ${groupStr} ${limitStr} ${startStr};`);
            console.log(listQuery);
            res.list = await this.query(listQuery);
            if(this.isNeedTotal){
                let countQuery = ``;
                let countStr = 'COUNT(*)';
                if(this.isNeedDistinct){
                    const distinctField = this.fields.find(field=>field.isNeedDistinct === true);
                    if(distinctField){
                        countStr = `COUNT(DISTINCT ${this.tableName}.${distinctField.keyName})`;
                    }
                }
                countQuery = `SELECT ${countStr} AS total FROM ${this.tableName} ${joinStr}`;
                if(this.filters.length){
                    const arr = this.filters.map(filter=>this.makeFilterCondition(filter)).filter(filter=>!!filter);
                    if(arr.length){
                        countQuery += (` WHERE ` + arr.join(' AND '));
                    }
                }
                if(groupStr){
                    countQuery += ' ' + groupStr;
                }
                countQuery += ';';
                countQuery = this.removeExtraSpace(countQuery);
                console.log(countQuery);
                const cache = resultCache.count.find(each=>each.queryStr === countQuery);
                if(cache){
                    if(Date.now() - cache.updateTime < cache.dueTime ){
                        console.log('return from cache: ', cache);
                        res.total = cache.result;
                        // async update cache result
                        if(Date.now() - cache.updateTime > 300000){
                            console.log('update cache result.');
                            setTimeout(async () => {
                                let total = 0;
                                const totalList = await this.query(countQuery);
                                if(groupStr){
                                    total = totalList.length;
                                }else{
                                    totalList.forEach((item)=>{
                                        total += item.total;
                                    });
                                }
                                const dueTime = total/10000 * 60000;
                                cache.result = total;
                                cache.updateTime = Date.now();
                                cache.dueTime = dueTime;
                            }, 10);
                        }
                    }
                }
                if(!res.total){
                    // console.log('query count from table.');
                    const totalList = await this.query(countQuery);
                    // const totalList = await this.query(`SELECT FOUND_ROWS() as total;`);
                    // console.log(totalList);
                    if(groupStr){
                        res.total = totalList.length;
                    }else{
                        res.total = 0;
                        totalList.forEach((item)=>{
                            res.total += item.total;
                        });
                    }
                    // cache some query
                    const dueTime = res.total/10000 * 60000;
                    const foundCache = resultCache.count.find(each=>each.queryStr === countQuery);
                    if(foundCache){
                        foundCache.result = res.total;
                        foundCache.updateTime = Date.now();
                        foundCache.dueTime = dueTime;
                    }else{
                        resultCache.count.push({
                            queryStr: countQuery,
                            result: res.total,
                            updateTime: Date.now(),
                            dueTime
                        });
                    }
                }
            }
            return res;
        }
    }
}
module.exports = Querier;