import freshOneContent from './freshOneContent';
import freshTableList from './freshTableList';
import ajax from '../lib/ajax';
import API from '../const/API';
import SYSTEM from '../../common/SYSTEM';
import informServer from './informServer';
import {
    message,
    Modal
} from 'antd';
import store from '../reducer';
import SITE_INFO from '../const/SITE_INFO';
import distributionLib from '../lib/distribution';
const shortId = require('shortid');
const lcAJAX = require('lc-ajax');
const URI = require('urijs');
const urlPrefix = '/'+SYSTEM.urlVersion.value;
const actions = [];

/** 
 * Don't ask me why using array to store all button action.
 * I just can't help to follow in love with array.
 * 
 * Attention:
 * 1. name property value must be camel case
 */

actions.push({
    name: 'toggleContentEditModal',
    action: async function(item){
        const primaryField = this.props.fields.find(field=>field.isPrimaryKey);
        const keyName = primaryField.keyName;
        const id = item[keyName];
        let modalTitle;
        let isEditing;
        if(id){
            await this.props.dispatch({
                type: 'table.setValue',
                key: 'editingId',
                value: id
            });
            freshOneContent(this.props, item);
            modalTitle = '编辑';
            isEditing = true;
        }else{
            // set default value
            // some value are come from source property
            console.log('add new content');
            this.props.fields.forEach(each=>{
                if(each.defaultValue !== undefined){
                    if(each.keyName){
                        store.dispatch({type: 'fields.setValue', value: each.defaultValue, key: each.keyName});
                    }
                }else if(each.source){
                    const source = each.source;
                    const uri = new URI();
                    const uriQuery = uri.query(true);
                    let value;
                    if(source.from === 'url'){
                        if(source.keyName){
                            value = uriQuery[source.keyName];
                        }else{
                            value = uriQuery[each.keyName];
                        }
                    }else{
                        throw new Error('This is not a valid source property, please check document.');
                    }
                    console.log('source value: ', value);
                    store.dispatch({type: 'fields.setValue', value: value, key: each.keyName});
                }else{
                    store.dispatch({type: 'fields.setValue', value: undefined, key: each.keyName});
                }
            });
            modalTitle = '新建';
            isEditing = false;
        }
        this.props.dispatch({
            type: 'modal.toggle',
            modalName: 'contentEditModal',
            options: {
                modalTitle,
                isEditing,
            }
        });
        this.props.dispatch({
            type: 'table.setValue',
            value: {
                isEdited: false
            }
        })
    }
});

actions.push({
    name: 'deleteItem',
    action: async function(item){
        const primaryField = this.props.fields.find(field=>!!field.isPrimaryKey);
        const deleteConfig = primaryField.deleteConfig || {};
        const deleteText = (deleteConfig && deleteConfig.deleteText) || '删除后不能恢复，确定？';
        if(window.confirm(deleteText) === false){
            return;
        }
        let api = API.deleteOneFromTable.url;
        if(deleteConfig.api){
            api = deleteConfig.api;
        }
        const args:any = {};
        if(deleteConfig.argMap){
            Object.keys(deleteConfig.argMap).forEach(key=>{
                const def = deleteConfig.argMap[key];
                let valueKey = '';
                if(typeof def === 'string'){
                    valueKey = def;
                }else{
                    valueKey = def.keyName;
                    if(def.type === 'string'){
                        item[valueKey] = item[valueKey] + ''
                    }
                }
                if(deleteConfig.method && deleteConfig.method.toUpperCase() === 'GET'){
                    const apiUri = new URI(api);
                    apiUri.setQuery(key, item[valueKey]);
                    api = apiUri.toString();
                }else{
                    args[key] = item[valueKey];
                }
            });
        }else{
            args.dbName = this.props.dbName;
            args.tableName = this.props.tableName;
            args.keyValue = item[primaryField.keyName];
        }
        let request = lcAJAX.post;
        if(deleteConfig.method){
            if(deleteConfig.method.toUpperCase() === 'GET'){
                request = ajax.get;
            }
        }
        if(deleteConfig.isRedirect){
            const rdUri = new URI(API.serverRequest.url);
            rdUri.setQuery('url', api);
            api = rdUri.toString();
        }
        // console.log('delete id: ', id);
        let enctype = 'json';
        if(deleteConfig.enctype === 'URLENCODED'){
            enctype = 'URLENCODED';
        }
        const postRes = await request(api, args, {}, enctype);
        // console.log(postRes);
        if(postRes.code === 200){
            message.success('删除成功');
            setTimeout(()=>this.freshList(), 1);
            informServer.call(this);
        }else{
            message.error('删除失败：' + postRes.message);
        }
    }
});
actions.push({
    name: 'manageItem',
    action: async function(item){
        const primaryField = this.props.fields.find(field=>!!field.isPrimaryKey);
        const keyValue = item[primaryField.keyName];
        this.props.history.push(urlPrefix + '/page/distribution/channel/distribution-manage?keyValue=' + encodeURIComponent(keyValue));
    }
});
actions.push({
    name: 'blockItemFromDis',
    action: async function(item){
        // console.log('item: ', item);
        await ajax.post(API.blockDistribution.url, {item});
        // console.log('fresh list.');
        const uri = new URI();
        uri.setQuery('page', 1);
        await this.props.setValue('page', 1);
        this.props.history.push(uri.pathname() + uri.search());
    }
});
actions.push({
    name: 'pushUpItemFromDis',
    action: async function(item){
        const pushRes = await ajax.post(API.pushUpDistribution.url, {item});
        if(pushRes.code === 200){
            const uri = new URI();
            await this.props.setValue('page', 1);
            uri.setQuery('page', 1);
            this.props.history.push(uri.pathname() + uri.search());
        }else{
            message.error(pushRes.message);
        }
    }
});
actions.push({
    name: 'deleteItemFromDis',
    action: async function(record){
        const deleteRes = await ajax.post(API.removeTableRecord.url, {
            tableName: 'T_CONTENT_DIS_FLITER',
            fields: {
                FDISID: record.disId,
                FCONTENT_ID: record.id
            }
        });
        if(deleteRes.code === 200){
            const uri = new URI();
            uri.setQuery('page', 1);
            this.props.history.push(uri.pathname() + uri.search());
        }else{
            message.error(deleteRes.message);
        }
    }
});
// set order in distribution filter table from other to 1
actions.push({
    name: 'pullDownFromDis',
    action: async function(record){
        const deleteRes = await ajax.post(API.updateTableRow.url, {
            tableName: 'T_CONTENT_DIS_FLITER',
            fields: {
                FCONTENT_ID: record.id,
                FORDER: 1
            }
        });
        if(deleteRes.code === 200){
            const uri = new URI();
            uri.setQuery('page', 1);
            this.props.history.push(uri.pathname() + uri.search());
        }else{
            message.error(deleteRes.message);
        }
    }
})
actions.push({
    name: 'setItemStyleFromDis',
    action: async function(record){
        this.props.dispatch({type: 'disManage.setValue', key: 'isEditDisplayModalOpen', value: true});
        const styleRes = await ajax.post(API.queryOne.url, {
            tableName: 'T_CONTENT_DIS_DISPLAY',
            fields: {
                FCONTENT_ID: record.id
            }
        });
        if(styleRes.code === 200){
            const val = styleRes.value;
            if(!val.FID){
                val.FDISID = record.disId;
                val.FCONTENT_ID = record.id;
                val.FDISPLAY_STYLE = record.displayStyle;
                val.FOPEN_TYPE = record.openType;
                val.FOPEN_URL = record.openUrl;
            }
            delete val.FPOSITION;
            delete val.FUPDATE_TIME;
            delete val.FCREATE_TIME;
            this.props.dispatch({type: 'disManage.setValue', key: 'editingStyle', value: val});
        }
    },
});

actions.push({
    name: 'openCrawlTester',
    action: function(){
        // console.log('test')
        this.props.dispatch({
            type: 'modal.toggle',
            key: 'crawlTest',
            isOpen: true,
            options: {},
        });
    }
});
actions.push({
    name: 'openVideoInput',
    action: async function(){
        // console.log('open input modal.');
        await store.dispatch({
            type: 'videoInput.setValue',
            key: 'isOpen',
            value: true
        });
    }
});
actions.push({
    name: 'import',
    action: async function({tableName}){
        tableName = tableName || this.props.tableName;
        let inputEl = <HTMLInputElement>document.getElementById('import-data');
        if(!inputEl){
            inputEl = document.createElement('input');
            inputEl.setAttribute('id', 'import-data');
            inputEl.setAttribute('type', 'file');
            inputEl.setAttribute('accept', '.json');
            inputEl.style.display = 'none';
            document.body.appendChild(inputEl);
        }
        inputEl.onchange = ()=>{
            const files = inputEl.files;
            if(files.length){
                const file = files[0];
                const fd = new FormData();
                fd.append('data.json', file);
                fd.append('tableName', tableName);
                const xhr = new XMLHttpRequest();
                xhr.open('POST', API.importData.url);
                xhr.onload = ()=>{
                    inputEl.value = '';
                    const res = JSON.parse(xhr.responseText);
                    if(res.code === 200){
                        message.success('上传成功.');
                        freshTableList.call(this);
                    }else{
                        message.error(res.message);
                    }
                };
                xhr.send(fd);
            }
            console.log(files);
        }
        inputEl.click();
    }
});
actions.push({
    name: 'export',
    action: async function({tableName}){
        tableName = tableName || this.props.tableName;
        const apiUri = new URI(API.exportData.url);
        apiUri.origin(window.location.origin);
        apiUri.setQuery('tableName', tableName);
        window.location.assign(apiUri.toString());
    }
});
actions.push({
    name: 'makeUrl',
    action: async function(record){
        await store.dispatch({
            type: 'modal.toggle',
            key: 'makeUrl',
            isOpen: true,
            options: record
        });
    }
});
actions.push({
    name: 'makeScheme',
    action: async function(record){
        await store.dispatch({
            type: 'modal.toggle',
            key: 'makeScheme',
            isOpen: true,
            options: record
        });
    }
});
actions.push({
    name: 'distribute',
    action: async function(record){
        await store.dispatch({
            type: 'modal.toggle',
            key: 'distribute',
            isOpen: true,
            options: record
        });
    }
});

const quickInvoke = async function(record, api){
    let apiUrl = api;
    const url = new URI(apiUrl);
    url.setQuery('id', record.id);
    const rdUrl = new URI(API.serverRequest.url);
    rdUrl.setQuery('url', url.toString());
    const res = await ajax.get(rdUrl.toString());
    if(res.code === 200){
        message.success('操作成功！');
        this.freshList();
    }else{
        message.error(res.message);
    }
};
actions.push({
    name: 'deleteSpecialContent',
    action: function(record){
        quickInvoke.call(this, record, SITE_INFO.domain + '/service/article/special/del');
    }
});
actions.push({
    name: 'offShelf',
    action: function(record){
        quickInvoke.call(this, record, SITE_INFO.domain + '/service/article/notrelease');
    }
});
actions.push({
    name: 'onShelf',
    action: async function(record){
        quickInvoke.call(this, record, SITE_INFO.domain + '/service/article/release');
    }
});
actions.push({
    name: 'filter',
    action: async function(record){
        quickInvoke.call(this, record, SITE_INFO.domain + '/service/article/special/add');
    }
});

actions.push({
    name: 'manageFunctionRule',
    action: async function(item){
        const primaryField = this.props.fields.find(field=>field.isPrimaryKey);
        this.props.history.push(urlPrefix + '/page/analysis/transfer/rule-manage?FFUNCTION_ID=' + encodeURIComponent(item[primaryField.keyName]));
    }
});
actions.push({
    name: 'stopDistribute',
    action: async function(item){
        console.log('item: ', item);
        Modal.confirm({
            title: '提示',
            content: '暂停下发后，此 CP 的内容即时停止下发，下个自然月开始自动启动下发',
            onOk: async ()=>{
                const rdUri = new URI(API.serverRequest.url);
                rdUri.setQuery('url', 'https://sge.meizu.com/msr/cpgroup/offline');
                const res = await lcAJAX.post(rdUri.toString(), {
                    cps: item.FCPID
                }, {}, 'URLENCODED');
                if(res.code === 200){
                    const addRecordRes = await ajax.post(API.updateTableRow.url, {
                        tableName: 'T_CONTENT_VIEW_STATUS',
                        fields: {
                            FCPID: item.FCPID,
                            FSTAT_DATE: item.FSTAT_DATE,
                            FSTATUS: 4
                        }
                    });
                    if(addRecordRes.code === 200){
                        message.success('操作成功');
                        freshTableList.call(this);
                    }else{
                        message.error('推荐平台操作成功，状态写入失败');
                    }
                }else if(res.code === -100){
                    Modal.confirm({title: '',
                        content: '无法获取当前账户的UAC信息或当前账户权限不足，请点击确定跳转到“通用权限平台”登录，查看“系统功能权限->cp下线”是否已授权，如已授权则返回当前页面，刷新后操作。',
                        onOk: ()=>{
                            window.open('https://sct.meizu.com/?ssCode=sge', '_blank');
                        }
                    });
                }else{
                    message.error(res.message);
                }
            },
        });
    }
});
actions.push({
    name: 'downloadCSV',
    action: async function(){
        freshTableList.call(this, {exposeType: 'csv'});
    }
});
actions.push({
    name: 'searchAuthor',
    action: function(item){
        const authorName = item.FNAME;
        this.props.history.push('/v2/page/content-manage/article?author=' + authorName);
    }
});
actions.push({
    name:'visitContent',
    action: async function(record){
        const newWindow = window.open('');
        if([3, 11].includes(record.type)){
            let videoUrl = '';
            const api = window.location.protocol + '//om.iflow.meizu.com/service/article/playurl';
            const apiUri = new URI(api);
            apiUri.setQuery('cpEntityId', record.cpEntityId || record.uniqueId);
            apiUri.setQuery('cpId', record.cpId || record.resourceType);
            const rdUri = new URI(API.serverRequest.url);
            rdUri.setQuery('url', apiUri.toString());
            const res = await ajax.get(rdUri.toString());
            if(res.code === 200){
                const list = res.value;
                if(Array.isArray(list)){
                    if(list.length){
                        videoUrl = list[0].mainUrl;
                    }
                }
            }
            if(!videoUrl){
                videoUrl = record.link || record.h5Url;
            }
            if(videoUrl){
                const uri = new URI(videoUrl);
                const suffix = uri.suffix();
                if(suffix === 'mp4'){
                    const playUri = new URI('/v2/html/videoPlayer');
                    playUri.setQuery('videoUrl', videoUrl);
                    newWindow.location.href = playUri.toString();
                }else{
                    newWindow.location.href = videoUrl;
                }
            }else{
                message.error('找不到播放地址');
            }
        }else{
            if(record.link){
                newWindow.location.href = record.link;
                return;
            }
            if(record.h5Url){
                newWindow.location.href = record.h5Url;
                return;
            }
        }
    }
});
actions.push({
    name: 'viewAuthorArticleList',
    action: async function(item){
        store.dispatch({
            type: 'modal.toggle',
            modalName: 'authorArticlesPreview',
            options: item
        });
        // console.log('item: ', item);
        // this.props.history.push('/v2/page/author/article-list?authorId=' + item.FID);
    }
});
actions.push({
    name: 'selectAnalysisRule',
    action: function(record){
        store.dispatch({
            type: 'modal.toggle',
            modalName: 'selectAnalysisRule',
            options: record
        });
    }
});
actions.push({
    name: 'publicArticle',
    action: function(){
        Modal.confirm({
            title: '发布',
            content: '编辑后的内容未经过审核，是否发布？',
            onOk: async () => {
                await this.submit();
                const actionDef = actions.find(action=>action.name === 'onShelf');
                actionDef.action.call(this, this.props.formFields);
            },
            okText: '确定',
            cancelText: '取消'
        });
    }
});
actions.push({
    name: 'publicVideo',
    action: function(){
        Modal.confirm({
            title: '发布',
            content: '编辑后的内容未经过审核，是否发布？',
            onOk: async () => {
                // const formFields = JSON.parse(JSON.stringify(this.props.formFields));
                // formFields.status = 1; 
                await store.dispatch({
                    type: 'fields.setValue',
                    value: {
                        status: 1 // 1 = 上架
                    }
                });
                this.submit();
            },
            okText: '确定',
            cancelText: '取消'
        });
    }
})
async function changeVideoStatus({status, contentId, cpId, cpEntityId}){
    const apiUri = new URI('http://om.iflow.meizu.com/service/biz/contents/status');
    apiUri.setQuery('status', status);
    apiUri.setQuery('contentId', contentId);
    apiUri.setQuery('cpEntityId', cpEntityId);
    apiUri.setQuery('cpId', cpId);
    const rdUri = new URI(API.serverRequest.url);
    rdUri.setQuery('url', apiUri.toString());
    const res = await ajax.get(rdUri.toString());
    if(res.code === 200){
        message.success('操作成功');
        this.freshList();
    }else{
        message.error(res.message);
    }
};
actions.push({
    name: 'videoOffShelf',
    action: function(record){
        changeVideoStatus.call(this, {
            status: 2,
            contentId: record.contentId,
            cpId: record.cpId,
            cpEntityId: record.cpEntityId,
        });
    }
});
actions.push({
    name: 'videoOnShelf',
    action: function(record){
        changeVideoStatus.call(this, {
            status: 1,
            contentId: record.contentId,
            cpId: record.cpId,
            cpEntityId: record.cpEntityId,
        });
    }
});
const CRAWL_URL = 'crawlUrl';
actions.push({
    name: CRAWL_URL,
    action: async function(field){
        // console.log('crawling...');
        const fields = JSON.parse(JSON.stringify(this.props.fields));
        const currentField = fields.find(each=>each.keyName === field.keyName);
        const currentButton = currentField.buttons.find(each=>each.actionName === CRAWL_URL);
        currentButton.isLoading = true;
        currentButton.loadingTime = 60;
        currentButton.tempName = '';
        const updateState = function(value){
            // console.log('value: ', JSON.stringify(value.fields[0]));
            store.dispatch({
                type: 'table.setValue',
                value
            });
        };
        updateState({fields});
        const stopLoading = function(index){
            clearInterval(index);
            currentButton.isLoading = false;
            currentButton.tempName = null;
            updateState({fields});
        };
        const intervalIndex = setInterval(() => {
            const propField = this.props.fields.find(each=>each.keyName === field.keyName);
            const propButton = propField.buttons.find(each=>each.actionName === CRAWL_URL);
            if(propButton.isLoading){
                if(propButton.loadingTime){
                    currentButton.loadingTime = currentButton.loadingTime - 1;
                    currentButton.tempName = currentButton.loadingTime;
                    updateState({fields});
                }else{
                    stopLoading(intervalIndex);
                }
            }else{
                stopLoading(intervalIndex);
            }
        }, 1000);
        const res = await ajax.post(API.crawlUrl.url, {
            url: this.props.formFields[currentField.keyName]
        });
        if(res.code === 200){
            // set field value
            const info = res.value;
            const formFields = JSON.parse(JSON.stringify(this.props.formFields));
            const setValue = function(keyName, keyValue){
                formFields[keyName] = keyValue;
            };
            setValue('author', info.author);
            setValue('content', info.content);
            // change _key, so wysiwyg can update content
            const contentField = fields.find(field=>field.keyName === 'content');
            contentField._key = shortId.generate();
            setValue('title', info.title);
            setValue('contentTitle', info.title);
            setValue('cpSource', info.source);
            setValue('imgUrls', info.imgMap.map(img=>{
                img.uid = shortId.generate();
                img.name = img.id;
                img.status = 'done';
                img.thumbUrl = img.url;
                return img;
            }));
            setValue('keywords', info.keywords.join(','));
            updateState({fields});
            store.dispatch({
                type: 'fields',
                value: formFields
            });
            message.success('抓取成功');
        }else{
            message.error(res.message);
        }
        currentButton.isLoading = false;
        updateState({fields});
    }
});
actions.push({
    name: 'copy',
    action: function(field){
        const value = this.props.formFields[field.keyName];
        const inputEl = document.createElement('input');
        inputEl.value = value;
        document.body.appendChild(inputEl);
        inputEl.select();
        document.execCommand("copy");
        inputEl.parentElement.removeChild(inputEl);
    }
});
actions.push({
    name: 'previewVideo',
    action: function(field){
        const value = this.props.formFields[field.keyName];
        window.open(value, '_blank');
    }
});
actions.push({
    name: 'openBatchSet',
    action: function(record){
        store.dispatch({
            type: 'modal.toggle',
            modalName: 'batchSet',
            options: record
        });
    }
});
actions.push({
    name: 'newGrabApi',
    action: function(record){
        const uri = new URI();
        const query = uri.query(true);
        const cpId = query.cpId;
        this.props.history.push('/v2/page/analysis/cp-transfer/cp-api-list/cp-api-manage?cpId=' + cpId);
    }
});
const updateTableRow = async function({tableName, fields}){
    const res = await ajax.post(API.updateTableRow.url, {
        tableName,
        fields
    });
    if(res.code !== 200){
        message.error('操作失败: ' + res.message);
        return;
    }
    message.success('数据保存成功');
    this.props.freshList.call(this);
}
actions.push({
    name: 'offlineCP',
    action: function(record){
        return message.error('该功能正在开发中');
        // updateTableRow.call(this, {
        //     tableName: 'T_CP',
        //     fields: {
        //         FID: record.FID,
        //         FSTATUS: 0
        //     }
        // });
    }
});
actions.push({
    name: 'onlineCP',
    action: function(record){
        return message.error('该功能正在开发中');
        // updateTableRow.call(this, {
        //     tableName: 'T_CP',
        //     fields: {
        //         FID: record.FID,
        //         FSTATUS: 1
        //     }
        // });
    }
});
actions.push({
    name: 'algorithmContentOnline',
    action: function(record){
        updateTableRow.call(this, {
            tableName: 'T_CONTENT_DIS',
            fields: {
                FID: record.FID,
                FSTATUS: 1
            }
        });
        distributionLib.freshCache.call(this, record.FID);
    }
});
actions.push({
    name: 'algorithmContentOffline',
    action: function(record){
        updateTableRow.call(this, {
            tableName: 'T_CONTENT_DIS',
            fields: {
                FID: record.FID,
                FSTATUS: 4
            }
        });
        distributionLib.freshCache.call(this, record.FID);
    }
});
export default actions;