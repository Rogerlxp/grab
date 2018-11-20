/**
 * config res
 */
var config = {
    fileds: [
        {
            name:'id',
            text:'资源ID',
            type:'number',
            actions:['list']
        },
        {
            name: 'name',
            text: '资源名称',
            type: 'text',
            checkType: 'required',
            actions: ['upd', 'add','list','search']
        },
        {
            name: 'resource',
            text: '资源内容',
            type: 'text',
            checkType: 'required',
            actions: ['upd', 'add','list','search']
        },
        {
            name: 'type',
            text: '资源类型',
            type: 'select',
            enumName: '/service/bsdata/list?type=RES_TYPE',
            enumId: 'code',
            enumText: 'name',
            checkType: 'required',
            actions: ['upd', 'add','list','search']
        },
        {
            name: 'moduleName',
            text: '模块名称',
            type: 'select',
            enumName: '/service/bsdata/list?type=RES_MODULE',
            enumId: 'code',
            enumText: 'name',
            checkType: 'required',
            actions: ['upd', 'add','list','search']
        },
        {
            name: 'description',
            text: '资源说明',
            type: 'textarea',
            actions: ['upd', 'add', 'list']
        }],
    actions: [
        {action: 'search', text: '查询', url: '/service/res/list', clz: 'info'},
        {action: 'add', text: '添加', url: '/service/res/add', clz: 'info'},
        {action: 'info', text: '详情', url: '/service/res/info', isHide: true},
        {action: 'upd', text: '修改', url: '/service/res/upd', clz: 'info'},
        {action: 'del', text: '删除', url: '/service/res/del', clz: 'danger'}
    ],
    batchFields: ['id'],
    pageNumber: 10,
    positions: [
    	{text: '首页', url: '/page/content/article'},
    	{text: '权限管理'},
    	{text: '资源'}
    ]
}

new BasePage().init(config);