const express = require('express');
const router = express.Router();
const sql = require('../lib/mysql');
const logger = require('../lib/logger');
router.post('/list', (req, res)=>{
    
});
router.get('/redirect-cp-content', async function(req, res){
    const id = req.query.id;
    if(!id){
        console.error('id argument is required.');
        return;
    }
    const links = await sql.query(`SELECT FLINK FROM MEIZU_READER.T_ARTICLE WHERE FID=${id};`);
    if(links.length){
        const link = links[0];
        if(link.FLINK){
            console.log('redirect to:' + link.FLINK);
            res.redirect(link.FLINK);
            return;
        }
    }
    console.warn('Can not find this content: FID=' + id);
    res.json({
        code: 501,
        message: '没找到该文章',
        value: ''
    });
});
module.exports = router;