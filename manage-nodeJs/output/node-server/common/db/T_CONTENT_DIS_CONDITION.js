const contentType = require('../enum/CONTENT_TYPES');
module.exports = [{
    keyName: 'FID',
    isPrimaryKey: true
}, {
    name: '分发id',
    keyName: 'FDISID'
},{
    name: '内容类型',
    keyName: 'FTYPE',
    options: contentType
},{
    name: '一级分类名称',
    keyName: 'FCATEGORY',
},{
    name: '二级分类名称',
    keyName: 'FSUB_CATEGORY',
},{
    name: '分类ID',
    keyName: 'FCATEGORYID',
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