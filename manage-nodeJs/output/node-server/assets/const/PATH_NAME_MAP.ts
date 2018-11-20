const SYSTEM = require('../../common/SYSTEM');
const prefix = '/' + SYSTEM.urlVersion.value + '/page';
// breadcrumb name map
interface LINK {
    keyName: string;
    name: string;
    icon?: string;
    isHide?: boolean;
    link?: string;
    key?: string;
    isCurrentLink?:boolean;
}
// keyName must be unique
const paths:LINK[] = [{
    keyName: 'page',
    name: '主页',
    icon: 'home',
    // link: makeLink('/')
},{
    keyName: 'user-manage',
    name: '用户管理',
    link: prefix + '/user-manage'
},{
    keyName: 'permission',
    name: '权限管理',
    link: prefix + '/user-manage/permission'
},{
    keyName: 'statistic',
    name: '数据统计',
    link: prefix + '/statistic'
},{
    keyName: 'analysis',
    name: '解释管理',
},{
    keyName: 'rule',
    name: '规则配置',
    link: prefix + '/analysis/rule'
},{
    keyName: 'script',
    name: '脚本配置',
    link: prefix + '/analysis/script'
},{
    keyName: 'crawl-rules',
    name: '抓取规则',
    link: prefix + '/analysis/crawl-rules'
}, {
    keyName: 'transfer',
    name: '转码规则',
    link: prefix + '/analysis/transfer'
},{
    keyName: 'rule-manage',
    name: '规则管理',
    link: prefix + '/analysis/transfer/rule-manage'
},{
    keyName: 'sources',
    name: '来源管理',
},{
    keyName: 'cp-list',
    name: '内容CP列表',
    link: prefix + '/sources/cp-list'
},{
    keyName: 'channel',
    name: '渠道管理'
},{
    keyName: 'channel-list',
    name: '频道列表',
    link: prefix + '/channel/channel-list'
},{
    keyName: 'channel-distribution',
    name: '渠道分发',
    link: prefix + '/page/channel/channel-distribution'
},{
    keyName: 'content-algorithm',
    name: '内容+算法配置',
    link: ''
},{
    keyName: 'cp-transfer',
    name: 'CP转码',
    link: prefix + '/analysis/cp-transfer'
},{
    keyName: 'cp-api-list',
    name: 'CP接口'
},{
    keyName:'cp-api-manage',
    name: '接口配置'
},{
    keyName: 'author',
    name: '作者管理',
    link: prefix + '/author'
},{
    keyName: 'special-articles',
    name: '特色库',
    link: prefix + '/content-manage/special-articles'
},{
    keyName: 'content-manage',
    name: '内容管理'
},{
    keyName: 'article',
    name: '新内容库',
    link: prefix + '/content-manage/article'
},{
    keyName: 'contents',
    name: '内容库',
    link: '/page/content-manage/article'
},{
    keyName: 'video',
    name: '视频库',
    link: prefix + '/video'
},{
    keyName: 'distribution',
    name: '分发管理'
},{
    keyName: 'channel',
    name: '频道管理',
    link: prefix + '/distribution'
},{
    keyName: 'distribution-detail',
    name: '下发明细',
    link: prefix + '/distribution/distribution-detail'
}, {
    keyName: 'distribution-control',
    name: '下发管理',
    link: prefix + '/distribution/distribution-control'
},{
    keyName: 'setting',
    name: '设置管理'
},{
    keyName: 'param',
    name: '系统参数',
    link: prefix + '/setting/param'
},{
    keyName: 'kiev-monitor',
    name: 'kiev监控',
    link: prefix + '/setting/kiev-monitor'
},{
    keyName: 'auth',
    name: '权限管理',
},{
    keyName: 'user',
    name: '用户',
    link: prefix + '/auth/user'
},{
    keyName: 'develop-guide',
    name: '开发指南',
    link: prefix + '/develop-guide'
},{
    keyName: 'v2',
    name: '',
    isHide: true
}];

export default paths;