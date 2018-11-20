const RULE_SCRIPT_TYPES = require('../enum/RULE_SCRIPT_TYPES');
module.exports = [{
    name: 'ID',
    keyName: 'id',
    isPrimaryKey: true
}, {
    name: '名称',
    keyName: 'name',
}, {
    name: '类型',
    type: 'select',
    keyName: 'type',
    options: RULE_SCRIPT_TYPES
}, {
    name: '路径',
    keyName: 'path'
}, {
    name: '创建时间',
    type: 'create-time',
    keyName: 'createTime'
}, {
    name: '更新时间',
    type: 'update-time',
    keyName: 'updateTime'
}];