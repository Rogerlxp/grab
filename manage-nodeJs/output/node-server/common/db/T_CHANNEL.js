const CHANNEL = require('../enum/CHANNEL');
module.exports = [{
    name: '渠道ID',
    keyName: 'FCHANNEL_ID',
    type: 'select',
    options: CHANNEL,
    isShowRawValue: true
}, {
    name: '渠道名称',
    keyName: 'FNAME'
},{
    name: '频道ID',
    keyName: 'FID',
    isPrimaryKey: true,
    isAutoGen: true
}, {
    name: '频道名称',
    keyName: 'FCNAME'
},{
    name: '状态',
    keyName: 'FSTATUS',
    type: 'select',
    options: [{
        name: '失效',
        value: 0
    },{
        name: '生效',
        value: 1
    }],
    unlistable: true
},{
    name: '备注',
    keyName: 'FREMARK'
},
// {
//     name: '创建时间',
//     keyName: 'FCREATE_TIME',
//     type: 'create-time'
// },{
//     name: '更新时间',
//     keyName: 'FUPDATE_TIME',
//     type: 'update-time'
// }
];