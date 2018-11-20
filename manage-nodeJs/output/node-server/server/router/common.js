const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const router = express.Router();
const checkLogin = require('../middleware/checkLogin');
const multer = require('multer');
const sizeOf = require('image-size');
const request = require('request');
const API = require('../const/API');
const URI = require('urijs');
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

router.post('/re-upload', checkLogin, upload.single('file'), function(req, res){
    const file = req.file;
    file.ext = path.extname(file.filename);
    // const cookies = req.cookies;
    // const uTicket = getKeyByReg(cookies, /uTicket/i);
    const headerCookie = req.headers.cookie;
    // I try to make a recursive function to make sure upload success when user ticket expired.
    // But at last, I realize it does not need it.
    const url = API.uploadImage.url;
    let dimensions;
    if(['.png', '.jpg', '.jpeg', '.gif'].includes(file.ext)){
        dimensions = sizeOf(file.path);
    }
    const upload = function(cb){
        const formData = {
            image: {
                value: fs.createReadStream(file.path),
                options: {
                    originalFilename: file.filename,
                    filename: file.filename,
                    contentType: file.mimetype
                }
            },
        };
        const reqCallback = async function(err, response, body){
            fs.removeSync(file.path);
            if(err){
                throw err;
            }
            // console.log(body);
            let upRes;
            try{
                upRes = JSON.parse(body);
            }catch(error){
                console.error('Can not parse upload image response.');
                console.info(body);
            }
            cb(upRes);
        };
        const headers = {cookie:headerCookie};
        request.post({url, formData, headers}, reqCallback);
    };
    upload(function(upRes){
        if(+upRes.code !== 200){
            console.log('Upload image lead an error.');
            console.log('error url: ' + url);
            console.error(JSON.stringify(upRes));
            res.json(upRes);
            return;
        }
        const imgUrl = new URI(upRes.value);
        if(dimensions){
            imgUrl.setQuery('width', dimensions.width);
            imgUrl.setQuery('height', dimensions.height);
        }
        upRes.value = imgUrl.toString();
        res.json(upRes);
        // res.json({
        //     code: 200,
        //     message: '',
        //     value: res
        // });
    });
});
router.all('/redirect',  checkLogin, async function(req, res){
    // to do: compatible all request method
    const method = (req.method || 'get').toUpperCase();
    if(['GET', 'POST'].includes(method) === false){
        res.json({
            code: 501,
            message: 'server does not accept this method: ' + method,
            value: ''
        });
    }
    const reqArgs = {};
    reqArgs.url = req.query.url;
    if(req.query.encode === 'base64'){
        reqArgs.url = Buffer.from(reqArgs.url, 'base64').toString();
        console.log('decode from base 64: ');
        console.log(reqArgs.url);
    }
    reqArgs.method = method.toUpperCase();
    reqArgs.headers = {};
    reqArgs.headers.cookie = req.headers.cookie;
    reqArgs.json = true;
    if(reqArgs.method === 'POST'){
        if(/json/.test(req.headers['content-type'])){
            reqArgs.body = req.body;
        }else if(/urlencoded/.test(req.headers['content-type'])){
            const urlencodedStr = Object.entries(req.body).map(([key,val])=>key + '=' + encodeURIComponent(val)).join('&');
            reqArgs.form = urlencodedStr;
            reqArgs.headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }
    }
    request(reqArgs, function(error, response, body){
        let redirectRes;
        if(error){
            res.json({
                code: 502,
                message: '请求失败',
                value: error
            });
            return;
        }
        if(!body){
            res.json({
                code: 501,
                message: '空返回',
                value: response
            });
            return;
        }
        try{
            if(typeof body === 'string'){
                redirectRes = JSON.parse(body);
            }else if(typeof body === 'object'){
                redirectRes = body;
            }
        }catch(err){
            redirectRes = {
                code: 503,
                message: 'java server respond a non-json content.',
                value: body
            };
            // console.log('err: ', error);
            // console.log('response: ', response);
        }
        if(redirectRes.code !== 200){
            console.error('redirect a url lead an error.');
            console.error('arg: ', reqArgs);
            console.error('body: ' , body);
        }
        res.json(redirectRes);
    });
});

module.exports = router;