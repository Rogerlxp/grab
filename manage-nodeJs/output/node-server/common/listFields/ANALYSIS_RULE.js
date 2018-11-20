const STATUS = require('../enum/ANALYSIS_RULE_STATUS');
module.exports = [{
    name: '序号',
    keyName: 'id',
    isPrimaryKey: true,
    readonly: true,
    isAutoGen: true,
    listConfig: {
        api: 'http://om.iflow.meizu.com/service/rule/list',
        pager: {
            start: 'start',
            pageSize: 'length',
        },
        listMap: 'value.data',
        totalMap: 'value.total'
    },
    detailConfig: {
        api: 'http://om.iflow.meizu.com/service/rule/info',
        isRedirect: true,
        argMap: {
            id: 'id'
        }
    },
    deleteConfig: {
        api: 'http://om.iflow.meizu.com/service/rule/del',
        argMap: {
            id: {
                keyName: 'id',
                type: 'string'
            }
        },
        isRedirect: true,
        enctype: 'URLENCODED'
    },
    updateConfig: {
        api: 'http://om.iflow.meizu.com/service/rule/upd',
        isRedirect: true,
        enctype: 'URLENCODED'
    },
    addConfig: {
        api: 'http://om.iflow.meizu.com/service/rule/add',
        enctype: 'urlencoded'
    }
}, {
    name: '表达式',
    keyName: 'regexp',
    isRequired: true
}, {
    name: '状态',
    keyName: 'status',
    type: 'select',
    options: STATUS,
    defaultValue: 1,
    notShowWhenNew: true
}, {
    name: '备注',
    keyName: 'remark',
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
        name: '配置脚本',
        actionName: 'selectAnalysisRule'
    },{
        name: '编辑',
        actionName: 'toggleContentEditModal'
    },{
        name: '删除',
        actionName: 'deleteItem'
    }]
}];