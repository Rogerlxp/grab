const CP_SOURCES = require('../enum/CP_SOURCES');
module.exports = [{
    name: 'id',
    keyName: 'FID',
    readonly: true,
    isPrimaryKey: true,
    formOrder: 1,
    valueType: 'number',
    echoServer: {
        url: 'http://om.iflow.meizu.com/service/author/upd',
        args: [{
            keyName: 'FID',
            argName: 'id'
        }]
    },
    isNeedDistinct: true,
    join: [{
        table: 'T_AUTHOR_CP_MAPPING',
        on: 'T_AUTHOR_CP_MAPPING.FAUTHOR_ID=T_AUTHOR.FID',
        type: 'INNER JOIN'
    }, {
        table: 'T_CP',
        on: 'T_CP.FID=T_AUTHOR_CP_MAPPING.FCPID',
        type: 'INNER JOIN'
    }]
}, {
    name: '头像',
    keyName: 'FIMG',
    type: 'image',
    formOrder: 3,
    notSortable: true,
    valueType: 'string'
}, {
    name: '名称',
    keyName: 'FNAME',
    readonly: true,
    formOrder: 2,
    valueType: 'string',
    width: 150,
    click: {
        actionName: 'searchAuthor'
    }
},{
    name: '分类',
    keyName: 'FCATEGORY'
},{
    name: 'CP来源',
    keyName: 'FCPID',
    type: 'select',
    options: CP_SOURCES,
    readonly: true,
    formOrder: 3,
},{
    name: '简介',
    keyName: 'FDESC',
    type: 'textarea',
    valueType: 'string',
    formOrder: 4,
    width: 500
},{
    name: '文章数',
    keyName: 'FARTICLE_COUNT',
    uneditable: true,
    valueType: 'number',
    sortable: true
},{
    name: '视频数',
    keyName: 'FVIDEO_COUNT',
    uneditable: true,
    sortable: true
},{
    name: '作者详情', // 打开方式，1是使用魅族API打开，2是用H5打开
    keyName: 'FOPEN_TYPE',
    type: 'select',
    options: [{
        value: 1,
        name: '魅族'
    }, {
        value: 2,
        name: 'CP'
    }],
    formOrder: 7
}, {
    name: '星级',
    keyName: 'FRECOMMEND_STAR',
    formOrder: 6,
    type: 'rate',
    listType: 'text'
},{
    name: '热度',
    keyName: 'FHOT',
    uneditable: true,
    sortable: true
},{
    name: '内容类型',
    keyName: 'FCONTENT_SIGN',
    uneditable: true,
    // unlistable: true,
    type: 'select',
    options: [{
        name: '文章',
        value: 1
    }, {
        name: '视频',
        value: 2
    }, {
        name: '文章/视频',
        value: 3
    }]
},{
    name: '状态',
    keyName: 'FSTATUS',
    type: 'select',
    valueType: 'number',
    options: [{
        name: '下架',
        value: 0
    },{
        name: '上架',
        value: 1
    }],
    formOrder: 5,
},{
    name: '创建时间',
    keyName: 'FCREATE_TIME',
    type: 'date',
    uneditable: true,
    unlistable: true
},{
    name: '操作',
    type: 'button',
    buttons: [{
        name: '编辑',
        actionType: 'click',
        actionName: 'toggleContentEditModal'
    }, {
        name: '预览',
        // isDropdown: true,
        actionName: 'viewAuthorArticleList'
    }]
}];