module.exports = [{
    keyName: 'id',
    name: 'ID',
    isPrimaryKey: true,
    isAutoGen: true,
    readonly: true,
    listConfig: {
        api: 'http://om.iflow.meizu.com/service/param/list',
        pager: {
            start: 'start',
            pageSize: 'length'
        },
        listMap: 'value.data',
        totalMap: 'value.total'
    },
    addConfig: {
        api: 'http://om.iflow.meizu.com/service/param/add',
        enctype: 'urlencoded',
        isRedirect: true,
    },
    deleteConfig: {
        api: 'http://om.iflow.meizu.com/service/param/del',
        argMap: {
            id: 'id'
        },
        isRedirect: true,
        enctype: 'URLENCODED'
    },
    updateConfig: {
        api: 'http://om.iflow.meizu.com/service/param/upd',
        isRedirect: true,
        enctype: 'URLENCODED'
    },
    detailConfig: {
        api: 'http://om.iflow.meizu.com/service/param/info',
        isRedirect: true,
        argMap: {
            id: 'id'
        }
    },
}, {
    keyName: 'type',
    name: '类型',
    isRequired: true
}, {
    keyName: 'canModify',
    name: '可否编辑',
    uneditable: true,
    unlistable: true
}, {
    keyName: 'key',
    name: '键',
    isRequired: true,
    width: 150
}, {
    keyName: 'value',
    name: '值',
    isRequired: true,
    width: 500
}, {
    keyName: 'name',
    name: '名称',
    isRequired: true
}, {
    keyName: 'description',
    name: '描述',
    isRequired: true,
    width: 200
}, {
    name: '操作',
    type: 'button',
    buttons: [{
        name: '编辑',
        actionName: 'toggleContentEditModal'
    },{
        name: '删除',
        actionName: 'deleteItem'
    }]
}];