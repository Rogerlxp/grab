const DISTRIBUTION_STYLES = require('../enum/DISTRIBUTION_STYLES');
const DISTRIBUTION_OPEN_TYPE = require('../enum/DISTRIBUTION_OPEN_TYPE');
module.exports = [{
    keyName: 'FID',
    isPrimaryKey: true
},{
    name: '分发ID',
    keyName: 'FDISID',
},{
    name: '列表样式',
    keyName: 'FDISPLAY_STYLE',
    options: DISTRIBUTION_STYLES,
    type: 'select',
    defaultValue: 3
},{
    name: '内容ID',
    keyName: 'FCONTENT_ID',
},{
    name: '详情打开方式',
    keyName: 'FOPEN_TYPE',
    type: 'select',
    options: DISTRIBUTION_OPEN_TYPE
},{
    name: '详情地址',
    keyName: 'FOPEN_URL',
    isShow: {
        keyName: 'FOPEN_TYPE',
        value: [3]
    }
},{
    name: '更新时间',
    keyName: 'FUPDATE_TIME',
    type: 'update-time',
    unlistable: true
},{
    name: '创建时间',
    keyName: 'FCREATE_TIME',
    type: 'create-time',
    unlistable: true
}];
