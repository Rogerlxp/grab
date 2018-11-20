/**
 * config bsdata
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
            name: 'name',
            text: '简体名称',
            type: 'text',
            checkType: 'required',
            actions: ['add','upd','list','search']
        },
        {
            name: 'nameEn',
            text: '英文名称',
            type: 'text',
            actions: ['add','upd','list']
        },
        {
            name: 'nameCht',
            text: '繁体名称',
            type: 'text',
            actions: ['add','upd','list']
        },
        {
            name: 'code',
            text: '编码',
            type: 'text',
            checkType: 'required',
            actions: ['add','upd','list','search']
        },
        {
            name: 'type',
            text: '类型',
            type: 'select',
            enumName:'/service/bsdata/type/list',
            enumId: 'typeCode',
            enumText: 'typeName',
            checkType: 'required',
            actions: ['add','upd','list', 'search']
        },
        {
            name: 'sortOrder',
            text: '排序号',
            type: 'number',
            checkType: 'required',
            actions: ['add','upd','list']
        },
        {
            name: 'level',
            text: '级别',
            type: 'number',
            checkType: 'required',
            actions: ['add','upd','list']
        },
        {
            name: 'isLeaf',
            text: '是否叶子',
            type: 'select',
            enumName:'YES_NO',
            checkType: 'required',
            actions: ['add','upd','list']
        },
        {
            name: 'isHide',
            text: '是否隐藏',
            type: 'select',
            enumName:'YES_NO',
            checkType: 'required',
            actions: ['add','upd','list']
        },
        {
            name: 'isInner',
            text: '是否初始数据',
            type: 'select',
            enumName:'YES_NO',
            checkType: 'required',
            actions: ['list']
        },
        {
            name: 'typeName',
            text: '类型名称',
            type: 'text',
            checkType: 'required',
            actions: ['addtype']
        },
        {
            name: 'typeCode',
            text: '类型编码',
            type: 'text',
            checkType: 'required',
            actions: ['addtype']
        }
    ],
    pageNumber: 10,
    actions: [
        {action: 'search', text: '查询', url: '/service/bsdata/list', clz: 'info'},
        {action: 'add', text: '添加数据', url: '/service/bsdata/add', clz: 'info'},
        {
        	action: 'addtype', text: '添加类型', url: '/service/bsdata/type/add', clz: 'info',
        	callbackFn: function($btn, data){
        		$.post('/service/bsdata/type/add', data, function(bd){
                    if (bd.code == 200) {
                    	manageUtil.alert('添加基础数据类型成功.', false, function(){
                    		page.closeModal();
                            page.optSearch(true);
                        });
                    } else {
                    	MU.alert('添加基础数据类型失败:\n' + bd.message);
                    }
                });
        	}
        },
        {action: 'info', text: '详情', url: '/service/bsdata/info', isHide: true},
        {action: 'upd', text: '修改', url: '/service/bsdata/upd', clz: 'info'},
        {action: 'del', text: '删除', url: '/service/bsdata/del', clz: 'danger'}        
    ],
    positions: [
    	{text: '首页', url: '/page/content/article'},
    	{text: '设置管理'},
    	{text: '基础数据'}
    ]
}

var page=new BasePage();
page.init(config);