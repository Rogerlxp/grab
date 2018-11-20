const CP_SOURCES = require('../enum/CP_SOURCES');
const CONTENT_TYPES = require('../enum/CONTENT_TYPES');
const CONTENT_SOURCES = require('../enum/CONTENT_SOURCES');
const CONTENT_STATUS = require('../enum/CONTENT_STATUS');
module.exports = [{
    name: '文章ID',
    keyName: 'id'
}, {
    name: 'CP文章ID',
    keyName: 'uniqueId'
}, {
    name: '文章标题',
    keyName: 'title'
}, {
    name: '作者',
    keyName: 'author'
}, {
    name: '类型',
    keyName: 'category'
}, {
    name: '标签',
    keyName: 'label'
}, {
    name: '关键字',
    keyName: 'keywords'
}, {
    name: '内容CP',
    keyName: 'resourceTypes',
    type: 'select',
    options: CP_SOURCES,
    mode: 'multiple',
    defaultValue: [null]
}, {
    name: '内容源',
    keyName: 'contentSourceIdParam',
    type: 'select',
    options: CONTENT_SOURCES,
    isShow: {
        type: 'condition',
        keyName: 'resourceTypes',
        value: 4
    },
    
}, {
    name: '内容类型',
    type: 'select',
    keyName: 'type',
    options: CONTENT_TYPES,
    defaultValue: null
}, {
    name: '状态',
    keyName: 'status',
    type: 'select',
    options: CONTENT_STATUS,
    defaultValue: 1
}, {
    name: '时间范围',
    keyName: 'scope',
    type: 'select',
    defaultValue: null,
    options: [{
        name: '1日',
        value: 1
    }, {
        name: '3日',
        value: 3
    }, {
        name: '7日',
        value: 7
    }, {
        name: '15日',
        value: 15
    }, {
        name: '30日',
        value: 30
    }, {
        name: '自定义',
        value: -1
    }]
},
{
    name: '时间',
    keyName: 'scopeRange',
    keyNames: ['customScope_start', 'customScope_end'],
    type: 'dateRange',
    isShow: {
        type: 'condition',
        value: -1,
        keyName: 'scope',
        isRequired: true
    }
}];