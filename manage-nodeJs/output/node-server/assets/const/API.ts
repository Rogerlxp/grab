const SYSTEM = require('../../common/SYSTEM');
const urlPrefix = '/' + SYSTEM.urlVersion.value + '/api';
const API = {
    tableQuery: {
        url: '/table/list',
        description: '查询mysql表数据，该接口将会失效'
    },
    queryTable: {
        url: '/table/query',
        description: '查询mysql表数据，优先使用这个',
        type: 'all'
    },
    queryOne: {
        url: '/table/query-one',
        description: '跟queryTable差不多，但只获取一个'
    },
    removeTableRecord: {
        url: '/table/remove',
        description: '删除指定fields的数据，可以删除一个或多个'
    },
    getByKeyName: {
        url: '/table/getByKeyName',
        description: '通过keyName字段去查询表中数据'
    },
    tableDistinctQuery: {
        url: '/table/distinct',
        description: '滤重方式查询mysql的某个字段'
    },
    getOneFromTable: {
        url: '/table/one',
        description: '通过主键ID的值，从mysql表中获取单条数据'
    },
    updateTableRow: {
        url: '/table/upsert',
        description: '更新或新增mysql表中的某条数据，仅支持POST方式'
    },
    duplicateRow: {
        url: '/table/duplicateOne',
        description: '复制一条纪录到同一个表'
    },
    multiTableUpsert: {
        url: '/table/multi-upsert',
        description: '可以单次提交多个mysql表的更新或新增'
    },
    multiTableSave: {
        url: '/table/multi-save',
        description: '可以提交多个表的更新操作，包括新增、删除、更新'
    },
    reUploadImage: {
        url: '/common/re-upload',
        description: '转发上传图片到java服务器'
    },
    serverRequest: {
        url: '/common/redirect',
        description: '由于权限和跨域的原因，浏览器不能直接请求某个API，需要用这个API来帮忙请求。'
    },
    deleteOneFromTable: {
        url: '/table/deleteOne',
        description: '从 mysql 表中删除某条数据'
    },
    saveDistribution: {
        url: '/distribution/save',
        description: '保存分发运营配置'
    },
    pushUpDistribution: {
        url: '/distribution/pushUp',
        description: '置顶某条内容'
    },
    blockDistribution: {
        url: '/distribution/block',
        description: '屏蔽某条内容'
    },
    getDistributionStyle: {
        url: '/distribution/getStyle',
        description: '获取某条位置的样式'
    },
    saveDistributionStyle: {
        url: '/distribution/saveStyle',
        description: '保存某条位置的样式'
    },
    freshDistributionCache: {
        url: '/distribution/freshCache',
        description: '刷新缓存'
    },
    crawlUrl: {
        url: '/crawl/getContent',
        description: '抓取某个页面的内容，返回json数据',
        type: 'POST'
    },
    exportData: {
        url: '/table/export',
        description: '下载SQL数据',
        type: 'GET'
    },
    importData: {
        url: '/table/import',
        description: '上传SQL数据',
        type: 'POST'
    },
    saveImage: {
        url: '/crawl/save-image',
        description: '保存图片到魅族服务器',
        type: 'POST'
    }
}
Object.keys(API).forEach(key=>API[key].url = (urlPrefix + API[key].url));

export default API;