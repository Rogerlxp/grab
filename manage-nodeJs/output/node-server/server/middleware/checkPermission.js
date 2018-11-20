const userModel = require('../model/user');

module.exports = function(permissionName){
    return  function(req, res, next){
        // check current user permissions
        let isAuthorized = false;
        if(req.session.user && req.session.user.id){
            const user = userModel.getOneById(req.user.session.id);
            if(user.permission.includes(permissionName) || user.permissions.includes('authorization')){
                isAuthorized = true;
            }
        }
        if(isAuthorized){
            next();
        }else{
            res.json({
                code: 400,
                message: '权限不足',
                value: ''
            });
        }
    }
}