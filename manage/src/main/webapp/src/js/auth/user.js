/**
 * config user
 */
var config = {
    fileds: [
        {
            name:'id',
            text:'用户ID',
            checkType: 'number',
            actions:['list']
        },
        {
            name: 'name',
            text: '用户名称',
            type: 'text',
            actions: ['list', 'search']
        },
        {
            name: 'flyme',
            text: '用户帐号',
            type: 'text',
            actions: ['list']
        },
        {
            name: 'email',
            text: '用户邮箱',
            type: 'text',
            actions: ['list']
        },
        {
            name: 'param',
            text: '用户ID/用户帐号/手机号',
            type: 'text',
            actions: ['add']
        },
        {
        	name: 'remark',
        	text: '备注',
        	type: 'text',
        	actions: ['list','add','upd','search']
        },
        {
        	name: 'roleName',
        	text: '角色名称',
        	type: 'text',
        	actions: ['list']
        }],
    actions: [
        {action: 'search', text: '查询', url: '/service/user/list', clz: 'info'},
        {action: 'add', text: '添加', url: '/service/user/add', clz: 'info'},
        {
            action: 'select',
            text: '授权',
            single: 'true',
            clz: 'info',
            url: '/service/user/role/add',
            selectChild: {
            	pageUrl: '/page/auth/role?pageNumber=1000',
            	dataUrl: '/service/user/role/list',
            	parentId: 'userId'
            }
        },
        {action: 'info', text: '详情', url: '/service/user/info', isHide: true},
        {action: 'upd', text: '修改备注', url: '/service/user/upd', clz: 'info'},
        {action: 'del', text: '删除', url: '/service/user/del', clz: 'danger'}
    ],
    pageNumber: 10,
    positions: [
    	{text: '首页', url: '/page/content/article'},
    	{text: '权限管理'},
    	{text: '用户'}
    ]
}

var page =new BasePage();
page.init(config);