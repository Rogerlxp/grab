import ajax from '../lib/ajax';
import API from '../const/API';
import store from '../reducer';
import {message} from 'antd';
const URI = require('urijs');
const getUrlValue = function(value){
    if(value === null){
        return '';
    }else if(value === undefined){
        return '';
    }
    const type = typeof value;
    if(type === 'number'){
        return value + '';
    }else if(type === 'string'){
        return value;
    }else if(Array.isArray(value)){
        return value.join(',');
    }else{
        throw new Error('Can not recognize this type: ' + type);
    }
}
export default async function () {
    const dispatch = store.dispatch;
    // console.log('fresh contents');
    // api: http://om.iflow.meizu.com/service/article/list
    const listAPI = window.location.protocol + '//om.iflow.meizu.com/service/article/list';
    const listUri = new URI(listAPI);
    // set list query
    let page = 1;
    let pageSize = 10;
    console.log('query type: ', this.props.queryType);
    if(this.props.queryType === 'url'){
        const currentUri = new URI();
        const currentQuery = currentUri.query(true);
        page = currentQuery || page;
        pageSize = currentQuery.pageSize || pageSize;
        delete currentQuery.page;
        delete currentQuery.pageSize;
        Object.keys(currentQuery).forEach(key=>{
            listUri.setQuery(key, currentQuery[key]);
        });
    }else if(this.props.queryType === 'redux'){
        console.log('search query: ', this.props.queryFields);
        this.props.queryFields.forEach(eachField => {
            if(eachField.type === 'button'){
                return;
            }
            const val = eachField.value;
            if(Array.isArray(eachField.keyNames)){
                if(Array.isArray(val)){
                    for(let i = 0; i < eachField.keyNames.length; i++){
                        listUri.setQuery(eachField.keyNames[i], getUrlValue(val[i]));
                    }
                }
            }else if(Array.isArray(val) && val.length){
                if(val.includes(null) === false){
                    listUri.setQuery(eachField.keyName, val.join(','));
                }
            }else{
                const v = getUrlValue(val);
                if(v !== ''){
                    listUri.setQuery(eachField.keyName, getUrlValue(val));
                }
            }
        });
        // console.log(this.props.page);
        page = this.props.page;
        pageSize = this.props.pageSize;
    }
    const start = (page - 1) * pageSize;
    // console.log('page: ', this.props.page);
    // console.log('page: ', this.props.page);
    listUri.setQuery('start', start);
    listUri.setQuery('length', pageSize);
    // request list
    dispatch({type: 'table.setValue', value: [], key: 'list'});
    dispatch({type: 'table.setValue', value: 0, key: 'total'});
    dispatch({type: 'table.setValue', value: true, key: 'isLoading'});
    const res = await ajax.get(API.serverRequest.url, {url: listUri.toString()});
    console.log(res);
    if(res.code === 200){
        const value = res.value;
        // set list
        dispatch({type: 'table.setValue', value: value.data, key: 'list'});
        dispatch({type: 'table.setValue', value: value.total, key: 'total'});
    }else{
        message.error(res.message);
    }
    dispatch({type: 'table.setValue', value: false, key: 'isLoading'});
}