// deprecated
const contentTypes = require('../enum/CONTENT_TYPES');
const CP_SOURCES = require('../enum/CP_SOURCES');
module.exports = [{
    name: '内容ID',
    keyName: 'FCONTENT_ID',
    readonly: true,
    isPrimaryKey: true,
    formOrder: 1,
    valueType: 'number',
    width: 160
}, {
    name: 'CP来源',
    keyName: 'FCPID',
    uneditable: true,
    valueType: 'number',
    width: 120,
    type: 'select',
    options: CP_SOURCES
}, {
    name: '内容标题',
    keyName: 'FTITLE',
    valueType: 'string',
    width: 300
}, {
    name: '作者',
    keyName: 'FAUTHOR',
    valueType: 'string'
}, {
    name: '类型',
    keyName: 'FCATEGORY',
}, {
    name: '标签',
    keyName: 'FTAG'
}, {
    name: '关键字',
    keyName: 'FKEYWORDS'
}, {
    name: '类型',
    keyName: 'FTYPE',
    type: 'select',
    options: contentTypes,
    width: 70
}, {
    name: '评论量',
    keyName: 'FCOMMENT_COUNT',
    uneditable: true,
}, {
    name: '上架时间',
    keyName: 'FRELEASE_TIME',
    uneditable: true,
    type: 'date',
    width: 170
}, {
    name: '状态',
    keyName: 'FSTATUS',
    width: 70
}, {
    name: '操作',
    type: 'dropdown-button',
    buttons: [{
        name: '编辑',
        actionType: 'click',
        actionName: 'toggleContentEditModal',
        overlay: {
            menu: [{
                name: 'url',
                key: 'makeUrl'
            }],
            actionName: 'contentOverlay'
        }
    }]
}];