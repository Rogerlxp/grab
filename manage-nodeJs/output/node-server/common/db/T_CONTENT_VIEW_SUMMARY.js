const CP_SOURCES = require('../enum/CP_SOURCES');
module.exports = [{
    isPrimaryKey: true,
    name: '统计ID',
    keyName: 'FID',
    unlistable: true,
    rowClassName: {
        action: 'isFreeOrNotRow'
    }
}, {
    name: '业务渠道',
    keyName: 'BIZ_TYPE',
    type: 'select',
    options: [{
        name: '资讯',
        value: 1
    }, {
        name: '浏览器',
        value: 2
    }],
}, {
    keyName: 'FCPID',
    name: 'CP ID',
},{
    keyName: 'FCPID',
    name: 'CP 名称',
    type: 'select',
    options: CP_SOURCES,
}, {
    keyName: 'FSTAT_DATE',
    name: '统计月份',
    valueType: 'number',
    unlistable: true,
}, {
    keyName: 'FRECOM_TYPE',
    name: '算法'
}, {
    keyName: 'FEXPOSURE_COUNT',
    name: '曝光量'
}, {
    keyName: 'FCLICK_COUNT',
    name: '点击量'
}, {
    keyName: 'FVIEW_COUNT',
    name: '浏览量'
}, {
    keyName: 'FUPDATE_TIME',
    name: '更新时间',
    type: 'update-time',
    unlistable: true
}];