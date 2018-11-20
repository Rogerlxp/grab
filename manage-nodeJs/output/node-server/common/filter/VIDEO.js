const CP_SOURCES = require('../enum/CP_SOURCES');
const CONTENT_STATUS = require('../enum/CONTENT_STATUS');
const VIDEO_CP_SOURCES = require('../enum/VIDEO_CP_SOURCES');
module.exports = [{
    name: '内容平台ID',
    keyName: 'id'
},{
    name: 'CP内容ID',
    keyName: 'cpEntityId'
},{
    name: '标题',
    keyName: 'title'
},{
    name: '作者',
    keyName: 'author'
},{
    name: '分类',
    keyName: 'category'
},{
    name: '关键字',
    keyName: 'keywords',
    placeholder: '多个以英文逗号隔开'
},{
    name: '内容来源',
    keyName: 'cpId',
    type: 'select',
    options: VIDEO_CP_SOURCES,
    defaultValue: [200],
    mode: 'multiple',
    status: 'hide'
}, {
    name: '状态',
    keyName: 'status',
    type: 'select',
    options: [{
        name: '上架',
        value: 1
    }, {
        name: '下架',
        value: 2
    }],
    defaultValue: 1
},{
    name: '发布时间',
    keyName: 'publishTime',
    type: 'date',
    placeholder: '选择开始时间至今',
    sendFormat: 'M/D/YYYY',
    notSendIfEmpty: true
}
// {
//     name: '时间范围',
//     keyName: 'scope',
//     type: 'select',
//     defaultValue: 1,
//     options: [{
//         name: '1日',
//         value: 1
//     }, {
//         name: '3日',
//         value: 3
//     }, {
//         name: '7日',
//         value: 7
//     }, {
//         name: '15日',
//         value: 15
//     }, {
//         name: '30日',
//         value: 30
//     }, {
//         name: '自定义',
//         value: -1
//     }]
// },{
//     name: '时间',
//     keyName: 'scopeRange',
//     keyNames: ['customScope_start', 'customScope_end'],
//     type: 'dateRange',
//     isShow: {
//         keyValue: -1,
//         keyName: 'scope',
//         isRequired: true
//     }
// },
// {
//     name: '排序',
//     keyName: 'order',
//     type: 'select',
//     defaultValue: null,
//     options: [{
//         name: '浏览量',
//         value: 'viewCount'
//     }, {
//         name: '上架时间',
//         value: 'putdate'
//     }, {
//         name: '转化率',
//         value: 'conversionV1'
//     }]
// }
];