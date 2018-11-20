// yeah,,, I make a stupid function.
const maker = function({
    dbName,
    tableName,
    eachLength,
    from,
    filter,
    sort,
    type}){
    if(!type){
        throw new Error('You must supply a query type.');
    }
    let queryText;
    // type
    if(type === 'list'){
        queryText = `SELECT * FROM ${tableName}`;

    }else if(type === 'count'){
        queryText = `SELECT COUNT(*) FROM ${tableName}`;
    }
    // where
    if(filter){
        const filtersDef = require('../../common/filter/' + tableName + '.js');
        const fields = require('../../common/db/' + tableName + '.js');
        let where = '';
        let keys = Object.keys(filter);
        let query = [];
        keys.forEach(key=>{
            let value = filter[key];
            let field = fields.find(item=>item.keyName === key);
            let filterDef = filtersDef.find(item=>item.keyName === key);
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
        queryText += where;
    }
    // order
    if(sort && sort.by){
        queryText += ` ORDER BY ${sort.by} ${sort.order}`
    }
    // limit
    if(eachLength !== undefined){
        if(!from){
            from = 0;
        }
        queryText += ` LIMIT ${from},${eachLength}`;
    }
    // end
    if(queryText){
        // add end marker.
        queryText += ';';
    }
    return queryText;
}
module.exports = maker;
