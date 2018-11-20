const CP_SOURCE = require('../enum/CP_SOURCES');
const CONTENT_TYPE = require('../enum/CONTENT_TYPES');
const READER_CONTENT_TYPE = require('../enum/READER_CONTENT_TYPES');
const DISTRIBUTION_STYLE = require('../enum/DISTRIBUTION_STYLES');
const SYSTEM = require('../SYSTEM');
const URL = require('../URL');
module.exports = [{
    name: '文章ID',
    keyName: 'id',
    readonly: true,
    isPrimaryKey: true,
    valueType: 'string',
    // rowClassName: {
    //     action: 'highlightAddedDistribution'
    // }
}, {
    name: 'CP文章ID',
    keyName: 'cpEntityId',
    unlistable: true,
},{
    name: '文章标题',
    keyName: 'name',
    link: {
        // prefix: URL.redirectCpContent.value,
        // query: {
        //     key: 'id',
        //     value: 'id'
        // },
        keyName: 'contentUrl',
        target: '_blank'
    }
},{
    name: '作者',
    keyName: 'author',
}, {
    name: '内容CP',
    keyName: 'cpId',
    type: 'select',
    options: CP_SOURCE
}, {
    name: '内容类型',
    keyName: 'type',
    type: 'select',
    options: READER_CONTENT_TYPE,
}, {
    name: '热度',
    keyName: 'hotIndex',
    valueType: 'number'
}, {
    name: '样式',
    keyName: 'displayStyle',
    type: 'select',
    options: DISTRIBUTION_STYLE
}, {
    name: '发布时间',
    keyName: 'publishDate',
    type: 'date'
}, {
    name: '顺序',
    keyName: 'fliterOrder',
    unlistable: true
},{
    name: '操作',
    type: 'button',
    buttons: [{
        name: '取消置顶',
        actionName: 'pullDownFromDis',
        isShow: {
            keyName: 'fliterOrder',
            isNotEqual: true,
            keyValue: [0,1]
        }
    },{
        name: '置顶',
        actionName: 'pushUpItemFromDis',
        isShow: {
            keyName: 'fliterOrder',
            keyValue: [0,1]
        }
    },{
        name: '样式',
        actionName: 'setItemStyleFromDis',
        // isShow: function(item){
        //     return item.fliterStatus === 1;
        // }
    },
    // {
    //     name: '移除',
    //     actionName: 'deleteItemFromDis',
    //     isShow: function(item){
    //         return item.fliterOrder !== 0;
    //     }
    // },
    {
        name: '移除',
        actionName: 'blockItemFromDis',
        isDropdown: true
    }]
}];
