/**
 * config script
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
            name: 'name',
            text: '名称',
            type: 'text',
            checkType: 'required',
            actions: ['add','list','search']
        },
        {
            name: 'type',
            text: '类型',
            type: 'select',
            checkType: 'required',
            enumName:'SCRIPT_TYPE',
            actions: ['add','list','search']
        },
        {
            name: 'path',
            text: '路径',
            type: 'file',
            actions: ['add','list']
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
    size: '5MB',
    batchFields: ['id','type'],
    actions: [
        {action: 'search', text: '查询', url: '/service/script/list', clz: 'info'},
        {action: 'add', text: '添加', url: '/service/script/add', clz: 'info'},
        {action: 'info', text: '详情', url: '/service/script/info', isHide: true},
        {action: 'del', text: '删除', url: '/service/script/del', clz: 'danger'}        
    ],
    positions: [
    	{text: '首页', url: '/page/content/article'},
    	{text: '解析管理'},
    	{text: '脚本配置'}
    ]
}

var page=new BasePage();
page.init(config);