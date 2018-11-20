import store from '../reducer';
import ajax from '../lib/ajax';
import API from '../const/API';
import {TIME_FORMAT} from '../const/MISC';
import handy from '../lib/handy';
import {
    message
} from 'antd';
const URI = require('urijs');
const defaultListConfig = {
    api: API.queryTable.url,
    pager: {
        page: 'page',
        pageSize: 'pageSize'
    },
    isRedirect: false
};
export default async function (fields) {
    fields = fields || this.props.fields;
    const primaryField = fields.find(field=>field.isPrimaryKey);
    const listConfig = primaryField.listConfig || defaultListConfig;
    const apiUri = new URI(listConfig.api);
    const curUri = new URI();
    const curQuery = curUri.query(true);
    Object.keys(curQuery).forEach(key=>{
        apiUri.setQuery(key, curQuery[key]);
    });
    if(['more', 'fake'].includes(listConfig.pager)){
        // no need to deal with pager
    }else{
        const page = this.props.page || 1;
        const pageSize = this.props.pageSize || 10;
        const pagerConfig = listConfig.pager || defaultListConfig.pager;
        if(listConfig.pager && listConfig.pager.start){
            apiUri.setQuery(pagerConfig.start, (page - 1) * pageSize);
        }else{
            apiUri.setQuery(pagerConfig.page, page);
        }
        apiUri.setQuery(pagerConfig.pageSize, pageSize);
    }
    for(const field of this.props.queryFields){
        if(field.value === undefined){
            continue;
        }
        let val = field.value;
        if(field.isShow){
            // when some fields are required. we should warn user to fill it.
            if(field.isShow.keyName){
                const foundField = this.props.queryFields.find(each=>each.keyName === field.isShow.keyName);
                if(foundField){
                    if(foundField.value === field.isShow.keyValue){
                        if(field.isShow.isRequired){
                            if(handy.isEmpty(val)){
                                message.error(`必须填写：${field.name}`);
                                return;
                            }
                        }
                    }
                }
            }
        }
        if(!field.value && typeof field.value !== 'number'){
            val = '';
        }
        if(field.type === 'select'){
            if(field.mode === 'multiple'){
                val = field.value.join(',');
            }
        }
        if(field.type === 'dateRange' && Array.isArray(field.value)){
            if(field.value.length === 2){
                for(let i = 0; i < field.keyNames.length; i++){
                    const val = field.value[i].format(TIME_FORMAT);
                    apiUri.setQuery(field.keyNames[i], val);
                }
                continue;
            }
        }
        if(field.type === 'date'){
            if(field.value){
                val = field.value.format(field.sendFormat || TIME_FORMAT);
            }
        }
        if(field.notSendIfEmpty){
            if(handy.isEmpty(val)){
                continue;
            }
        }
        if(val){
            apiUri.setQuery(field.keyName, val);
        }
    }
    let isRedirect = true;
    if(listConfig.isRedirect === false){
        isRedirect = false;
    }
    let res;
    store.dispatch({
        type: 'table.setValue',
        value: {
            isLoading: true
        }
    });
    if(isRedirect){
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', apiUri.toString());
        res = await ajax.get(rdUri.toString());
    }else{
        res = await ajax.get(apiUri.toString());
    }
    return {res, listConfig};
};