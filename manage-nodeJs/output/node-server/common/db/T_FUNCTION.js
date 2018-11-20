const {MOVE_RULE_FILE, REFRESH_FUNCTION_CACHE} = require('../API');
module.exports = [{
    name: '转码ID',
    keyName: 'FID',
    isPrimaryKey: true,
    isAutoGen: true,
    readonly: true,
    formOrder: 1,
    width: 100,
    deleteConfig: {
        deleteText: '以之相关的所有配置将被删除，并且不能恢复，确定？',
    },
    relativeTables: [{
        tableName: 'T_FUNCTION_RULE',
        keyName: 'FFUNCTION_ID',
        isSyncDelete: true
    }],
    informServer: {
        api: REFRESH_FUNCTION_CACHE
    },
}, {
    name: '功能名称',
    keyName: 'FREMARK',
    notNull: true,
    type: 'string',
    defaultValue: '',
    width: 300
}, {
    name: 'JS方法名',
    keyName: 'FFUNCTION',
    notNull: true,
    defaultValue: '',
    isUnique: true,
    width: 200,
    isRequire: true
}, {
    name: '默认参数',
    keyName: 'FDEF_VALUE',
    notNull: true,
    defaultValue: '',
    type: 'string',
    width: 150
}, {
    name: '状态',
    keyName: 'FSTATUS',
    notNull: true,
    type: 'select',
    defaultValue: 1,
    options: [{
        name: '下架',
        value: 0,
    }, {
        name: '上架',
        value: 1
    }, {
        name: '待验证',
        value: 2
    }],
    width: 100
}, {
    name: '创建时间',
    keyName: 'FCREATE_TIME',
    type: 'create-time',
    notNull: true,
    width: 150
}, {
    name: '更新时间',
    keyName: 'FUPDATE_TIME',
    type: 'update-time',
    notNull: true,
    width: 150
},{
    name: '操作',
    type: 'button',
    buttons: [{
        name: '编辑',
        actionType: 'click',
        actionName: 'toggleContentEditModal'
    },{
        name: '配置',
        actionType: 'click',
        actionName: 'manageFunctionRule'
    }, {
        name: '删除',
        actionType: 'click',
        actionName: 'deleteItem'
    }]
}];
