const {MOVE_RULE_FILE, REFRESH_FUNCTION_CACHE} = require('../API');
module.exports = [{
    name: '规则ID',
    keyName: 'FID',
    isPrimaryKey: true,
    isAutoGen: true,
    readonly: true,
    formOrder: 1,
    informServer: {
        api: REFRESH_FUNCTION_CACHE
    },
    width: 60
}, {
    name: '方法ID',
    keyName: 'FFUNCTION_ID',
    readonly: true,
    valueType: 'number',
    notNull: true,
    source: {
        from: 'url'
    },
    isRequired: true,
    width: 60
}, {
    name: '网站名称',
    keyName: 'FREMARK',
    notNull: true,
    defaultValue: '',
    isImportUnique: true,
    placeholder: '非常重要，请确保与线上一致'
}, {
    name: '网址匹配规则',
    keyName: 'FPATTERN',
    isRequired: true,
    width: 200,
}, {
    name: 'JavaScript',
    keyName: 'FCONTENT',
    isRequired: true,
    type: 'textarea',
    width: 200
    // quota: 1,
    // type: 'file',
    // accept: 'application/javascript',
    // reInvoke: {
    //     api: MOVE_RULE_FILE,
    //     argMap: [{
    //         keyName: 'propertyName',
    //         value: 'content',
    //     }, {
    //         keyName: 'tmpPath',
    //         source: 'url'
    //     }]
    // }
}, {
    name: 'JS方法名',
    keyName: 'FMETHOD',
    isRequired: true,
    isImportUnique: true,
    width: 100
}, {
    name: 'CSS样式',
    keyName: 'FCSS',
    type: 'textarea',
    width: 200
    // type: 'file',
    // quota: 1,
    // accept: 'text/css',
    // reInvoke: {
    //     api: MOVE_RULE_FILE,
    //     argMap: [{
    //         keyName: 'propertyName',
    //         value: 'css',
    //     }, {
    //         keyName: 'tmpPath',
    //         source: 'url'
    //     }]
    // }
}, {
    name: '图片过滤规则',
    keyName: 'FEXT_PATTERN',
    notNull: true,
    type: 'textarea',
    width: 200
    // type: 'file',
    // accept: 'application/javascript',
    // reInvoke: {
    //     api: MOVE_RULE_FILE,
    //     argMap: [{
    //         keyName: 'propertyName',
    //         value: 'content',
    //     }, {
    //         keyName: 'tmpPath',
    //         source: 'url'
    //     }]
    // }
}, {
    name: '状态',
    keyName: 'FSTATUS',
    defaultValue: 1,
    type: 'select',
    isRequired: true,
    options: [{
        name: '下架',
        value: 0
    }, {
        name: '上架',
        value: 1
    }, {
        name: '待验证',
        value: 2
    }]
}, {
    name: '创建时间',
    keyName: 'FCREATE_TIME',
    type: 'create-time',
}, {
    name: '更新时间',
    keyName: 'FUPDATE_TIME',
    type: 'update-time',
},{
    name: '操作',
    type: 'button',
    buttons: [{
        name: '编辑',
        actionType: 'click',
        actionName: 'toggleContentEditModal'
    }, {
        name: '删除',
        actionType: 'click',
        actionName: 'deleteItem'
    }]
}];