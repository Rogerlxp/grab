const express = require('express');
const request = require('request-promise-native');
const requestLib = require('request');
const axios = require('axios');
const mime = require('mime-types');
const fs = require('fs-extra');
const cheerio = require('cheerio');
const path = require('path');
const router = express.Router();
const logger = require('../lib/logger');
const checkLogin = require('../middleware/checkLogin');
const crawl = require('../../lib/contentCrawler/index');
const crawlRuleModel = require('../model/crawlRule');
const API = require('../const/API');
const URI = require('urijs');
const sizeOf = require('image-size');
const Browser = require('zombie');
const puppeteer = require('puppeteer');
const REFERER_MAP = require('../../common/REFERER_MAP');
const sql = require('../lib/mysql');
const multer = require('multer');
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
const base64Reg = /^data:(image\/\w{1,5});base64,/;
const isBase64 = function(str){
    return base64Reg.test(str);
}
// request.debug = true;
// requestLib.debug = true;
let browserCache;
const getBrowser = async function(){
    if(!browserCache){
        browserCache = await puppeteer.launch({
            args: ['--no-sandbox'],
            // devtools: true
        });
    }
    return browserCache;
}
const downloadByPuppeteer = async function(src, referer){
    const browser = await getBrowser();
    const page = await browser.newPage();
    if(referer){
        console.log('referer: ', referer);
        await page.setExtraHTTPHeaders({
            'referer': referer
        });
    }
    console.log('download image: ' + src);
    // await page.setRequestInterception(true);
    const response = await page.goto(src, {
        waitUntil: 'load'
    });
    const buffer = await response.buffer();
    // console.log('buffer: ', buffer);
    const headers = response.headers();
    const contentType = headers['content-type'];
    const ext = mime.extension(contentType);
    await page.close();
    return {ext, buffer};
};
const downloadByAjax = async function(src, referer){
    // console.log('ref: ',referer);
    // console.log('src: ',src);
    let res = await axios({
        url: src,
        method: 'get',
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
            'Referer': referer,
        },
        // proxy: {
        //     host: 'localhost',
        //     port: 8888
        // }
    });
    const contentType = res.headers['content-type'];
    const ext = mime.extension(contentType);
    // console.log(res);
    const buffer = res.data;
    return {ext, buffer};
};
const uploadImage = function(req, url){
    return new Promise(async resolve=>{
        // download
        const crawlUrl = req.body.url || url;
        const isBase64Img = isBase64(url);
        const fileDir = path.join(global.setting.cwd, 'temp', 'images');
        fs.ensureDirSync(fileDir);
        let ext = '';
        let buffer;
        if(isBase64Img){
            const matchContentType = url.match(base64Reg);
            ext = mime.extension(matchContentType[1]);
            buffer = new Buffer(url.replace(base64Reg, ''), 'base64');
        }else{
            const res = await downloadByAjax(url, crawlUrl);
            ext = res.ext;
            buffer = res.buffer;
        }
        if(!ext){
            resolve({
                code: 502,
                message: '无法获取文件类型： ' + ext,
                value: ''
            });
            return;
        }
        const fileName = Date.now() + '.' + ext;
        const filePath = path.join(fileDir, fileName);
        fs.writeFileSync(filePath, buffer);
        const dimensions = sizeOf(filePath);
        const formData = {image: fs.createReadStream(filePath)};
        const uploadHeaders = {
            cookie: req.headers.cookie
        };
        console.log('uploading image: ' + filePath);
        let uploadRes = await request.post({
            url: API.uploadImage.url,
            formData,
            headers: uploadHeaders
        });
        fs.removeSync(filePath);
        if(typeof uploadRes === 'string'){
            uploadRes = JSON.parse(uploadRes);
        }
        if(uploadRes.code === 200){
            let src = uploadRes.value;
            let srcUri = new URI(src);
            srcUri.setQuery('width', dimensions.width);
            srcUri.setQuery('height', dimensions.height);
            uploadRes.value = srcUri.toString();
        }
        resolve(uploadRes);
        // console.log('page: ', page);
        // console.log('real goto url: ' + page.url());
    });
}
// param: imgUrl, url(for referer)
router.post('/save-image', async function(req, res){
    const absoluteImgUrl = req.body.imgUrl;
    if(!absoluteImgUrl){
        res.json({
            code: 501,
            message: 'Can not upload empty image.',
            value: ''
        });
    }
    if(!req.body.url){
        const imgUri = new URI(absoluteImgUrl);
        const host = imgUri.hostname();
        const refererHost = REFERER_MAP.find(each=>each.source === host);
        if(refererHost){
            const protocol = imgUri.protocol();
            req.body.url = protocol + '://' + refererHost.referer;
        }else{
            req.body.url = imgUri.origin();
        }
    }
    const uploadRes = await uploadImage(req, absoluteImgUrl);
    res.json(uploadRes);
});
router.post('/getContent', checkLogin, async (req, res)=>{
    const url = req.body.url;
    if(!url){
        res.json({
            code: 500,
            message: '必需提供抓取页面的URL地址',
            value: ''
        });
        return;
    }
    const uri = new URI(url);
    const host = uri.hostname();
    const sqlRes = await sql.query(`SELECT * FROM MEIZU_CONTENTS.T_CRAWL_RULE WHERE '${host}' LIKE FDOMAIN;`);
    let rule;
    if(sqlRes.length){
        rule = {};
        const row = sqlRes[0];
        console.log('found rule: ' + row.FSITE_NAME);
        rule.contentRule = row.FCONTENT_RULE;
        rule.contentPRule = row.FCONTENT_P_RULE;
        rule.contentImgRule = row.FCONTENT_IMG_RULE;
        rule.contentNotRule = row.FCONTENT_NOT_RULE;
        rule.titleRegexp = row.FTITLE_REGEXP;
        rule.titleRule = row.FTITLE_RULE;
        rule.sourceRule = row.FSOURCE_RULE;
        rule.sourceRegexp = row.FSOURCE_REGEXP;
        rule.authorRule = row.FAUTHOR_RULE;
        rule.authorRegexp = row.FAUTHOR_REGEXP;
        rule.publicDateRule = row.FPUBLIC_DATE_RULE;
        rule.pageRule = row.FPAGE_RULE;
        rule.isNeedScroll = row.FIS_NEED_SCROLL;
        rule.fetchEngine = row.FFETCH_ENGINE;
    }else{
        logger.info('found no crawl rule.');
    }
    const result = await crawl({url, rule});
    if(!result){
        res.json({
            code: 500,
            message: 'Can not get page data.',
            value: ''
        });
        return;
    }
    if(result.code){
        res.json(result);
        return;
    }
    if(result.imgMap.length){
        for(let imgInfo of result.imgMap){
            imgInfo.originalUrl = imgInfo.url;
            // console.log('img info: ', imgInfo);
            let absoluteImgUrl = '';
            if(isBase64(imgInfo.url)){
                absoluteImgUrl = imgInfo.url;
            }else{
                const imageUri = new URI(imgInfo.url);
                absoluteImgUrl = imageUri.absoluteTo(url).toString();
            }
            // console.log('url type: ' + typeof absoluteImgUrl);
            // console.log('save image to our server: ' + absoluteImgUrl);
            const uploadRes = await uploadImage(req, absoluteImgUrl);
            if(!uploadRes){
                logger.error('upload image error.');
                continue;
            }
            if(uploadRes.code === 200){
                imgInfo.url = uploadRes.value;
                result.content = result.content.replace(imgInfo.originalUrl, imgInfo.url);
            }else{
                logger.error('upload image error message: ' + uploadRes.message);
                logger.error('upload image error code: ' + uploadRes.code);
                continue;
            }
        }
    }
    res.json({
        code: 200,
        message: '',
        value: result
    });
});
router.all('/getHtml', async function (req, res){
    const browserOptions = {
        loadCSS: false,
        waitDuration: '30s',
        debug: true
    };
    const browser = new Browser(browserOptions);
    // browser.proxy = 'http://127.0.0.1:8888';
    const method = req.method;
    let args = {};
    if(method === 'POST'){
        args = req.body;
    }else if(method === 'GET'){
        args = req.query;
    }else{
        res.json({
            code: 503,
            message: 'Not support this type of request method.',
            value: ''
        });
        return;
    }
    if(!args.url){
        res.json({
            code: 500,
            message: '必须提供url',
            value: ''
        });
        return;
    }
    let options = {};
    if(args.options){
        options = args.options;
    }
    if(typeof options === 'string'){
        options = JSON.parse(options);
    }
    if(options.headers){
        browser.headers = options.headers;
    }
    const error = await browser.visit(args.url);
    // console.log(browser);
    if(error){
        res.json({
            code: 501,
            message: '抓取错误',
            value: error
        });
        return;
    }
    let html = '';
    try{
        html = browser.window.document.documentElement.innerHTML;
    }catch(error){
        res.json({
            code: 502,
            message: '提取HTML错误',
            value: ''
        });
        throw error;
    }
    res.json({
        code: 200,
        message: 'success',
        value: {
            html: html
        }
    });
});
router.get('/export', async function(req, res){
    const sqlRes = await sql.query(`SELECT * FROM MEIZU_CONTENTS.T_CRAWL_RULE;`);
    const filePath = path.join(global.setting.cwd, 'temp', Date.now() + '.json');
    fs.writeFileSync(filePath, JSON.stringify(sqlRes), {
        encoding: 'utf-8'
    })
    console.log('export crawl rule: ' + filePath);
    res.download(filePath, 'crawl-rules.json', function(){
        fs.remove(filePath);
    });
});
router.post('/import', upload.single('crawl-rules.json'), async function(req, res){
    const file = req.file;
    const crawlRules = JSON.parse(fs.readFileSync(file.path, {encoding: 'utf-8'}));
    const currentRules = await sql.query(`SELECT * FROM MEIZU_CONTENTS.T_CRAWL_RULE;`);
    let newCount = 0;
    let editCount = 0;
    for(const rule of crawlRules){
        const foundRule = currentRules.find(each=>each.FDOMAIN === rule.FDOMAIN);
        delete rule.FUPDATE_TIME;
        delete rule.FCREATE_TIME;
        delete rule.FID;
        Object.keys(rule).forEach(key=>{
            let val = rule[key];
            if(val === null){
                rule[key] = 'NULL';
            }else if(!val){
                rule[key] = `''`;
            }else{
                rule[key] = `'${val.toString()}'`;
            }
        });
        console.log(foundRule);
        if(foundRule){
            // update
            const fields = Object.keys(rule).map(key=>{
                return `${key}=${rule[key]}`;
            }).filter(each=>!!each);
            await sql.query(`UPDATE MEIZU_CONTENTS.T_CRAWL_RULE SET ${fields.join(',')} WHERE FDOMAIN=${rule.FDOMAIN};`);
            editCount++;
        }else{
            // new
            let fields = [];
            let values = [];
            Object.keys(rule).map(key=>{
                fields.push(key);
                values.push(rule[key]);
            });
            await sql.query(`INSERT INTO MEIZU_CONTENTS.T_CRAWL_RULE (${fields.join(',')}) VALUES (${values.join(',')});`);
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
router.get('/topicInfo', async function(req, res){
    const topicUrl = req.query.url;
    const browserOptions = {
        loadCSS: false,
        waitDuration: '30s',
        debug: true
    };
    const browser = new Browser(browserOptions);
    const error = await browser.visit(topicUrl);
    if(error){
        console.error(error);
        res.jsonp({
            code: 501,
            message: '访问主题页失败，请确认输入的url是否完整并且正确。',
            value: ''
        });
        throw error;
    }
    const html = browser.window.document.documentElement.innerHTML;
    const $ = cheerio.load(html);
    const list = [];
    $('[data-id]').each(function(){
        list.push($(this).attr('data-id'));
    });
    const title = $('.info>.title').text();
    const desc = $('.info>.desc').text();
    res.jsonp({
        code: 200,
        message: '获取成功',
        value: {
            list,
            title,
            desc
        }
    });
});
module.exports = router;