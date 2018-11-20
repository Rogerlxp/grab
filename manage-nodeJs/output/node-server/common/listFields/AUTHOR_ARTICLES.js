module.exports = [{
    name: '文章ID',
    keyName: 'id',
    isPrimaryKey: true,
    listConfig: {
        pager: 'more'
    }
}, {
    name: '标题',
    keyName: 'title',
    link: {
        keyName: 'h5Url'
    },
},{
    name: '作者',
    keyName: 'author'
}, {
    name: '作者ID',
    keyName: 'authorId'
}, {
    name: '链接',
    keyName: 'h5Url',
    unlistable: true
}];