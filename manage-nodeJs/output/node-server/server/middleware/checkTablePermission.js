const userModel = require('../model/user');

module.exports = function(req, res, next){
    if(global.setting.is_no_authorization === true){
        next();
        return;
    }
    const dbName = req.query.dbName;
    const tableName = req.query.tableName;
    // check permission base on table
    const user = userModel.getOneById(req.session.user.id);
    let isAuthorized = false;
    if(Array.isArray(user.permissions) === false || user.permissions.length === 0){
        isAuthorized = false;
    }else if(user.permissions.includes('authorization')){
        isAuthorized = true;
    }else if(dbName === 'MEIZU_CONTENTS'){
        if(tableName === 'T_AUTHOR'){
            if(user.permissions.includes('editAuthor')){
                isAuthorized = true;
            }
        }
    }
    if(isAuthorized === false){
        res.json({
            code: 402,
            message: '权限不足',
            value: ''
        });
        return;
    }else{
        next();
    }
}