module.exports = [{
    keyName: 'FID',
}, {
    name: '分发ID',
    keyName: 'FDISID',
}, {
    keyName: 'FCONTENT_ID',
    isPrimaryKey: true
},{
    name: '顺序',
    keyName: 'FORDER'
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