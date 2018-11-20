module.exports = [{
    name: '规则ID',
    type: 'text',
    keyName: 'FID'
},{
    name: '网站名称',
    type: 'text',
    keyName: 'FSITE_NAME',
    searchMode: 'LIKE'
}, {
    name: '调试',
    type: 'button',
    icon: 'code-o',
    actionName: 'openCrawlTester'
}, {
    name: '导入',
    type: 'button',
    icon: 'download',
    actionName: 'import'
}, {
    name: '导出',
    type: 'button',
    icon: 'upload',
    actionName: 'export'
}];