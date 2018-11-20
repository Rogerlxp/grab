module.exports = [{
    name: 'CP ID',
    keyName: 'FID',
    isPrimaryKey: true,
    readonly: true,
    isAutoGen:true,
}, {
    name: 'CP名称',
    keyName: 'FCPNAME',
}, {
    name: 'CP英文简称',
    keyName: 'FENNAME',
    unlistable: true
}, {
    name: '内容源URL',
    keyName: 'FURL',
    unlistable: true
}, {
    name: '内容源图标',
    keyName: 'FICO_URL',
    unlistable: true
}, {
    name: '入库类型',
    keyName: 'FCONTENT_OBTAIN_TYPE',
    type: 'select',
    valueType: 'bit',
    mode: 'multiple',
    joinSymbol: '+',
    options: [{
        name: '个性化算法',
        value: 0
    },{
        name: '搜索下发',
        value: 1
    },{
        name: '内容同步',
        value: 2
    },{
        name: '爬虫入库',
        value: 3
    }]
}, {
    name: '新闻内容正则表达式',
    keyName: 'FEXPRESSIONS',
    unlistable: true
}, {
    name: '备注',
    keyName: 'FDESCRIPTION'
}, {
    name: '状态',
    keyName: 'FSTATUS',
    type: 'select',
    options: [{
        name: '已下架',
        value: 0
    }, {
        name: '已上架',
        value: 1
    }]
}, {
    name: '源内容类型',
    keyName: 'FTYPE',
    unlistable: true,
}, {
    name: '发布方式',
    keyName: 'FAUTOMATIC_CAPTURE',
    type: 'select',
    options: [{
        name: '手动发布',
        value: 0
    }, {
        name: '自动发布',
        value: 1
    }],
    unlistable: true,
},{
    name: '源星级',
    keyName: 'FLEVEL',
    unlistable: true,
}, {
    name: '接口类路径',
    keyName: 'FCLASS_PATH',
    unlistable: true,
}, {
    name: 'CP支持的业务',
    keyName: 'FSUPPORT_BIZ',
    valueType: 'bit',
    mode: 'multiple',
    type: 'select',
    options: [{
        name: '全部',
        value: 0
    }, {
        name: '资讯',
        value: 1
    }, {
        name: '浏览器',
        value: 2
    }, {
        name: '趣视频',
        value: 3
    }],
    unlistable: true,
}, {
    name: '入库类型',
    keyName: 'FINSERT_TYPE',
    valueType: 'bit',
    mode: 'multiple',
    type: 'select',
    options: [{
        name: 'CP库',
        value: 0
    }, {
        name: '内容库',
        value: 1
    }, {
        name: '作者库',
        value: 2
    }],
    unlistable: true
}, {
    name: '更新时间',
    keyName: 'FUPDATE_TIME',
    type: 'update-time',
    unlistable: true,
}, {
    name: '创新时间',
    keyName: 'FCREATE_TIME',
    type: 'create-time',
    unlistable: true,
}, {
    name: '操作',
    type: 'button',
    buttons: [{
        name: '下架',
        actionName: 'offlineCP',
        isShow: {
            keyName: 'FSTATUS',
            keyValue: 1
        }
    }, {
        name: '上架',
        actionName: 'onlineCP',
        isShow: {
            keyName: 'FSTATUS',
            keyValue: 0
        }
    }]
}];