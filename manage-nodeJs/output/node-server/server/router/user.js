const express = require('express');
let router = express.Router();
const getKeyByReg = require('../lib/getKeyByReg');
const checkLoginMiddleware = require('../middleware/checkLogin');
const checkPermissionMiddleware = require('../middleware/checkPermission');
const userModel = require('../model/user');
const PERMISSION = require('../const/PERMISSION');

// user login
router.get('/login', require('../middleware/checkLogin'), function(req, res){
    const redirectUrl = getKeyByReg(req.params, /redirectUrl/i);
    if(redirectUrl){
        res.redirect(redirectUrl);
        return;
    }
    res.redirect('/page/home');
});
router.get('/logout', function(req, res){
    delete req.session.user;
    // let keys = Object.keys(req.cookies);
    // keys.forEach(function(key){
    //     res.clearCookie(key);
    // });
    const logoutUrl = 'https://login.flyme.cn/sso/logout?useruri=' + encodeURIComponent(req.protocol + '://' + req.get('host'));
    res.redirect(logoutUrl);
});
router.get('/getInfo', checkLoginMiddleware, function(req, res){
<<<<<<< HEAD
    //let userData = userModel.getOneById(req.session.user.id);
    res.json({
        code: 200,
        value: {
            id: 1,//userData.id,
            name: 'admin',//userData.name,
            permissions: []//userData.permissions
=======
    let userData = userModel.getOneById(req.session.user.id);
    res.json({
        code: 200,
        value: {
            id: userData.id,
            name: userData.name,
            permissions: userData.permissions
>>>>>>> 25f81651ca73ec7ec1117b96898122ec79e9134e
        }
    });
});
router.get('/getList', checkLoginMiddleware, (req, res)=>{
    res.json({
        code: 200,
        value: userModel.getList()
    });
});
router.get('/getPermission', checkLoginMiddleware, checkPermissionMiddleware('authorization'), (req, res)=>{
    let userId = req.query.userId;
    let userInfo = userModel.getOneById(userId);
    if(!userInfo){
        res.json({code:500,message: 'User not found.',value:''});
        return;
    }
    res.json({
        code: 200,
        value: userInfo.permission || []
    });
});
router.post('/savePermission', checkLoginMiddleware, checkPermissionMiddleware('authorization'), (req, res)=>{
    let userId = req.body.userId;
    let permissions = req.body.permissions;
    let list = userModel.getListInstance();
    list.find({id: userId}).set('permission', permissions).write();
    res.json({
        code: 200,
        value: ''
    });
});
router.get('/setSuperUser', checkLoginMiddleware, (req, res)=>{
    // if no authorization found, pass this check
    let userList = userModel.getList();
    let foundUser = userList.find(user=>{
        return user.permission.includes('authorization');
    });
    if(foundUser === undefined){
        let userId = req.query.userId;
        let allPermissionName = Object.keys(PERMISSION);
        let user = userModel.getOneById(userId);
        if(user === undefined){
            res.json({
                code: 500,
                message: 'user not found.',
                value: ''
            });
            return;
        }
        userModel.getListInstance().find({id: userId}).set('permission', allPermissionName).write();
        res.json({
            code: 200,
            message: 'set super user success!',
            value: ''
        });
        return;
    }
    res.json({
        code: 400,
        message: 'You do not have permission to proceed'
    });
})
module.exports = router;