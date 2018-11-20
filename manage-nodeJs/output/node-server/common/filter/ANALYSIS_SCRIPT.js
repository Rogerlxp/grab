const SCRIPT_TYPES = require('../enum/RULE_SCRIPT_TYPES');
module.exports = [{
    name: '序号',
    keyName: 'id',
}, {
    name: '名称',
    keyName: 'name',
}, {
    name: '类型',
    keyName: 'type',
    type: 'select',
    options: SCRIPT_TYPES
}];