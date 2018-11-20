module.exports = [{
    keyName: 'id',
    name: '角色ID',
    isPrimaryKey: true,
    title: '选择角色',
    listConfig: {
        api: 'http://om.iflow.meizu.com/service/role/list',
        staticArg: {
            isOperate: false,
            isBatch: true,
            isSelect: true
        }
    },
    selectedConfig: {
        api: 'http://om.iflow.meizu.com/service/user/role/list',
        argMap: {
            userId: 'id'
        }
    },
    updateConfig: {
        api: 'http://om.iflow.meizu.com/service/user/role/add',
        argMap: {
            id: 'id'
        }
    },
    selectionType: 'radio'
}, {
    keyName: 'name',
    name: '角色名称'
}, {
    keyName: 'roleCode',
    name: '角色编码',
}, {
    keyName: 'level',
    name: '角色级别'
}, {
    keyName: 'description',
    name: '角色描述'
}];