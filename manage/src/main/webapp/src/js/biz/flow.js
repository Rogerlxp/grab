/**
 * biz flow
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
        	name: 'biz',
            text: '业务',
            type: 'select',
            enumName: 'BIZ',
            checkType: 'required',
            actions:['add','upd','list']
        },
        {
        	name: 'cp',
            text: 'CP',
            type: 'select',
            enumName: 'FLOW_SOURCE',
            checkType: 'required',
            actions:['add','upd','list']
        },
/*        {
        	name: 'channal',
            text: '频道',
            type: 'select',
            enumName: '/service/common/channals',
            enumId: 'channalId',
            enumText: 'channalName',
            enumParent: 'cp',
            checkType: 'required',
            actions:['add','upd']
        },
        {
        	name: 'channalName',
            text: '频道',
            type: 'text',
            actions:['list']
        },*/
        {
        	name: 'url',
            text: '请求地址',
            type: 'text',
            actions:['list']
        }
    ],
    pageNumber: 10,
    actions: [
    	{action: 'search', text: '查询', url: '/service/biz/flow/list', clz: 'info'},
        {action: 'add', text: '添加', url: '/service/biz/flow/add', clz: 'info'},
        {action: 'info', text: '详情', url: '/service/biz/flow/info', isHide: true},
        {action: 'upd', text: '修改', url: '/service/biz/flow/upd', clz: 'info', isHide: true},
        {action: 'del', text: '删除', url: '/service/biz/flow/del', clz: 'danger'}
    ],
    positions: [
    	{text: '首页', url: '/page/biz/flow'},
    	{text: '业务管理'},
    	{text: '内容源配置'}
    ]
}

var page=new BasePage();
page.init(config);