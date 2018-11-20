const STATUS = require('../enum/ANALYSIS_RULE_STATUS');
module.exports = [{
    name: '序号',
    keyName: 'id',
}, {
    name: '表达式',
    keyName: 'regexp',
}, {
    name: '状态',
    keyName: 'status',
    type: 'select',
    options: STATUS
}];