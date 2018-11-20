const CP_SOURCES = require('../enum/CP_SOURCES');
const CONTENT_TYPES = require('../enum/CONTENT_TYPES');
const READER_CONTENT_TYPES = require('../enum/READER_CONTENT_TYPES');
const CONTENT_STATUS = require('../enum/CONTENT_STATUS');
const VIDEO_CP_SOURCES = require('../enum/VIDEO_CP_SOURCES');
module.exports = [{
    name: 'ID',
    keyName: 'contentId',
    isPrimaryKey: true,
    isAutoGen: true,
    readonly: true,
    detailConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/biz/contents/info',
        argMap: {
            cpId: 'cpId',
            cpEntityId: 'cpEntityId'
        },
        isRedirect: true
    },
    upsertConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/biz/contents/upd',
        addApi: window.location.protocol + '//om.iflow.meizu.com/service/biz/contents/add',
        method: 'POST',
        isRedirect: true
    },
    addConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/biz/contents/add',
        method: 'POST',
        isRedirect: true
    },
    deleteConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/biz/contents/del',
        argMap: {
            cpId: 'cpId',
            contentId: 'contentId',
            cpEntityId: 'cpEntityId'
        },
        isRedirect: true
    },
    listConfig: {
        api: window.location.protocol + '//om.iflow.meizu.com/service/biz/contents/search',
        pager: {
            page: 'page',
            pageSize: 'limit'
        }
    },
    formOrder: 1,
    width: 150,
    extraEditButtons: [{
        actionName: 'publicVideo',
        name: '发布',
        order: -1,
        disabledIfNotEdited: true
    }],
    beforeSubmit: 'changeVideoStatus'
},{
    name: 'CP内容ID',
    keyName: 'cpEntityId',
    uneditable: true,
    width: 150,
    isForceSend: true
},{
    name: '视频标题',
    keyName: 'title',
    // link: {
    //     keyName: 'h5Url'
    // },
    click: {
        actionName: 'visitContent'
    },
    formOrder: 2,
    width: 350
}, {
    name: '封面预览',
    keyName: 'imgInfo.bigImgInfos[].url',
    type: 'image',
    // valuePath: 'imgInfo.bigImgInfos[].url',
    formOrder: 11
}, {
    name: '作者',
    keyName: 'author',
    readonly: true,
    formOrder: 7,
    width: 150
},{
    name: '作者头像',
    keyName: 'userInfo.img',
    readonly: true,
    formOrder: 8,
    type: 'image',
    unlistable: true
},
// all is video
// {
//     name: '类型',
//     type: 'select',
//     options: READER_CONTENT_TYPES,
//     readonly: true,
//     formOrder: 4
// },
{
    name: '分类',
    keyName: 'category',
    readonly: true,
    formOrder: 4
},
{
    name: '标签',
    type: 'tag',
    readonly: true,
    formOrder: 5
},{
    name: '关键词',
    keyName: 'keyWords',
    readonly: true,
    formOrder: 6
},{
    name: '视频简介',
    keyName: 'desc',
    readonly: true,
    unlistable: true,
    formOrder: 10,
    type: 'textarea'
},{
    name: '内容来源',
    keyName: 'cpId',
    type: 'select',
    options: VIDEO_CP_SOURCES,
    uneditable: true,
    isForceSend: true
},{
    name: 'CP 内容详情',
    keyName: 'h5Url',
    readonly: true,
    unlistable: true,
    formOrder: 12,
    buttons: [{
        icon: 'caret-right',
        actionName: 'previewVideo'
    }]
}, {
    name: '播放地址',
    keyName: 'h5Url',
    readonly: true,
    unlistable: true,
    formOrder: 13,
    buttons: [{
        icon: 'copy',
        actionName: 'copy'
    }]
}, {
    name: '分享地址',
    keyName: 'share_url',
    unlistable: true,
    readonly: true,
    formOrder: 14,
    buttons: [{
        icon: 'copy',
        actionName: 'copy'
    }]
},{
    name: '浏览量',
    keyName: 'viewCount',
    uneditable: true,
},{
    name: '转化率',
    keyName: 'conversionRate',
    uneditable: true,
},{
    name: '评论量',
    keyName: 'commentCount',
    uneditable: true,
}, {
    name: '发布时间',
    keyName: 'publishTime',
    type: 'date',
    readonly: true,
    formOrder: 15,
    timeType: 'unix-time',
    isNotSend: true
}, {
    name: '入库时间',
    keyName: 'createTime',
    readonly: true,
    unlistable: true,
    type: 'date',
    formOrder: 16,
    timeType: 'unix-time',
    isNotSend: true
},{
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
    formOrder: 3
}, {
    name: '作者主页',
    keyName: 'userInfo.homeUrl',
    readonly: true,
    unlistable: true,
    formOrder: 9,
    buttons: [{
        icon: 'copy',
        actionName: 'copy'
    }]
},{
    name:'操作',
    type: 'button',
    buttons: [{
        name: '编辑',
        actionName: 'toggleContentEditModal'
    },
    // {
    //     name: '删除',
    //     actionName: 'deleteItem',
    //     type: 'danger'
    // },
    {
        name: '下架',
        actionName: 'videoOffShelf',
        isShow: {
            keyName: 'status',
            isNotEqual: true,
            keyValue: 2
        }
    }, {
        name: '上架',
        actionName: 'videoOnShelf',
        isShow: {
            keyName: 'status',
            isNotEqual: true,
            keyValue: 1
        }
    }]
}];