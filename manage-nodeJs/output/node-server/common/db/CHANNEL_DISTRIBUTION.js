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
    tableName: 'T_CONTENT_DIS',
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
    name: '分发渠道',
    keyName: 'FCHANNEL_ID',
    type: 'select',
    isRequired: true,
    options: 'channelOptions',
    placeholder: '请选择（必填）'
},{
    keyName: 'FSUB_CHANNELID',
    name: '频道名称',
    type: 'select',
    options: 'subChannelOptions',
    placeholder: '请先选择“分发渠道”',
    optionFilter: 'FCHANNEL_ID'
},{
    name: '真正的频道名称',
    keyName: 'FNAME',
    newByField: {
        keyName: 'FSUB_CHANNELID',
        targetProperty: 'name'
    },
    notShowWhenNew: true,
    unlistable: true
},{
    name: '状态',
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
},{
    name: '分发方式',
    keyName: 'FOPEN_TYPE',
    type: 'select',
    options: DISTRIBUTION_OPEN_TYPE,
    width: 120,
    defaultValue: 1,
},{
    name: '新旧分发',
    keyName: 'FFLAG',
    uneditable: true,
    unlistable: true,
    type: 'select',
    options: [{
        name: '新分发',
        value: 1
    },{
        name: '旧分发',
        value: 0
    }],
    defaultValue: 1,
    isForceSend: true
},{
    name: '更新时间',
    keyName: 'FUPDATE_TIME',
    type: 'update-time',
    uneditable: true,
    unlistable: true
},{
    name: '创建时间',
    keyName: 'FCREATE_TIME',
    type: 'create-time',
    uneditable: true,
},{
    name: '操作',
    type: 'button',
    buttons: [{
        name: '内容+算法配置',
        link: {
            href: '/v2/page/channel/content-algorithm',
            argMap: {
                disId: 'FID'
            }
        }
    },{
        name: '关键字管理',
        actionType: 'click',
        actionName: ''
    }, {
        name: '样式配置',
        actionType: 'click',
        actionName: '',
        isShow: {
            keyName: 'FOPEN_TYPE',
            value: 4
        }
    },{
        name: '下线',
        actionName: 'algorithmContentOffline',
        isShow: {
            keyName: 'FSTATUS',
            keyValue: 1
        }
    },{
        name: '上线',
        actionName: 'algorithmContentOnline',
        isShow: {
            keyName: 'FSTATUS',
            keyValue: [0,4]
        }
    }]
}];