import ajax from '../lib/ajax';
import store from '../reducer';
import API from '../const/API';
import {message} from 'antd';
const URI = require('urijs');
const LIST_API = 'http://om.iflow.meizu.com/service/biz/grab/list';
const dispatch = store.dispatch;
export default async function(){
    await dispatch({
        type: 'table.setValue',
        key: 'isLoading',
        value: true
    });
    const rdUri = new URI(API.serverRequest.url);
    rdUri.setQuery('url', LIST_API);
    const res = await ajax.get(rdUri.toString());
    await dispatch({
        type: 'table.setValue',
        key: 'isLoading',
        value: false
    });
    if(res.code === 200){
        const value = res.value;
        // set list
        dispatch({type: 'table.setValue', value: value, key: 'list'});
        // dispatch({type: 'table.setValue', value: value.total, key: 'total'});
    }else{
        message.error('获取列表失败。');
    }
};