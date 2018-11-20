const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');
const handy = require('../lib/handy');
const checkLogin = require('../middleware/checkLogin');
const checkPermission = require('../middleware/checkTablePermission');
const Table = require('../mySql/Table');
const request = require('request');
const CONTENTS_DB = 'MEIZU_CONTENTS';
const FILTER_TABLE = 'T_CONTENT_DIS_FLITER';
const DISPLAY_TABLE = 'T_CONTENT_DIS_DISPLAY';
const freshCacheUrl = 'http://om.iflow.meizu.com/service/dis/refreshCache';
const addRecordUrl = 'http://om.iflow.meizu.com/service/dis/fliter/add';
// table init
const filterTable = new Table(FILTER_TABLE);
const displayTable = new Table(DISPLAY_TABLE);

const ensureAddContent = async function(req, res, next){
    const item = req.body.item;
    const cpEntityId = item.cpEntityId || '';
    const cpId = item.cpId || '';
    const disId = item.disId || '';
    const publishTime = item.publishDate || Date.now();
    if(!disId){
        const message = 'can not add or delete a filter content without distribution id.';
        res.json({
            code: 501,
            message,
            value: ''
        });
        logger.error(message);
        logger.error(item);
        return;
    }
    await filterTable.query(`USE ${CONTENTS_DB};`);
    const queryOne = `SELECT * FROM ${FILTER_TABLE} WHERE FCPID='${cpId}' AND FCP_ENTITYID='${cpEntityId}' AND FDISID='${item.disId}';`;
    console.log(queryOne);
    const oneRes = await filterTable.query(queryOne);
    if(oneRes.length > 0){
        console.log('database has this record. next ');
        next();
    }else{
        console.log('no record in table.');
        const param = {
            disId: item.disId,
            contentId: item.id + '',
            cpId: item.cpId,
            cpEntityId: item.cpEntityId,
            publishTime: item.publishDate,
            // if you don't satisfy with order value, you can add order field here
            // order: 1
        };
        console.log('param: ',param);
        const url = `${addRecordUrl}?param=${encodeURIComponent(JSON.stringify(param))}`;
        console.log('url: ', url);
        const headers = {cookie: req.headers.cookie};
        request.get({url, headers}, function(err, response, body){
            if(err){
                const message = `Request 'add filter content record' url failed.`;
                logger.error(message);
                res.json({
                    code: 502,
                    message,
                    value: ''
                });
                throw err;
            }
            let jsonRes;
            try{
                jsonRes = JSON.parse(body);
            }catch(err){
                logger.error(`parse response to json error at 'add filter content record.'`);
                res.json({
                    code: 502,
                    message: 'failed to add filter content record.',
                    value: body
                });
            }
            if(jsonRes && jsonRes.code === 200){
                console.log('add filter content record success.');
                next();
            }else{
                res.json(jsonRes);
            }
        });
    }
};
router.post('/freshCache', checkLogin, checkPermission, function(req, res){
    const disId = req.body.disId;
    const headers = {cookie: req.headers.cookie};
    const url = `${freshCacheUrl}?disId=${disId}`;
    request.get({url, headers}, function(err, response, body){
        if(err){
            throw err;
        }
        let data;
        try{
            data = JSON.parse(body);
        }catch(parseJsonError){
            res.json({
                code: 503,
                message: 'can not parse fresh redis response body.',
                value: body
            });
            throw new Error(parseJsonError);
        }
        res.json(data);
    });
});
router.post('/save', checkLogin, checkPermission, async function(req, res){
    const list = req.body.list;
    for(let item of list){
        for(let table of item.tables){
            const t = new Table(table.tableName);
            for(let row of table.rows){
                const action = row._action;
                delete row._action;
                if(action === 'delete'){
                    await t.deleteOne(row.FID);
                }else{
                    // console.log(table.tableName);
                    // console.log(row);
                    await t.upsert(row);
                }
            }
        }
    }
    res.json({
        code: 200,
        message: 'success',
        value: ''
    });
});
// router.post('/pullDown', checkLogin, checkPermission, ensureAddContent, async function(req, res){

// });
router.post('/pushUp', checkLogin, checkPermission, ensureAddContent, async function(req, res){
    const item = req.body.item;
    const cpEntityId = item.cpEntityId || '';
    const cpId = item.cpId || '';
    const disId = item.disId || '';
    // console.log('has record in table.');
    const findMaxOrder = `SELECT *, MAX(FORDER) AS MAX_ORDER FROM ${FILTER_TABLE} WHERE FDISID='${disId}';`;
    console.log(findMaxOrder);
    const maxRowRes = await filterTable.query(findMaxOrder);
    // console.log(maxRowRes);
    if(maxRowRes.length > 0){
        const maxRow = maxRowRes[0];
        if(maxRow.FCPID === cpId && maxRow.FCP_ENTITYID === cpEntityId){
            // it's the biggest
            console.log('this record is already at the max order.nothing to do.');
            res.json({
                code: 200,
                message: 'already at the top.',
                value: ''
            });
        }else{
            const currentMax = +(maxRow.MAX_ORDER) || 1;
            const max = currentMax + 1;
            const now = handy.now();
            const setMaxOrderQuery = `UPDATE ${FILTER_TABLE} SET FORDER='${max}', FUPDATE_TIME='${now}' WHERE FCPID='${cpId}' AND FCP_ENTITYID='${cpEntityId}' AND FDISID='${disId}';`;
            console.log(setMaxOrderQuery);
            const setMaxRes = await filterTable.query(setMaxOrderQuery);
            // console.log(setMaxRes);
            if(setMaxRes.affectedRows > 0){
                res.json({
                    code: 200,
                    message: 'set top success.',
                    value: ''
                });
            }else{
                res.json({
                    code: 501,
                    message: 'Can not set order in database, can not find this record.',
                    value: item
                });
            }
        }
    }
});
router.post('/block', checkLogin, checkPermission, ensureAddContent, async function(req, res){
    const item = req.body.item;
    const cpEntityId = item.cpEntityId || '';
    const cpId = item.cpId || '';
    const disId = item.disId;
    const now = handy.now();
    const setDeleteOrderQuery = `UPDATE ${FILTER_TABLE} SET FSTATUS='4', FUPDATE_TIME='${now}' WHERE FCPID='${cpId}' AND FCP_ENTITYID='${cpEntityId}' AND FDISID='${disId}';`;
    // console.log(setDeleteOrderQuery);
    const setDeleteRes = await filterTable.query(setDeleteOrderQuery);
    // console.log(setDeleteRes);
    if(setDeleteRes.affectedRows > 0){
        console.log('set delete status success in filter content.');
        res.json({
            code: 200,
            message: 'set delete success.',
            value: ''
        });
    }else{
        res.json({
            code: 501,
            message: 'Can not set delete status in database, can not find this record.',
            value: item
        });
    }
});
router.post('/getStyle', checkLogin, checkPermission, ensureAddContent, async function(req, res){
    await displayTable.query(`USE ${CONTENTS_DB};`);
    const item = req.body.item;
    const disId = item.disId || '';
    const position = item.position || '';
    const cpEntityId = item.cpEntityId || '';
    const cpId = item.cpId || '';
    // filter content
    const filterContentQuery = `SELECT * FROM ${FILTER_TABLE} WHERE FCPID='${cpId}' AND FCP_ENTITYID='${cpEntityId}';`;
    const filterContentRes = await filterTable.query(filterContentQuery);
    if(filterContentRes.length === 0){
        res.json({
            code: 501,
            message: 'Can not find this content in filter table.',
            value: filterContentRes
        });
        return;
    }
    const filterContent = filterContentRes[0];
    // display
    const displayQuery = `SELECT * FROM ${DISPLAY_TABLE} WHERE FDISID='${disId}' AND FPOSITION='${position}';`;
    const displayRes = await displayTable.query(displayQuery);
    const display = displayRes[0] || {};
    res.json({
        code: 200,
        message: 'success',
        value: {
            filterContent,
            display
        }
    });
});
router.post('/saveStyle', checkLogin, checkPermission, ensureAddContent, async function(req, res){
    await displayTable.query(`USE ${CONTENTS_DB};`);
    const item = req.body.item;
    const disId = item.disId || '';
    const position = item.position;
    const openType = item.openType;
    const cpEntityId = item.cpEntityId || '';
    const cpId = item.cpId || '';
    let displayStyle = item.displayStyle;
    // if(displayStyle === null){
    //     displayStyle = 'NULL';
    // }else{
    //     displayStyle = "`"+ displayStyle + "`";
    // }
    // display
    const displayQuery = `SELECT * FROM ${DISPLAY_TABLE} WHERE FDISID='${disId}' AND FPOSITION='${position}';`;
    const displayRes = await displayTable.query(displayQuery);
    console.log('find display res: ', displayRes);
    if(!displayRes || displayRes.length === 0){
        if(!disId){
            const message = 'Can not insert display record without distribution id.';
            res.json({
                code: 501,
                message,
                value: ''
            })
            logger.error(errMsg);
            return;
        }
        if(['', null, undefined].includes(position)){
            const message = 'Can not insert display record without position.';
            res.json({
                code: 502,
                message,
                value: ''
            });
            logger.error(message);
            logger.error('position type: ' + (typeof position));
            return;
        }
        // new one
        const insertKeys = `(FPOSITION, FDISID, FDISPLAY_STYLE, FUPDATE_TIME, FCREATE_TIME)`;
        const now = handy.now();
        const insertValues = `('${position}', '${disId}', '${displayStyle}', '${now}', '${now}')`;
        const insertDisplayQuery = `INSERT INTO ${DISPLAY_TABLE} ${insertKeys} VALUES ${insertValues};`
        console.log(insertDisplayQuery);
        const insertDisplayRes = await displayTable.query(insertDisplayQuery);
        console.log('insert display res: ', insertDisplayRes);
    }else{
        // update one
        const now = handy.now();
        const row = displayRes[0];
        const setQuery = `UPDATE ${DISPLAY_TABLE} SET FDISPLAY_STYLE=${displayStyle}, FUPDATE_TIME='${now}' WHERE FID='${row.FID}';`;
        console.log('set display: ' + setQuery);
        const setRes = await displayTable.query(setQuery);
        console.log('set res: ', setRes);
        if(setRes.affectedRows === 0){
            const message = 'update distribution display failed.';
            res.json({
                code: 503,
                message,
                value: ''
            });
            logger.error(message);
            logger.error(setQuery);
            logger.error(item);
        }
    }
    // filter content
    const now = handy.now();
    const setFilterQuery = `UPDATE ${FILTER_TABLE} SET FOPEN_TYPE='${openType}', FUPDATE_TIME='${now}' WHERE FCPID='${cpId}' AND FCP_ENTITYID='${cpEntityId}';`;
    console.log('set filter query: ' + setFilterQuery);
    const setFilterRes = await filterTable.query(setFilterQuery);
    console.log('set filter content res: ',setFilterRes);
    if(setFilterRes.affectedRows > 0){
        res.json({
            code: 200,
            message: 'Success',
            value: ''
        });
    }else{
        const message = 'set filter content failed.';
        logger.error(message)
        logger.error(setFilterQuery);
        logger.error(item);
        res.json({
            code: 501,
            message,
            value: ''
        });
    }
});
module.exports = router;