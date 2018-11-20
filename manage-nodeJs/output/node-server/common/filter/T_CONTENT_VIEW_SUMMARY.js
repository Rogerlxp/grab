const now = new Date();
const year = now.getFullYear() + '';
let month = now.getMonth() + 1;
if(month < 10){
    month = '0' + month;
}else{
    month += '';
}
module.exports = [{
    keyName: 'FSTAT_DATE',
    name: '统计月份',
    type: 'month-select',
    duration: {
        start: -6,
        end: 0,
        min: '201801'
    },
    defaultValue: year + month
}, {
    keyName: 'BIZ_TYPE',
    name: '业务类型',
    type: 'select'
}, {
    keyName: 'FCPID',
    name: '是否收费来源',
    type: 'select',
    options: 'freeOrNotCP',
    defaultValue: 0,
    searchMode: 'IN'
}, {
    name: '导出CSV',
    type: 'button',
    icon: 'file-excel',
    actionName: 'downloadCSV'
}];