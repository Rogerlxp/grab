module.exports = [{
    name: '转码ID',
    keyName: 'FID'
}, {
    name: '方法名称',
    keyName: 'FFUNCTION'
}, {
    name: '导入',
    type: 'button',
    icon: 'download',
    actionName: 'import',
    args: {
        tableName: 'T_FUNCTION_RULE'
    }
}, {
    name: '导出',
    type: 'button',
    icon: 'upload',
    actionName: 'export',
    args: {
        tableName: 'T_FUNCTION_RULE'
    }
}];