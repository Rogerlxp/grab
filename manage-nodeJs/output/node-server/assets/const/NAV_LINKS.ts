const SYSTEM = require('../../common/SYSTEM.js');
const urlPrefix = '/' + SYSTEM.urlVersion.value;
interface LINK {
    name?: string;
    href?: string;
    isHardRedirect?: boolean;
    permissionRequired?: string;
    links?: {
        name: string;
        permissionRequired?: string;
        isHardRedirect?: boolean;
        href: string;
    }[],
    isShow?: any;
}
const NAV_LINKS: LINK[] = [{
    name: '内容管理',
    links: [{
        name: '新内容库',
        href: urlPrefix + '/page/content-manage/article',
        permissionRequired: 'editContent',
    }, {
        name: '内容库',
        href: 'http://om.iflow.meizu.com/page/content/article',
        isHardRedirect: true
    }, {
        name: '视频库',
        href: urlPrefix + '/page/content-manage/video'
    }, {
        name: '特色库',
        href: urlPrefix + '/page/content-manage/special-articles'
    }, {
        name: '评论库',
        href: 'http://om.iflow.meizu.com/page/content/comment',
        isHardRedirect: true
    }]
}, {
    name: '来源管理',
    links: [{
        name: '内容CP列表',
        href: urlPrefix + '/page/sources/cp-list'
    }]
},{
    name: '渠道管理',
    links: [{
        name: '频道列表',
        href: urlPrefix + '/page/channel/channel-list'
    },{
        name: '渠道分发',
        href: urlPrefix + '/page/channel/channel-distribution'
    }]
},{
    name: '分发管理',
    permissionRequired: 'edit-distribution',
    links: [{
        name: '频道管理',
        href: urlPrefix + '/page/distribution'
    }, {
        name: '下发管理',
        href: urlPrefix + '/page/distribution/distribution-control'
    }, {
        name: '下发明细',
        href: urlPrefix + '/page/distribution/distribution-detail'
    }]
}, {
    name: '作者管理',
    href: urlPrefix + '/page/author',
    permissionRequired: 'edit-author'
}, {
    name: '解析管理',
    links: [{
        name: '规则配置',
        href: urlPrefix + '/page/analysis/rule'
    }, {
        name: '脚本配置',
        href: urlPrefix + '/page/analysis/script'
    }, {
        name: '抓取规则',
        href: urlPrefix + '/page/analysis/crawl-rules',
    }, {
        name: '转码规则',
        href: urlPrefix + '/page/analysis/transfer'
    }, {
        name: 'CP转码',
        href: urlPrefix + '/page/analysis/cp-transfer'
    },]
}, {
    name: '权限管理',
    links: [{
        name: '用户',
        href: urlPrefix + '/page/auth/user',
    }, {
        name: '角色',
        href: 'http://om.iflow.meizu.com/page/auth/role',
        isHardRedirect: true
    }, {
        name: '资源',
        href: 'http://om.iflow.meizu.com/page/auth/res',
        isHardRedirect: true
    }]
}, {
    name: '系统设置',
    links: [{
        name: '基础数据',
        href: 'http://om.iflow.meizu.com/page/setting/bsdata',
        isHardRedirect: true
    }, {
        name: '系统参数',
        href: urlPrefix + '/page/setting/param'
    }, {
        name: 'Kiev监控',
        href: urlPrefix + '/page/setting/kiev-monitor'
    }]
}];

export default NAV_LINKS;