export default {
    id: {
        name: '规则id',
        isRequired: false,
        placeholder: '不必填写',
        type: 'text',
        isDisabled: true,
        isEmptyHide: true,
    },
    siteName: {
        name: '网站名称',
        isRequired: true,
        placeholder: '例如：凤凰网',
        type: 'text'
    },
    host: {
        name: '网站地址',
        isRequired: true,
        placeholder: '例如：www.baidu.com，只写域名即可',
        type: 'text',
        checkType: 'url'
    },
    titleRule: {
        name: '标题',
        isRequired: false,
        placeholder: '例如：h1#title',
        type: 'text'
    },
    contentRule: {
        name: '内容',
        isRequired: false,
        placeholder: '例如：article#body',
        type: 'text'
    },
    contentExcludeRule: {
        name: '内容过滤',
        isRequired: false,
        placeholder: '过滤掉内容里无意义的东西，例如：iFrame, table',
        type: 'text'
    },
    sourceRule: {
        name: '来源',
        type: 'text',
        placeholder: '文章来源，如自动抓取失败会使用网站名称'
    },
    sourceRegexp: {
        name: '来源RegExp匹配',
        type: 'text',
        placeholder: '例: 编辑[：|:]([\S]*)，抓取第一个括号内的内容，可以到"regex101.com"进行调试'
    },
    authorRule: {
        name: '作者',
        type: 'text',
        placeholder: '文章的作者，不是来源，例如：span#author'
    },
    publicDateRule: {
        name: '发布时间',
        type: 'text',
        placeholder: '文章的发布时间，如抓取失败会使用当前系统时间'
    },
    pageRule: {
        name: '分页',
        type: 'text',
        placeholder: '当文章有分页时，此项必须填写，自动抓取算法中没有自动判断分页的逻辑。例如：#pages>a.page'
    }
};