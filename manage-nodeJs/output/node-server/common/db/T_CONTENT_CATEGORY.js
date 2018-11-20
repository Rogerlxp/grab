module.exports = [{
    keyName: 'FID',
    isPrimaryKey: true
},{
    name: '分类',
    keyName: 'FCATEGORY',
},{
    name: '子分类',
    keyName: 'FSUB_CATEGORY'
},{
    name: '更新时间',
    keyName: 'FUPDATE_TIME',
    type: 'update-time',
    uneditable: true,
    unlistable: true
},{
    name: '创建时间',
    keyName: 'FCREATE_TIME',
    type: 'create-time',
    uneditable: true,
    unlistable: true
}];