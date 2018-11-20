/**
 * config param
 */
var config = {
    fileds: [
        {
            name:'id',
            text:'序号',
            type:'number',
            actions:['list']
        },
        {
            name: 'type',
            text: '类型',
            type: 'text',
            checkType: 'required',
            actions: ['upd', 'add','list', 'search']
        },
        {
            name: 'key',
            text: '键',
            type: 'text',
            checkType: 'required',
            actions: ['upd', 'add','list','search']
        },
        {
            name: 'value',
            text: '值',
            type: 'text',
            checkType: 'required',
            actions: ['upd', 'add','list']
        },
        {
            name: 'name',
            text: '名称',
            type: 'text',
            checkType: 'required',
            actions: ['upd', 'add','list','search']
        },
        {
            name: 'description',
            text: '描述',
            type: 'textarea',
            actions: ['upd', 'add','list']
        },
        {
            name: 'canModify',
            text: '是否可修改',
            type: 'select',
            enumName: 'YES_NO',
            actions: ['info']
        }
    ],
    pageNumber: 10,
    actions: [
        {action: 'search', text: '查询', url: '/service/param/list', clz: 'info'},
        {action: 'add', text: '添加', url: '/service/param/add', clz: 'info'},
        {action: 'info', text: '详情', url: '/service/param/info', isHide: true},
        {action: 'upd', text: '修改', url: '/service/param/upd', clz: 'info'},
        {action: 'del', text: '删除', url: '/service/param/del', clz: 'danger'}
    ],
    positions: [
    	{text: '首页', url: '/page/content/article'}, 
    	{text: '设置管理'},
    	{text: '系统参数'}
    ]
}

new BasePage().init(config);