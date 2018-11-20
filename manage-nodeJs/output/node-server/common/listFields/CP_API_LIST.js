module.exports = [{
    keyName: 'id',
    name: 'ID',
    isPrimaryKey: true,
    listConfig: {
        api: 'http://om.iflow.meizu.com/service/biz/grab/list',
        argMap: {
            cpId: 'cpId'
        },
        pager: 'fake',
        listMap: 'value'
    },
    deleteConfig: {
        api: 'http://om.iflow.meizu.com/service/biz/grab/del',
        argMap: {
            grabId: {
                keyName: 'id',
                type: 'string'
            }
        },
        isRedirect: true,
        enctype: 'URLENCODED'
    },
}, {
    keyName: 'name',
    name: '名称'
}, {
    keyName: 'url',
    name: 'url',
    width: 800
}, {
    name: '操作',
    type: 'button',
    buttons: [{
        name: '配置',
        link: {
            href: '/v2/page/analysis/cp-transfer/cp-api-list/cp-api-manage',
            argMap: {
                id: 'id',
                cpId: 'cpId'
            }
        }
    }, {
        name: '删除',
        actionName: 'deleteItem'
    }]
}];