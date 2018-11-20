const READER_CONTENT_TYPE = require('../enum/READER_CONTENT_TYPES');
module.exports = [{
    name: '文章ID',
    keyName: 'id',
    readonly: true,
    isPrimaryKey: true,
    valueType: 'string'
},{
    name: '文章标题',
    keyName: 'name',
    link: {
        keyName: 'contentUrl',
        target: '_blank'
    }
},{
    name: '作者',
    keyName: 'author',
},{
    name: '分类',
    keyName: 'category'
},{
    name: '内容CP',
    keyName: 'cp'
},{
    name: '内容类型',
    keyName: 'type',
    type: 'select',
    options: READER_CONTENT_TYPE,
}, {
    name: '发布时间',
    keyName: 'publishDate',
    type: 'date'
}];
