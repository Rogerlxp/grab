import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import {Provider, connect} from 'react-redux';
import store from '../reducer';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
// style
import '../sass/page/main.scss';
// accessory component
import Loading from '../component/accessory/Loading';
// page component
import Navigation from '../component/Navigation';
import BreadcrumbComponent from '../component/Breadcrumb';
// pages
const Contents = Loadable({
    loader:()=>import('../page/Contents'),
    loading: Loading
});
const BaiduContentInput = Loadable({
    loader: ()=>import('../page/BaiduContentInput'),
    loading: Loading
});
const SpecialArticles = Loadable({
    loader:()=>import('../page/SpecialArticles'),
    loading: Loading
});
const Video = Loadable({
    loader:()=>import('../page/Video'),
    loading: Loading
});
const AnalysisRule = Loadable({
    loader:()=>import('../page/AnalysisRule'),
    loading: Loading
});
const AnalysisScript = Loadable({
    loader:()=>import('../page/AnalysisScript'),
    loading: Loading
});
const AuthUser = Loadable({
    loader:()=>import('../page/AuthUser'),
    loading: Loading
});
const Author = Loadable({
    loader:()=>import('../page/Author'),
    loading: Loading
});

// distribution
const Distribution = Loadable({
    loader:()=>import('../page/Distribution'),
    loading: Loading
});
const DistributionManage = Loadable({
    loader:()=>import('../page/DistributionManage'),
    loading: Loading
});
const DistributionDetail = Loadable({
    loader:()=>import('../page/DistributionDetail'),
    loading: Loading
});
const DistributionControl = Loadable({
    loader:()=>import('../page/DistributionControl'),
    loading: Loading
});
const CrawlRules = Loadable({
    loader:()=>import('../page/CrawlRules'),
    loading: Loading
});
const CPConstructor = Loadable({
    loader:()=>import('../page/CPConstructor'),
    loading: Loading
});
const DevelopGuide = Loadable({
    loader:()=>import('../page/DevelopGuide'),
    loading: Loading
});
const Transfer = Loadable({
    loader:()=>import('../page/Transfer'),
    loading: Loading
});
const TransferFunctionManage = Loadable({
    loader:()=>import('../page/TransferFunctionManage'),
    loading: Loading
});

// channel
const ChannelList = Loadable({
    loader:()=>import('../page/ChannelList'),
    loading: Loading
});
const ChannelDistribution = Loadable({
    loader:()=>import('../page/ChannelDistribution'),
    loading: Loading
});
const ContentAlgorithm = Loadable({
    loader:()=>import('../page/ContentAlgorithm'),
    loading: Loading
});
// cp
const CPList = Loadable({
    loader:()=>import('../page/CPList'),
    loading: Loading
});
const CPTransfer = Loadable({
    loader:()=>import('../page/CPTransfer'),
    loading: Loading
});
const CPAPIList = Loadable({
    loader:()=>import('../page/CPAPIList'),
    loading: Loading
});
const CPAPIManage = Loadable({
    loader:()=>import('../page/CPAPIManage'),
    loading: Loading
});
const AuthorArticles = Loadable({
    loader:()=>import('../page/AuthorArticles'),
    loading: Loading
});
const SettingParam = Loadable({
    loader:()=>import('../page/SettingParam'),
    loading: Loading
});
const KievMonitor = Loadable({
    loader:()=>import('../page/KievMonitor'),
    loading: Loading
});
// ant design
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
const SYSTEM = require('../../common/SYSTEM');
const urlPrefix = '/' + SYSTEM.urlVersion.value + '/page';
class Index extends React.Component {
    constructor(prop){
        super(prop);
        this.state = {};
    }
    render(){
        return (
            <Router>
                <LocaleProvider locale={zhCN}>
                    <div className="main">
                        <Navigation />
                        <BreadcrumbComponent />
                        <Route exact path={urlPrefix + "/home"} component={Contents} />
                        <Route exact path={urlPrefix + "/content-manage/article"} component={Contents} />
                        <Route exact path={urlPrefix + "/content-manage/baidu-content-input"} component={BaiduContentInput} />
                        <Route exact path={urlPrefix + "/content-manage/special-articles"} component={SpecialArticles} />
                        <Route exact path={urlPrefix + "/content-manage/video"} component={Video} />

                        <Route exact path={urlPrefix + "/analysis/rule"} component={AnalysisRule} />
                        <Route exact path={urlPrefix + "/analysis/script"} component={AnalysisScript} />
                        <Route exact path={urlPrefix + "/analysis/transfer"} component={Transfer} />
                        <Route exact path={urlPrefix + "/analysis/transfer/rule-manage"} component={TransferFunctionManage} />
                        <Route exact path={urlPrefix + "/analysis/crawl-rules"} component={CrawlRules} />
                        <Route exact path={urlPrefix + "/analysis/cp-transfer"} component={CPTransfer} />
                        <Route exact path={urlPrefix + "/analysis/cp-transfer/cp-api-list"} component={CPAPIList} />
                        <Route exact path={urlPrefix + "/analysis/cp-transfer/cp-api-list/cp-api-manage"} component={CPAPIManage} />

                        <Route exact path={urlPrefix + "/auth/user"} component={AuthUser} />

                        <Route exact path={urlPrefix + "/distribution"} component={Distribution} />
                        <Route exact path={urlPrefix + "/distribution/channel/distribution-manage"} component={DistributionManage} />
                        <Route exact path={urlPrefix + "/distribution/distribution-detail"} component={DistributionDetail} />
                        <Route exact path={urlPrefix + "/distribution/distribution-control"} component={DistributionControl} />
                        
                        <Route exact path={urlPrefix + "/channel/channel-list"} component={ChannelList} />
                        <Route exact path={urlPrefix + "/channel/channel-distribution"} component={ChannelDistribution} />
                        <Route exact path={urlPrefix + "/channel/content-algorithm"} component={ContentAlgorithm} />

                        <Route exact path={urlPrefix + "/author"} component={Author} />
                        <Route exact path={urlPrefix + "/author/article-list"} component={AuthorArticles} />

                        <Route exact path={urlPrefix + "/develop-guide"} component={DevelopGuide} />
                        <Route exact path={urlPrefix + "/cp-Constructor"} component={CPConstructor} />
                        <Route exact path={urlPrefix + "/sources/cp-list"} component={CPList} />
                        
                        <Route exact path={urlPrefix + "/setting/param"} component={SettingParam} />
                        <Route exact path={urlPrefix + "/setting/kiev-monitor"} component={KievMonitor} />
                    </div>
                </LocaleProvider>
            </Router>
        )
    }
}

ReactDOM.render(<Provider store={store}><Index /></Provider>, document.getElementById('root'));