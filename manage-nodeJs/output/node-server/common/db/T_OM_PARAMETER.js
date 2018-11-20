module.exports = [{
    name: 'ID',
    keyName: 'FID',
    isPrimaryKey: true,
    isAutoGen: true
}, {
    name: '类型',
    keyName: 'FTYPE',
},{
    name: '键',
    keyName: 'FKEY'
},{
    name: '值',
    keyName: 'FVALUE'
},{
    name: '名字',
    keyName: 'FNAME'
},{
    name: '参数说明',
    keyName: 'FDESCRIPTON'
},{
    name: '能否修改',
    keyName: 'FCAN_MODIFY',
    type: 'select',
    options: [{
        name: '不能修改',
        value: 0
    },{
        name: '可以修改',
        value: 1
    }]
}];