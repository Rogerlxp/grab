module.exports = [{
    keyName: 'id',
    name: '用户ID',
    isPrimaryKey: true,
    isAutoGen: true,
    readonly: true,
    listConfig: {
        api: 'http://om.iflow.meizu.com/service/user/list',
        pager: {
            start: 'start',
            pageSize: 'length'
        },
        listMap: 'value.data',
        totalMap: 'value.total'
    },
    addConfig: {
        api: 'http://om.iflow.meizu.com/service/user/add',
        enctype: 'urlencoded',
        isRedirect: true,
    },
    deleteConfig: {
        api: 'http://om.iflow.meizu.com/service/user/del',
        argMap: {
            id: 'id'
        },
        isRedirect: true,
        enctype: 'URLENCODED'
    },
    updateConfig: {
        api: 'http://om.iflow.meizu.com/service/user/upd',
        isRedirect: true,
        enctype: 'URLENCODED'
    },
    detailConfig: {
        api: 'http://om.iflow.meizu.com/service/user/info',
        isRedirect: true,
        argMap: {
            id: 'id'
        }
    },
    batchSetList: {
        api: 'http://om.iflow.meizu.com/service/user/role/list',
        argMap: {
            userId: 'id'
        }
    }
}, {
    keyName: 'param',
    name: 'ID/帐号/手机',
    unlistable: true,
    notShowWhenUpdate: true,
},{
    keyName: 'name',
    name: '用户名称',
    readonly: true,
    isNotSend: true,
    notShowWhenNew: true
}, {
    keyName: 'flyme',
    name: '用户账号',
    readonly: true,
    isNotSend: true,
    notShowWhenNew: true
}, {
    keyName: 'email',
    name: '用户邮箱',
    readonly: true,
    isNotSend: true,
    notShowWhenNew: true
}, {
    keyName: 'remark',
    name: '备注'
}, {
    keyName: 'roleName',
    name: '角色名称',
    readonly: true,
    isNotSend: true,
    notShowWhenNew: true
}, {
    name: '操作',
    type: 'button',
    buttons: [{
        name: '授权',
        actionName: 'openBatchSet'
    },{
        name: '编辑',
        actionName: 'toggleContentEditModal'
    },{
        name: '删除',
        actionName: 'deleteItem'
    }]
}];