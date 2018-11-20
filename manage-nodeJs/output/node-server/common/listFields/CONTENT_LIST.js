const CP_SOURCES = require('../enum/CP_SOURCES');
// const CONTENT_TYPES = require('../enum/CONTENT_TYPES');
const READER_CONTENT_TYPES = require('../enum/READER_CONTENT_TYPES');
const CONTENT_STATUS = require('../enum/CONTENT_STATUS');
module.exports = [{
    keyName: 'crawlUrl',
    name: '一键抓取(仅适用图文类型)',
    isShow: {
        keyName: 'id',
        value: 'empty'
    },
    unlistable: true,
    isNotSend: true,
    formOrder: 0,
    buttons: [{
        name: '抓取',
        actionName: 'crawlUrl'
    }]
}, {
    name: 'ID',
    keyName: 'id',
    width: 130,
    isAutoGen: true,
    isPrimaryKey: true,
    readonly: true,
    formOrder: 1,
    // extraEditButtons: [{
    //     actionName: 'publicArticle',
    //     name: '发布',
    //     order: -1
    // }],
    updateConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/article/editor',
        method: 'post',
        isRedirect: true,
        enctype: 'urlencoded'
    },
    addConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/article/add',
        method: 'post',
        isRedirect: true,
        enctype: 'urlencoded'
    },
    detailConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/article/info',
        isRedirect: true,
        argMap: {
            id: 'id'
        }
    }
}, {
    name: 'CP文章ID',
    keyName: 'uniqueId',
    uneditable: true,
    width: 130,
}, {
    name: '标题',
    keyName: 'title',
    width: 280,
    // link: {
    //     keyName: 'link',
    //     target: '_blank'
    // },
    click: {
        actionName: 'visitContent'
    },
    formOrder: 2,
    hasTooltip: true,
    isRequired: true
}, {
    name: '详情页标题',
    keyName: 'contentTitle',
    unlistable: true,
    formOrder: 3,
    isSentEvenEmpty: true
}, {
    name: '作者',
    keyName: 'author',
    width: 100,
    isSentEvenEmpty: true
}, {
    name: '分类',
    keyName: 'category',
    unlistable: false,
    hasTooltip: true,
    isSentEvenEmpty: true,
}, {
    name: '标签',
    keyName: 'label',
    width: 150,
    hasTooltip: true,
    isSentEvenEmpty: true
}, {
    name: '关键字',
    keyName: 'keywords',
    width: 120,
    placeholder: '英文逗号分割',
    hasTooltip: true,
    isSentEvenEmpty: true
},{
    name: '内容来源',
    keyName: 'resourceType',
    type: 'select',
    options: CP_SOURCES,
    width: 100,
    defaultValue: 4,
    isSentEvenEmpty: true,
    hideWhenEdit: true
}, {
    name: '内容类型',
    keyName: 'type',
    type: 'select',
    options: READER_CONTENT_TYPES,
    isSentEvenEmpty: true,
    defaultValue: 0,
    width: 60,
}, {
    name: 'CP来源',
    keyName: 'cpSource',
    unlistable: true,
    uneditable: true
}, {
    name: '浏览量',
    keyName: 'viewCount',
    uneditable: true
}, {
    name: '评论数',
    keyName: 'commentCount',
    uneditable: true
}, {
    name: '转化率',
    keyName: 'conversionV1',
    uneditable: true
}, {
    name: 'CP上架时间',
    keyName: 'putdate',
    type: 'date',
    uneditable: true,
    unlistable: true,
    width: 150,
}, {
    name: '状态',
    keyName: 'status',
    type: 'select',
    options: CONTENT_STATUS,
    uneditable: true,
    tooltip: {
        keyName: 'checkResult'
    }
}, {
    name: '推送地址',
    keyName: 'pushPath',
    unlistable: true,
    uneditable: true
}, {
    name: '内容',
    keyName: 'content',
    unlistable: true,
    type: 'wysiwyg',
    isSentEvenEmpty: true
}, {
    name: '内容源ID',
    keyName: 'contentSourceId',
    unlistable: true,
    uneditable: true
}, {
    name: 'CP频道ID',
    keyName: 'cpChannelId',
    unlistable: true,
    uneditable: true
}, {
    name: '点击率',
    keyName: 'ctr',
    unlistable: true,
    uneditable: true
}, {
    name: '描述',
    keyName: 'description',
    unlistable: true,
    isSentEvenEmpty: true
}, {
    name: '热度',
    keyName: 'hotV1',
    unlistable: true,
    uneditable: true
}, {
    name: '图片',
    keyName: 'imgUrl',
    type: 'image',
    uneditable: true,
    isBlank: true,
    split: ','
}, {
    name: '列表图片',
    keyName: 'imgUrls',
    unlistable: true,
    type: 'images',
    isSentEvenEmpty: true
}, {
    name: '标签v1',
    keyName: 'labelV1',
    unlistable: true,
    uneditable: true
}, {
    name: '长度',
    keyName: 'length',
    unlistable: true,
    uneditable: true
}, {
    name: '链接',
    keyName: 'link',
    unlistable: true,
    uneditable: true
}, {
    name: '更新日期',
    keyName: 'lmodify',
    unlistable: true,
    uneditable: true
}, {
    name: '位置',
    keyName: 'position',
    unlistable: true,
    uneditable: true
}, {
    name: '发布时间',
    keyName: 'posttime',
    type: 'date',
    uneditable: true
}, {
    name: '开始',
    keyName: 'start',
    unlistable: true,
    uneditable: true
}, {
    name: '次分类',
    keyName: 'subCategory',
    unlistable: true,
    uneditable: true
}, {
    name: '分类',
    keyName: 'topCategory',
    unlistable: true,
    uneditable: true
}, {
    name: '操作',
    type: 'button',
    buttonType: 'link',
    buttons: [{
        name: '编辑',
        actionType: 'click',
        actionName: 'toggleContentEditModal',
        type: 'link',
    }, {
        name: '生成URL',
        actionName: 'makeUrl',
        isDropdown: true
    }, {
        name: '生成Scheme',
        actionName: 'makeScheme',
        isDropdown: true
    }, {
        name: '筛选',
        actionName: 'filter',
        isDropdown: true
    }, {
        name: '下架',
        actionName: 'offShelf',
        isDropdown: true,
        isShow: {
            keyName: 'status',
            keyValue: 1
        }
    }, {
        name: '上架',
        actionName: 'onShelf',
        isShow: {
            keyName: 'status',
            keyValue: [0,7]
        },
        isDropdown: true
    }, {
        name: '分发',
        actionName: 'distribute',
        isDropdown: true
    }]
}];