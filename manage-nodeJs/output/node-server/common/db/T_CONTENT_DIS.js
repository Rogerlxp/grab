const DISTRIBUTION_CHANNEL = require('../enum/DISTRIBUTION_CHANNEL.js');
const DISTRIBUTION_STYLES = require('../enum/DISTRIBUTION_STYLES.js');
const DISTRIBUTION_OPEN_TYPE = require('../enum/DISTRIBUTION_OPEN_TYPE.js');
const DISTRIBUTION_ORDER = require('../enum/DISTRIBUTION_ORDER.js');
module.exports = [{
    name: '分发ID',
    keyName: 'FID',
    readonly: true,
    isPrimaryKey: true,
    valueType: 'number',
    isAutoGen: true,
    deleteConfig: {
        deleteText: '以之相关的所有配置将被删除，并且不能恢复，确定？',
    },
    relativeTables: [{
        tableName: 'T_CONTENT_DIS_FLITER',
        keyName: 'FDISID',
        isSyncDelete: true
    }, {
        tableName: 'T_CONTENT_DIS_DISPLAY',
        keyName: 'FDISID',
        isSyncDelete: true,
    }, {
        tableName: 'T_CONTENT_DIS_CONDITION',
        keyName: 'FDISID',
        isSyncDelete: true
    }]
},{
    name: '分发名',
    keyName: 'FNAME',
    valueType: 'string',
    isRequired: true,
    width: 250,
    placeholder: '请填写分发名(必填)'
},{
    name: '分发渠道',
    keyName: 'FCHANNEL_ID',
    type: 'select',
    isRequired: true,
    options: DISTRIBUTION_CHANNEL,
    width: 120,
    placeholder: '请选择（必填）'
}, {
    name: '下发排序',
    keyName: 'FORDER',
    type: 'select',
    options: DISTRIBUTION_ORDER,
    uneditable: true,
    width: 120,
}, {
    name: '是否分页',
    keyName: 'FPAGE',
    type: 'select',
    uneditable: true,
    options: [{
        name: '分页',
        value: 1,
    }, {
        name: '不分页',
        value: 0
    }],
    width: 120,
},{
    name: '列表样式',
    keyName: 'FDISPLAY_STYLE',
    defaultValue: 3,
    isRequired: true,
    uneditable: true,
    type: 'select',
    options: DISTRIBUTION_STYLES,
    width: 120,
},{
    name: '在线状态',
    keyName: 'FSTATUS',
    type: 'select',
    defaultValue: 0,
    options: [{
        name: '新建',
        value: 0
    }, {
        name: '上线',
        value: 1
    }, {
        name: '下线',
        value: 4
    }]
}, {
    name: '下发数量',
    keyName: 'FDIS_COUNT',
    valueType: 'number',
    uneditable: true,
    isAutoGen: true,
    width: 120,
},{
    name: '打开方式',
    keyName: 'FOPEN_TYPE',
    type: 'select',
    options: DISTRIBUTION_OPEN_TYPE,
    width: 120,
    defaultValue: 1,
},{
    name: '更新时间',
    keyName: 'FUPDATE_TIME',
    type: 'update-time',
    uneditable: true
},{
    name: '创建时间',
    keyName: 'FCREATE_TIME',
    type: 'create-time',
    uneditable: true
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
        actionName: 'manageItem'
    }, {
        name: '删除',
        actionType: 'click',
        actionName: 'deleteItem'
    }]
}];