module.exports = [{
    name: '作者ID',
    type: 'text',
    keyName: 'FID',
}, {
    name: '名称',
    type: 'text',
    keyName: 'FNAME',
    searchMode: 'LIKE'
}, {
    name: '分类',
    keyName: 'FCATEGORY'
},{
    name: '渠道',
    type: 'select',
    keyName: 'FSUPPORT_BIZ',
    tableName: 'T_CP',
    searchMode: 'bitwise',
    options: [{
        value: 1,
        name: '资讯'
    }, {
        value: 2,
        name: '浏览器'
    }, {
        value: 3,
        name: '趣视频'
    }, {
        value: 4,
        name: '钱包'
    }]
},{
    name: '作者详情',
    type: 'select',
    keyName: 'FOPEN_TYPE',
    tooltip:'客户端的作者详情页面打开方式',
}, {
    name: '内容类型',
    type: 'select',
    keyName: 'FCONTENT_SIGN'
}, {
    name: '星级',
    keyName: 'FRECOMMEND_STAR',
    type: 'rate',
    defaultValue: 5
}];