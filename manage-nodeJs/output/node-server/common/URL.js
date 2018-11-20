const SYSTEM = require('./SYSTEM');
// do not add '? ' at the end.
module.exports = {
    userLogin: {
        name: '用户登录',
        value: 'https://login.flyme.cn/login/login.html'
    },
    userLogout: {
        name: '用户退出登录',
        value: 'https://login.flyme.cn/sso/logout'
    },
    getUserInfo: {
        name: '获取用户信息（加密接口）',
        value: 'https://i.flyme.cn/uc/sign/getLoginInfoByTicket'
    },
    refreshUserToken: {
        name: '刷新用户token时间',
        value: 'https://i.flyme.cn/uc/webservice/refreshTokenByTicket'
    },
    imageUpload: {
        name: '图片上传，要带上cookie，需要登录认证',
        value: 'http://om.iflow.meizu.com/service/common/upload'
    },
    redirectCpContent: {
        name: '通过id参数，自动跳转到cp内容页',
        value: '/' + SYSTEM.urlVersion.value + '/api/contents/redirect-cp-content'
    }
}