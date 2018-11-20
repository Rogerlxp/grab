/**
 * config role
 */
var config = {
    fileds: [
        {
            name:'id',
            text:'角色ID',
            type:'number',
            actions:['list','grant']
        },
        {
            name: 'name',
            text: '角色名称',
            type: 'text',
            actions: ['list','add','upd','search']
        },
        {
            name: 'roleCode',
            text: '角色编码',
            type: 'text',
            actions: ['list','add','upd','search']
        },
        {
        	name: 'level',
        	text: '角色级别',
        	checkType: 'number',
        	actions: ['list','add','upd']
        },
        {
            name: 'description',
            text: '角色描述',
            type: 'textarea',
            actions: ['list','add','upd']
        }
    ],
    actions: [
        {action: 'search', text: '查询', url: '/service/role/list', clz: 'info'},
        {action: 'add', text: '添加', url: '/service/role/add', clz: 'info'},
        {action: 'info', text: '详情', url: '/service/role/info', isHide: true},
        {action: 'upd', text: '修改', url: '/service/role/upd', clz: 'info'},
        {
            action: 'select',
            text: '授权',
            single: 'true',
            clz: 'info',
            url: '/service/role/res/add',
            selectChild: {
            	pageUrl: '/page/auth/res?pageNumber=1000',
            	dataUrl: '/service/role/res/list',
            	parentId: 'roleId'
            }
        },
        {action: 'del', text: '删除', url: '/service/role/del', clz: 'danger'}
    ],
    batchFields: ['id'],
    pageNumber: 10,
    positions: [
    	{text: '首页', url: '/page/content/article'},
    	{text: '权限管理'},
    	{text: '角色'}
    ]
}

var page = new BasePage();
page.init(config);