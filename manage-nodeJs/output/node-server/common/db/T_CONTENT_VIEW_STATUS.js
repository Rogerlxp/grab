const CP_SOURCES = require('../enum/CP_SOURCES');
module.exports = [{
    isPrimaryKey: true,
    name: '统计ID',
    keyName: 'FID',
    tableName: 'T_CONTENT_VIEW_SUMMARY',
    join: [{
        table: 'T_CONTENT_VIEW_STATUS',
        on: 'T_CONTENT_VIEW_SUMMARY.FCPID=T_CONTENT_VIEW_STATUS.FCPID',
        type: 'LEFT JOIN'
    }, {
        on: 'T_CONTENT_VIEW_SUMMARY.FSTAT_DATE=T_CONTENT_VIEW_STATUS.FSTAT_DATE',
    }],
    group: 'FCPID',
    // unlistable: true,
    rowClassName: {
        action: 'sum-row'
    }
}, {
    keyName: 'FCPID',
    name: 'CP ID',
    tableName: 'T_CONTENT_VIEW_SUMMARY',
}, {
    keyName: 'FCPID',
    name: 'CP名称',
    type: 'select',
    tableName: 'T_CONTENT_VIEW_SUMMARY',
    options: CP_SOURCES
},{
    keyName: 'FEXPOSURE_COUNT',
    tableName: 'T_CONTENT_VIEW_SUMMARY',
    name: '曝光量',
    isSum: true
}, {
    keyName: 'FCLICK_COUNT',
    tableName: 'T_CONTENT_VIEW_SUMMARY',
    name: '点击量',
    isSum: true
}, {
    tableName: 'T_CONTENT_VIEW_SUMMARY',
    keyName: 'FVIEW_COUNT',
    name: '浏览量',
    isSum: true,
    maxRed: 'maxExposeAmount'
}, {
    keyName: 'FSTAT_DATE',
    name: '统计月份',
    valueType: 'number',
    unlistable: true
}, {
    keyName: 'FSTATUS',
    name: '状态',
    type: 'select',
    tableName: 'T_CONTENT_VIEW_STATUS',
    options: [{
        name: '下架',
        value: 4
    }, {
        name: '上架',
        value: 1
    }, {
        name: '上架',
        value: null
    }]
}, {
    name: '操作',
    type: 'button',
    buttons: [{
        name: '暂停下发',
        actionName: 'stopDistribute',
        isShow: {
            keyName: 'FSTATUS',
            keyValue: [0,1,null]
        }
    }, {
        name: '恢复下发',
        isDisabled: true,
        isShow: {
            keyName: 'FSTATUS',
            keyValue: 4
        },
        tooltip: {
            title: '下个自然月自动恢复下发'
        }
    }]
}];