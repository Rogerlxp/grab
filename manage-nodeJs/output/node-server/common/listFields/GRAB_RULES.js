const CP_SOURCES = require('../enum/CP_SOURCES');
module.exports = [{
    keyName: 'id',
    name: 'ID',
    isPrimaryKey: true,
    readonly: true,
    listConfig: {
        pager: false
    },
    deleteConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/biz/grab/del',
        argMap: {
            grabId: 'id'
        },
        isRedirect: true,
        method: 'GET'
    },
    detailConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/biz/grab/detail',
        argMap: {
            grabId: 'id'
        },
        isRedirect: true
    },
    updateConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/biz/grab/update',
        method: 'POST',
        isRedirect: true
    }
}, {
    keyName: 'url',
    name: 'url',
    width: 150
}, {
    keyName: 'cpId',
    name: 'CP来源',
    type: 'select',
    options: CP_SOURCES
}, {
    keyName: 'fixedValueParam',
    name: '固定参数',
    width: 60
}, {
    keyName: 'grabExtractElement',
    name: '提取规则',
    width: 250,
    type: 'textarea'
}, {
    keyName: 'heads',
    name:'请求头部',
    width: 100
}, {
    keyName: 'mappingValueParams',
    name: 'map变量参数',
    width: 60
}, {
    keyName: 'methodType',
    name: '方法类型',
    width: 40
}, {
    keyName: 'paramSchema',
    name: '参数Schema',
    width: 200,
    type: 'textarea'
}, {
    keyName: 'positionEnum',
    name: '位置枚举'
}, {
    keyName: 'positionEnumInt',
    name: '位置枚举整型',
    width: 50
}, {
    keyName: 'signId',
    name: '签名ID',
    width: 30
}, {
    keyName: 'signSchema',
    name: '签名',
    unlistable: true,
    uneditable: true
}, {
    keyName: 'siteId',
    name: '网站ID',
    width: 30
}, {
    keyName: 'tokenGrabId',
    name: 'TokenID',
    width: 30
}, {
    keyName: 'tokenName',
    name: 'Token名称',
    width: 40
}, {
    keyName: 'create_Time',
    type: 'create-time',
    name: '创建时间',
    unlistable: true
}, {
    keyName: 'update_Time',
    type: 'update-time',
    name: '更新时间',
}, {
    name: '操作',
    type:'button',
    buttons: [{
        name: '编辑',
        actionName: 'toggleContentEditModal'
    }, {
        name: '删除',
        actionName: 'deleteItem',
        type: 'danger'
    }]
}];