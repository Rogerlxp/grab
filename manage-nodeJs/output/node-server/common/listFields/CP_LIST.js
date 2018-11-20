module.exports = [{
    keyName: 'cpId',
    name: 'CP ID',
    isPrimaryKey: true,
    readonlyWhenEdit: true,
    isRequired: true,
    placeholder: '仅限数字类型',
    valueType: 'number',
    listConfig: {
        api: 'http://om.iflow.meizu.com/service/biz/cp/list',
        listMap: 'value',
        totalMap: false,
        pager: 'fake'
    },
    addConfig: {
        api: 'http://om.iflow.meizu.com/service/biz/cp/add',
        isRedirect: true
    },
    detailConfig: {
        api: 'http://om.iflow.meizu.com/service/biz/cp/detail',
        isRedirect: true,
        argMap: {
            cpId: 'cpId'
        }
    },
    updateConfig: {
        api: 'http://om.iflow.meizu.com/service/biz/cp/update',
        isRedirect: true
    },
    deleteConfig: {
        api: 'http://om.iflow.meizu.com/service/biz/cp/del',
        isRedirect: true,
        argMap: {
            cpId: 'cpId'
        },
        method: 'get'
    }
}, {
    keyName: 'name',
    name: 'CP名称',
    isRequired: true,
}, {
    keyName: 'enName',
    name: '简称',
    isRequired: true,
}, {
    keyName: 'description',
    name: '备注'
}, {
    name: '操作',
    type: 'button',
    buttons: [{
        name: '编辑',
        actionName: 'toggleContentEditModal'
    }, {
        name: '接口列表',
        link: {
            href: '/v2/page/analysis/cp-transfer/cp-api-list',
            argMap: {
                cpId: 'cpId'
            }
        }
    },{
        name: '删除',
        actionName: 'deleteItem'
    }]
}];