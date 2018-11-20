const SCRIPT_TYPES = require('../enum/RULE_SCRIPT_TYPES');
module.exports = [{
    name: '序号',
    keyName: 'id',
    isPrimaryKey: true,
    readonly: true,
    isAutoGen: true,
    listConfig: {
        api: 'http://om.iflow.meizu.com/service/script/list',
        pager: {
            start: 'start',
            pageSize: 'length',
        },
        listMap: 'value.data',
        totalMap: 'value.total'
    },
    deleteConfig: {
        api: 'http://om.iflow.meizu.com/service/script/del',
        argMap: {
            id: 'id'
        },
        isRedirect: true,
        enctype: 'URLENCODED'
    },
    addConfig: {
        api: 'http://om.iflow.meizu.com/service/script/add',
        enctype: 'urlencoded',
        isRedirect: true,
    }
}, {
    name: '名称',
    keyName: 'name',
    isRequired: true
}, {
    name: '类型',
    keyName: 'type',
    type: 'select',
    options: SCRIPT_TYPES
}, {
    name: '路径',
    keyName: 'path',
    type: 'file'
}, {
    name: '创建时间',
    keyName: 'createTime',
    type: 'date',
    uneditable: true
}, {
    name: '更新时间',
    keyName: 'updateTime',
    type: 'date',
    uneditable: true
}, {
    name: '操作',
    type: 'button',
    buttons: [{
        name: '删除',
        actionName: 'deleteItem'
    }]
}];