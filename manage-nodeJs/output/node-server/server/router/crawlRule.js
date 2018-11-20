const express = require('express');
let router = express.Router();
let crawlRuleModal = require('../model/crawlRule');
router.post('/save', function(req, res){
    let rule = req.body.rule;
    let instance = crawlRuleModal.getListInstance();
    let found;
    if(rule.id){
        let ruleInDb = crawlRuleModal.getOneById(rule.id);
        if(rule.host !== ruleInDb.host){
            found = instance.find({host: rule.host}).value();
        }
        if(!found && rule.siteName !== ruleInDb.siteName){
            found = instance.find({siteName: rule.siteName}).value();
        }
    }else{
        found = instance.find({host: rule.host}).value();
        if(!found){
            found = instance.find({siteName: rule.siteName}).value();
        }
    }
    if(found){
        res.json({
            code: 500,
            message: 'The site already exist, check site name and site address.\n' +
            'If you want to edit it, please back to rule list.',
            value: ''
        });
        return;
    }
    let saveError = crawlRuleModal.save(rule);
    if(saveError){
        res.json({
            code: 500,
            message: saveError,
            value: ''
        });
        return;
    }
    res.json({
        code: 200,
        message: 'save rule success',
        value: ''
    });
});
router.get('/getList', (req, res)=>{
    let list = crawlRuleModal.getList();
    res.json({
        code: 200,
        message: 'get crawl rule list success',
        value: list
    });
});
router.post('/getOneById', (req, res)=>{
    let one = crawlRuleModal.getOneById(req.body.id);
    res.json({
        code: 200,
        message: 'get crawl rule success',
        value: one
    });
});
router.post('/removeOneById', (req, res)=>{
    crawlRuleModal.removeOne(req.body.id);
    res.json({
        code: 200,
        message: 'remove one crawl rule success',
        value: ''
    });
});
module.exports = router;