const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const CSVStringify = require('csv-stringify')
const checkLogin = require('../middleware/checkLogin');
const checkTablePermission = require('../middleware/checkTablePermission');
const connection = require('../mySql/connection');
const digestFields = require('../../common/lib/digestFields');
const Table = require('../mySql/Table');
const Querier = require('../mySql/Querier');
const sql = require('../lib/mysql');
const multer = require('multer');
const handy = require('../lib/handy');

// for upload file
const destination = path.join(global.setting.cwd, 'temp', 'file');
const storage = multer.diskStorage({
    destination,
    filename: function (req, file, cb) {
        fs.ensureDirSync(destination);
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage });

// query one row from table
router.get('/one', checkLogin, checkTablePermission, async function(req, res){
    const args = req.query;
    const querier = new Querier();
    querier.table(args.tableName);
    querier.filter([{
        keyName: querier.primaryField.keyName,
        value: args.keyValue
    }]);
    querier.limit(1);
    const queryRes = await querier.exec();
    let result;
    if(queryRes.list && queryRes.list[0]){
        result = queryRes.list[0];
    }else{
        result = {};
    }
    res.json({
        code: 200,
        message: 'lovely day.',
        value: result
    });
});

// delete one row
router.post('/deleteOne', checkLogin, checkTablePermission, async function(req, res){
    // const dbName = req.body.dbName || CONSTANTS.CONTENT_DB_NAME;
    const tableName = req.body.tableName;
    const keyValue = req.body.keyValue;
    const table = new Table(tableName);
    const deleteRes = await table.deleteOne(keyValue);
    if(deleteRes){
        res.json({
            code: 200,
            message: 'success',
            value: deleteRes
        });
    }else{
        res.json({
            code: 501,
            message: 'delete failed',
            value: deleteRes
        });
    }
});
router.post('/duplicateOne', checkLogin, checkTablePermission, async function(req, res){
    const tableName = req.body.tableName;
    const keyValue = req.body.keyValue;
    const table = new Table(tableName);
    const result = await table.duplicateOne({keyValue});
    if(result){
        res.json({
            code: 200,
            message: 'success',
            value: result
        });
    }else{
        res.json({
            code: 501,
            message: 'delete failed',
            value: result
        });
    }
});
router.get('/distinct', checkLogin, checkTablePermission, async function(req, res){
    let args = {};
    args.keyName = req.query.keyName;
    args.tableName = req.query.tableName;
    let table = new Table(args.tableName);
    let queryRes = await table.distinct(args);
    res.json({
        code: 200,
        message: 'success',
        value: queryRes
    });
});
router.get('/getByKeyName', checkLogin, checkTablePermission, async function(req, res){
    let args = {};
    args.dbName = req.query.dbName;
    args.keyName = req.query.keyName;
    args.tableName = req.query.tableName;
    args.keyValue = req.query.keyValue;
    let table = new Table(args.tableName);
    let queryRes = await table.getByKeyName(args);
    res.json({
        code: 200,
        message: 'success',
        value: queryRes
    });
});
router.get('/list', checkLogin, checkTablePermission, async function(req, res){
    let args = {};
    args.dbName = req.query.dbName;
    args.tableName = req.query.tableName;
    if(req.query.from){
        args.from = +req.query.from;
    }
    if(req.query.eachLength){
        args.eachLength = +req.query.eachLength;
    }
    if(req.query.filter){
        args.filter = JSON.parse(decodeURIComponent(req.query.filter));
    }
    if(req.query.sortBy){
        args.sort = {};
        args.sort.by = req.query.sortBy;
        args.sort.order = req.query.sortOrder || 'ASC';
    }
    const table = new Table(args.tableName);
    const contents = await table.getList(args);
    res.json({
        code: 200,
        message: 'success',
        value: {
            list:contents.list,
            count: contents.count
        }
    });
});
router.post('/upsert', checkLogin, checkTablePermission, async (req, res)=>{
    const tableName = req.body.tableName;
    const payloadFields = req.body.fields;
    const table = new Table(tableName);
    const headerCookie = req.headers.cookie;
    if(!tableName){
        res.json({
            code: 501,
            message: 'Please post with complete arguments',
            value: ''
        });
        return;
    }
    let keys = Object.keys(payloadFields);
    // if(keys.length === 0){
    //     res.json({
    //         code: 502,
    //         message: 'nothing update.',
    //         value: ''
    //     });
    //     return;
    // }
    const fieldsDesc = require('../../common/db/' + tableName);
    const primaryField = fieldsDesc.find(field=>field.isPrimaryKey);
    const result = await digestFields(fieldsDesc, payloadFields);
    const headers = {cookie: headerCookie};
    const sendUpdateEvent = function({updateUrl, query}){
        let queryArr = [];
        Object.keys(query).forEach(key=>{
            queryArr.push(key + '=' + encodeURIComponent(query[key]));
        });
        const realUpdateUrl = updateUrl+'?'+queryArr.join('&');
        console.log('update url: ', realUpdateUrl);
        request.get({url: realUpdateUrl, headers}, function(sendEventErr, rawResponse, body){
            let sendEventRes;
            try{
                sendEventRes = JSON.parse(body);
            }catch(error){
                console.error(error);
            }
            if(!sendEventRes){
                res.json({
                    code: 503,
                    message: 'send update event error.',
                    value: body
                });
                return;
            }
            if(+sendEventRes.code === 200){
                res.json({
                    code: 200,
                    value: '',
                    message: 'success sending update event.'
                });
            }else{
                console.error('send author update event error.');
                console.error(sendEventRes);
                res.json(sendEventRes);
            }
        });
    }
    if(result.isValid){
        // const keyValue = result.fields[primaryField.keyName];
        const sqlRes = await table.upsert(result.fields);
        const query = {};
        let isValidQuery = false;
        if(primaryField.echoServer){
            primaryField.echoServer.args.forEach(arg=>{
                const keyName = arg.keyName;
                const value = result.fields[keyName];
                if(value){
                    isValidQuery = true;
                }
                query[arg.argName] = value;
            });
        }
        if(isValidQuery){
            sendUpdateEvent({
                updateUrl: primaryField.echoServer.url,
                query
            });
            return;
        }
        res.json({
            code: 200,
            value: '',
            message: 'success'
        });
    }else{
        res.json({
            code: 500,
            message: result.message,
            value: ''
        });
    }
});
// router.post('/multi-upsert', checkLogin, checkTablePermission, function(req, res){
//     const orders = req.body.list;
//     const promises = orders.map(order=>{
        
//     });
//     console.log(req.body);
// });
router.post('/remove', checkLogin, checkTablePermission, async function(req, res){
    const args = req.body;
    const whereStr = Object.keys(req.body.fields).map(key=>{
        let value = req.body.fields[key];
        if(typeof value === 'string'){
            value = `'${value}'`;
        }
        return `${key} = ${value}`
    }).join(' AND ');
    if(!whereStr){
        throw new Error('no condition is not allowed in deleting action.');
    }
    const queryStr = `DELETE FROM ${args.tableName} WHERE ${whereStr};`;
    console.log(queryStr);
    connection.query(queryStr, (err, result) => {
        if(err){
            console.error('删除数据失败');
            console.error(err);
            res.json({
                code: 501,
                message: '操作失败',
                value: ''
            });
        }
        if(result.affectedRows){
            res.json({
                code: 200,
                message: '删除成功',
                value: result.affectedRows
            });
        }else{
            console.error('删除记录失败');
            console.error(result);
            res.json({
                code: 500,
                message: '操作失败',
                value: args
            });
        }
    });
});
router.get('/export', async function(req, res){
    const args = req.query;
    const sqlRes = await sql.query(`SELECT * FROM MEIZU_CONTENTS.${args.tableName};`);
    const filePath = path.join(global.setting.cwd, 'temp', Date.now() + '.json');
    fs.writeFileSync(filePath, JSON.stringify(sqlRes), {
        encoding: 'utf-8'
    })
    // console.log('export crawl rule: ' + filePath);
    res.download(filePath, 'data.json', function(){
        fs.remove(filePath);
    });
});
router.post('/import', upload.single('data.json'), async function(req, res){
    const file = req.file;
    const tableName = req.body.tableName;
    const importRows = JSON.parse(fs.readFileSync(file.path, {encoding: 'utf-8'}));
    const currentRows = await sql.query(`SELECT * FROM MEIZU_CONTENTS.${tableName};`);
    const fieldsDef = require(`../../common/db/${tableName}.js`);
    const uniqueFields = fieldsDef.filter(field=>field.isImportUnique === true);
    if(uniqueFields.length === 0){
        res.json({
            code: 500,
            message: 'can not find unique field in your table definition file, so I can not determine make a update or insert action.',
            value: ''
        });
        return;
    }
    let newCount = 0;
    let editCount = 0;
    for(const importRow of importRows){
        const foundRule = currentRows.find(each=>{
            for(const uniqueField of uniqueFields){
                const keyName = uniqueField.keyName;
                if(each[keyName] !== importRow[keyName]){
                    return false;
                }
            }
            return true;
        });
        Object.keys(importRow).forEach(key=>{
            // delete uneditable field
            const field = fieldsDef.find(field=>field.keyName === key);
            if(field){
                if(field.type === 'update-time'){
                    importRow[key] = handy.now();
                }else if(field.uneditable || field.isAutoGen || field.type === 'create-time'){
                    delete importRow[key];
                }
            }
        });
        Object.keys(importRow).forEach(key=>{
            // transfer some types of value
            let val = importRow[key];
            if(val === null){
                importRow[key] = 'NULL';
            }else if(!val){
                importRow[key] = `''`;
            }else{
                val = val.toString().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                importRow[key] = `'${val}'`;
            }
        });
        // console.log(importRow);
        if(foundRule){
            // update exist row
            const fields = Object.keys(importRow).map(key=>{
                return `${key}=${importRow[key]}`;
            }).filter(each=>!!each);
            const wheres = [];
            for(const uniqueField of uniqueFields){
                wheres.push(`${uniqueField.keyName}=${importRow[uniqueField.keyName]}`);
            }
            const sqlStr = `UPDATE MEIZU_CONTENTS.${tableName} SET ${fields.join(',')} WHERE ${wheres.join(' AND ')};`;
            console.log('update: ', sqlStr);
            await sql.query(sqlStr);
            editCount++;
        }else{
            // add new row
            let fields = [];
            let values = [];
            Object.keys(importRow).map(key=>{
                fields.push(key);
                values.push(importRow[key]);
            });
            const sqlStr = `INSERT INTO MEIZU_CONTENTS.${tableName} (${fields.join(',')}) VALUES (${values.join(',')});`;
            console.log('new: ', sqlStr);
            await sql.query(sqlStr);
            newCount++;
        }
    }
    // console.log(crawlRules);
    res.json({
        code: 200,
        message: 'upload success.',
        value: {newCount, editCount}
    });
});
router.post('/query-one', checkLogin, checkTablePermission, async function(req, res){
    const args = req.body;
    const querier = new Querier();
    querier.table(args.tableName);
    if(args.selectFields){
        querier.select(args.selectFields);
    }
    if(args.filter){
        querier.filter(args.filter);
    }else if(args.fields){
        querier.filter(Object.keys(args.fields).map(key=>{
            const each = {keyName: key};
            each.value = args.fields[key];
            return each;
        }));
    }
    querier.limit(1);
    const queryRes = await querier.exec();
    let result;
    if(queryRes.list && queryRes.list[0]){
        result = queryRes.list[0];
    }else{
        result = {};
    }
    res.json({
        code: 200,
        message: 'lovely day.',
        value: result
    });
});
router.all('/query', checkLogin, checkTablePermission, async function(req, res){
    if(['GET', 'POST'].includes(req.method) === false){
        res.json({
            code: 500,
            message: 'this method is not acceptable.',
            value: req.method
        });
        return;
    }
    const args = req.method  === 'POST' ? req.body : req.query;
    const querier = new Querier();
    querier.table(args.tableName);
    // select
    querier.select(querier.fields.filter(field => {
        if(field.keyName === undefined){
            return false;
        }
        return true;
    }));
    if(querier.primaryField){
        // join
        if(querier.primaryField.join && querier.primaryField.join.length){
            querier.joinTable(querier.primaryField.join);
        }
        // distinct
        if(querier.primaryField.isNeedDistinct){
            querier.needDistinct();
        }
        // group
        if(querier.primaryField.group){
            querier.group(querier.primaryField.group);
        }
    }

    // filter
    if(args.filter){
        const filterDef = querier.filterDef;
        if(typeof args.filter === 'string'){
            args.filter = JSON.parse(decodeURIComponent(args.filter));
        }
        const keys = Object.keys(args.filter);
        const queryList = [];
        if(filterDef){
            for(const key of keys){
                const queryField = filterDef.find(field=>field.keyName === key);
                if(!queryField){
                    queryList.push({
                        keyName: key,
                        value: args.filter[key]
                    });
                    continue;
                }
                queryField.value = args.filter[key];
                queryList.push(queryField);
            }
        }else{
            for(const key of keys){
                queryList.push({
                    keyName: key,
                    value: args.filter[key]
                });
            }
        }
        querier.filter(queryList);
    }
    // sort
    if(args.sortBy){
        querier.sortBy(args.sortBy).sortOrder(args.sortOrder);
    }
    // limit
    const limit = (+args.limit) || (+args.pageSize) || 1000;
    const offset = (+args.offset) || 0;
    if(args.exposeType !== 'csv'){
        querier.offset(offset);
        querier.limit(limit);
    }
    querier.needTotal();
    // exec
    const queryRes = await querier.exec();
    if(args.exposeType === 'csv'){
        const columns = {};
        const formatters = {
            date: (value)=>moment(value).format('YYYY-MM-DD HH:mm:ss')
        };
        fieldsDef.forEach(field=>{
            if(field.keyName && field.name){
                columns[field.keyName] = field.name;
            }
        });
        const list = queryRes.list.map(row=>{
            const keys = Object.keys(row);
            for(const key of keys){
                const field = fieldsDef.find(field=>field.keyName === key);
                if(!field){
                    continue;
                }
                if(field.type === 'select'){
                    const selected = field.options.find(option=>option.value === row[key]);
                    row[key] = selected.name;
                }
            }
            return row;
        });
        CSVStringify(list, {
            header:true,
            columns,
            formatters
        }, function(err, output){
            if(err){
                throw err;
            }
            const csvPath = path.join(global.setting.cwd, 'server', 'temp', Date.now() + '.csv');
            fs.writeFileSync(csvPath, '\ufeff'+output, 'utf8');
            res.download(csvPath, Date.now() + '.csv', function(){
                fs.remove(csvPath);
            });
        });
    }else{
        res.json({
            code: 200,
            message: 'lovely day.',
            value: queryRes
        });
    }
});
router.post('/multi-save', async function(req, res){
    const tables = req.body.tables;
    for(const tableAction of tables){
        const table = new Table(tableAction.tableName);
        for(let row of tableAction.rows){
            const action = row._action;
            delete row._action;
            if(action === 'delete'){
                await table.deleteOne(row.FID);
            }else{
                await table.upsert(row);
            }
        }
    }
    res.json({
        code: 200,
        message: 'success',
        value: ''
    });
});
module.exports = router;
