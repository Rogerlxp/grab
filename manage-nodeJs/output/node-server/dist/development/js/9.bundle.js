(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"./assets/const/API.ts":function(e,t,a){"use strict";const n="/"+a("./common/SYSTEM.js").urlVersion.value+"/api",i={tableQuery:{url:"/table/list",description:"查询mysql表数据，该接口将会失效"},queryTable:{url:"/table/query",description:"查询mysql表数据，优先使用这个",type:"all"},queryOne:{url:"/table/query-one",description:"跟queryTable差不多，但只获取一个"},removeTableRecord:{url:"/table/remove",description:"删除指定fields的数据，可以删除一个或多个"},getByKeyName:{url:"/table/getByKeyName",description:"通过keyName字段去查询表中数据"},tableDistinctQuery:{url:"/table/distinct",description:"滤重方式查询mysql的某个字段"},getOneFromTable:{url:"/table/one",description:"通过主键ID的值，从mysql表中获取单条数据"},updateTableRow:{url:"/table/upsert",description:"更新或新增mysql表中的某条数据，仅支持POST方式"},duplicateRow:{url:"/table/duplicateOne",description:"复制一条纪录到同一个表"},multiTableUpsert:{url:"/table/multi-upsert",description:"可以单次提交多个mysql表的更新或新增"},multiTableSave:{url:"/table/multi-save",description:"可以提交多个表的更新操作，包括新增、删除、更新"},reUploadImage:{url:"/common/re-upload",description:"转发上传图片到java服务器"},serverRequest:{url:"/common/redirect",description:"由于权限和跨域的原因，浏览器不能直接请求某个API，需要用这个API来帮忙请求。"},deleteOneFromTable:{url:"/table/deleteOne",description:"从 mysql 表中删除某条数据"},saveDistribution:{url:"/distribution/save",description:"保存分发运营配置"},pushUpDistribution:{url:"/distribution/pushUp",description:"置顶某条内容"},blockDistribution:{url:"/distribution/block",description:"屏蔽某条内容"},getDistributionStyle:{url:"/distribution/getStyle",description:"获取某条位置的样式"},saveDistributionStyle:{url:"/distribution/saveStyle",description:"保存某条位置的样式"},freshDistributionCache:{url:"/distribution/freshCache",description:"刷新缓存"},crawlUrl:{url:"/crawl/getContent",description:"抓取某个页面的内容，返回json数据",type:"POST"},exportData:{url:"/table/export",description:"下载SQL数据",type:"GET"},importData:{url:"/table/import",description:"上传SQL数据",type:"POST"},saveImage:{url:"/crawl/save-image",description:"保存图片到魅族服务器",type:"POST"}};Object.keys(i).forEach(e=>i[e].url=n+i[e].url),t.a=i},"./assets/lib/Component.ts":function(e,t,a){"use strict";a.d(t,"a",function(){return s});var n=a("./node_modules/react/index.js"),i=a("./assets/lib/handy.ts");class s extends n.Component{constructor(e){super(e),i.a.setTitle(e)}}},"./assets/page/BaiduContentInput.tsx":function(e,t,a){"use strict";a.r(t);var n=a("./node_modules/react/index.js"),i=a("./assets/lib/Component.ts"),s=a("./assets/lib/ajax.ts"),r=a("./assets/const/SITE_INFO.ts"),l=a("./assets/const/API.ts"),o=(a("./assets/sass/page/BaiduContentInput.scss"),a("./node_modules/antd/es/message/index.js")),d=a("./node_modules/antd/es/select/index.js"),u=a("./node_modules/antd/es/form/index.js"),m=a("./node_modules/antd/es/input/index.js"),c=a("./node_modules/antd/es/date-picker/index.js"),h=a("./node_modules/antd/es/button/index.js"),y=a("./node_modules/antd/es/table/index.js"),p=a("./assets/lib/handy.ts"),g=function(e,t,a,n){return new(a||(a=Promise))(function(i,s){function r(e){try{o(n.next(e))}catch(e){s(e)}}function l(e){try{o(n.throw(e))}catch(e){s(e)}}function o(e){e.done?i(e.value):new a(function(t){t(e.value)}).then(r,l)}o((n=n.apply(e,t||[])).next())})};const E=a("./node_modules/urijs/src/URI.js"),v=a("./node_modules/moment/moment.js"),b=a("./common/enum/CP_SOURCES.js");t.default=class extends i.a{constructor(e){super(e),this.columns=[{title:"CP文章ID",dataIndex:"cpEntityId"},{title:"标题",dataIndex:"title",render:(e,t)=>n.createElement("a",{href:t.h5Url,target:"blank",className:"title-link"},e)},{title:"作者",dataIndex:"author"},{title:"分类",dataIndex:"category"},{title:"内容CP",dataIndex:"cpName"},{title:"内容类型",dataIndex:"contentTypeName"},{title:"发布时间",dataIndex:"publishTime",render:e=>new v(e).format("YYYY-MM-DD HH:mm:ss")}],document.title="百度搜索入库"+r.a.tabNameDivider+r.a.name,this.state={keyword:"",contentType:null,timeRange:[],categoryList:[],category:null,list:[],count:0,lastId:void 0,isLoading:!1,pagination:{pageSize:10,current:0}},this.getCategory(),this.dayStartTime=p.a.makeDayStartTime(),this.dayEndTime=p.a.makeDayEndTime()}fieldChange(e,t){let a;a=t&&t.target?t.target.value:t,this.setState({[e]:a})}getCategory(){return g(this,void 0,void 0,function*(){const e=new E(r.a.domain+"/service/biz/contents/category/baidu"),t=yield s.a.get(l.a.serverRequest.url,{url:e.toString()});if(200!==t.code)return void o.a.error("获取分类列表失败："+t.message);const a=t.value;Array.isArray(a)?this.setState({categoryList:a}):o.a.error("返回的分类列表不是数组类型："+typeof a)})}startLoading(){this.setState({isLoading:!0})}stopLoading(){this.setState({isLoading:!1})}onTableChange(e,t,a){this.setState({pagination:e})}pageChange(e,t=10){const a=JSON.parse(JSON.stringify(this.state.pagination));a.current=1,this.setState({pagination:a})}search(){this.pageChange(1),this.getList()}getList(){return g(this,void 0,void 0,function*(){const e=new E(r.a.domain+"/service/biz/contents/sync/baidu");e.setQuery("keyword",this.state.keyword),Array.isArray(this.state.category)?e.setQuery("category",this.state.category.filter(e=>null!==e).join(",")):e.setQuery("category",this.state.category),e.setQuery("contentType",this.state.contentType),this.state.timeRange.length&&(e.setQuery("beginTime",this.state.timeRange[0].unix()),e.setQuery("endTime",this.state.timeRange[1].unix())),this.startLoading();const t=yield s.a.get(l.a.serverRequest.url,{url:e.toString()});if(this.stopLoading(),200!==t.code)return void o.a.error("获取列表失败："+t.message);const a=t.value||[];for(const e of a){e.cpName="";const t=b.find(t=>t.value===e.cpId);t&&(e.cpName=t.name),e.contentTypeName="",0===e.type&&(e.contentTypeName="新闻"),11===e.type&&(e.contentTypeName="视频")}this.setState({list:a})})}render(){const e=this.state.categoryList.map(e=>n.createElement(d.a.Option,{value:e.cpCategoryId,key:e.cpCategoryId},e.cpCategoryName));return e.push(n.createElement(d.a.Option,{value:null,key:null},"全部")),n.createElement("div",{id:"baidu-content-input"},n.createElement(u.a,{layout:"inline"},n.createElement(u.a.Item,{label:"关键字"},n.createElement(m.a,{value:this.state.keyword,onPressEnter:this.search.bind(this),onChange:this.fieldChange.bind(this,"keyword"),placeholder:"请填写"})),n.createElement(u.a.Item,{label:"百度内容类型"},n.createElement(d.a,{onChange:this.fieldChange.bind(this,"contentType"),placeholder:"请选择",value:this.state.contentType},n.createElement(d.a.Option,{value:0},"新闻"),n.createElement(d.a.Option,{value:2},"视频"),n.createElement(d.a.Option,{value:null},"全部")))),n.createElement(u.a,{layout:"inline"},n.createElement(u.a.Item,{label:"时间范围"},n.createElement(c.a.RangePicker,{showTime:{defaultValue:[this.dayStartTime,this.dayEndTime]},value:this.state.timeRange,onChange:this.fieldChange.bind(this,"timeRange")})),n.createElement(u.a.Item,{label:"百度内容类目"},n.createElement(d.a,{onChange:this.fieldChange.bind(this,"category"),placeholder:"请选择",value:this.state.category},e)),n.createElement(u.a.Item,null,n.createElement(h.a.Group,null,n.createElement(h.a,{onClick:this.search.bind(this),loading:this.state.isLoading},"搜索及入库")))),n.createElement(y.a,{dataSource:this.state.list,loading:this.state.isLoading,rowKey:"cpEntityId",onChange:this.onTableChange.bind(this),pagination:this.state.pagination,columns:this.columns}))}}},"./assets/sass/page/BaiduContentInput.scss":function(e,t,a){},"./common/enum/CP_SOURCES.js":function(e,t){e.exports=[{value:1,name:"LOFTER",keyName:"LOFTER",hideWhenEdit:!0},{value:2,name:"UC",keyName:"UC",hideWhenEdit:!0},{value:4,name:"魅族资讯",keyName:"MEIZU"},{value:8,name:"新浪",keyName:"SINA",hideWhenEdit:!0},{value:16,name:"魅族视频",keyName:"FLYME_VIDEO",hideWhenEdit:!0},{value:32,name:"魅族推荐",keyName:"MEIZU_RECOMMEND",hideWhenEdit:!0},{value:64,name:"腾讯新闻",keyName:"TENCENT",hideWhenEdit:!0},{value:65,name:"360视频",keyName:"RES_360",hideWhenEdit:!0},{value:66,name:"腾讯浏览器",keyName:"QQ_BROWSER",hideWhenEdit:!0},{value:67,name:"橘子娱乐",keyName:"JUZI",hideWhenEdit:!0},{value:68,name:"360搜索",keyName:"SEARCH_360",hideWhenEdit:!0},{value:69,name:"腾讯快报",keyName:"KB",hideWhenEdit:!0},{value:70,name:"360文章",keyName:"APP_360",hideWhenEdit:!0},{value:71,name:"UC视频",keyName:"UC_VIDEO",hideWhenEdit:!0},{value:72,name:"快手视频",keyName:"KS_VIDEO",hideWhenEdit:!0},{value:73,name:"轻芒阅读",keyName:"QINGMANG",hideWhenEdit:!0},{value:74,name:"优品",keyName:"YOUPIN"},{value:75,name:"英威诺",keyName:"INVENO",hideWhenEdit:!0},{value:76,name:"百度",keyName:"BAIDU",hideWhenEdit:!0},{value:77,name:"百度视频",keyName:"BAIDU_VIDEO",hideWhenEdit:!0},{value:78,name:"凤凰新闻",keyName:"IFENG_MEIZU",hideWhenEdit:!0},{value:79,name:"网易有料",keyName:"163_NEWS",hideWhenEdit:!0},{value:80,name:"腾讯语音",keyName:"TENCENT_VOICE",hideWhenEdit:!0},{value:81,name:"一点资讯",keyName:"YIDIAN",hideWhenEdit:!0},{value:82,name:"唯彩看球",keyName:"VIPC",hideWhenEdit:!0},{value:83,name:"唔哩头条",keyName:"WULI",hideWhenEdit:!0},{value:84,name:"今日头条",hideWhenEdit:!0,keyName:"JINRITOUTIAO"},{value:85,name:"西瓜视频",hideWhenEdit:!0,keyName:"TOUTIAO_XIGUA"},{value:101,name:"里世界",keyName:"LISHIJIE",hideWhenEdit:!0},{value:102,name:"好兔视频",keyName:"HAOTU",hideWhenEdit:!0}]}}]);
//# sourceMappingURL=9.bundle.js.map