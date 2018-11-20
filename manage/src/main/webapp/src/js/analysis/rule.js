/**
 * config rule
 */
var config = {
    fileds: [
        {
            name:'id',
            text:'序号',
            type:'number',
            actions:['list','search']
        },
        {
            name: 'regexp',
            text: '表达式',
            type: 'text',
            checkType: 'required',
            actions: ['add','upd','list','search']
        },
        {
            name: 'status',
            text: '状态',
            type: 'select',
            enumName:'RULE_STATUS',
            actions: ['upd','list','search']
        },
        {
            name: 'remark',
            text: '备注',
            type: 'text',
            actions: ['add','upd','list']
        },
        {
            name: 'createTime',
            text: '创建时间',
            type: 'time',
            actions: ['list']
        },
        {
            name: 'updateTime',
            text: '更新时间',
            type: 'time',
            actions: ['list']
        }
    ],
    pageNumber: 10,
    actions: [
        {action: 'search', text: '查询', url: '/service/rule/list', clz: 'info'},
        {action: 'add', text: '添加', url: '/service/rule/add', clz: 'info'},
        {action: 'info', text: '详情', url: '/service/rule/info', isHide: true},
        {
            action: 'rsupd',
            text: '配置脚本',
            single: 'true',
            clz: 'info',
            url: '/service/rule/script/upd',
            selectChild: {
            	pageUrl: '/page/analysis/script?pageNumber=1000',
            	dataUrl: '/service/rule/script/list',
            	parentId: 'ruleId'
            }
        },
        {action: 'upd', text: '修改', url: '/service/rule/upd', clz: 'info'},
        {action: 'del', text: '删除', url: '/service/rule/del', clz: 'danger'}
    ],
    positions: [
    	{text: '首页', url: '/page/content/article'},
    	{text: '解析管理'},
    	{text: '规则配置'}
    ]
}

var page=new BasePage();
page.init(config);