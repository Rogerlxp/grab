import ajax from '../lib/ajax';
import API from '../const/API';
import store from '../reducer';
import {
    message
} from 'antd';
const URI = require('urijs');
const AUTHOR_ARTICLES_API = window.location.protocol + '//om.iflow.meizu.com/service/author/content';
const freshAuthorArticles = async function(){
    const currentUri = new URI();
    const currentQuery = currentUri.query(true);
    const page = this.props.page;
    const pageSize = this.props.pageSize || 10;
    const authorId = currentQuery.authorId || this.props.authorId;
    if(!authorId){
        throw new Error('author id is required.');
    }
    const apiUri = new URI(AUTHOR_ARTICLES_API);
    apiUri.setQuery('authorId', authorId);
    apiUri.setQuery('page', page);
    apiUri.setQuery('pageSize', pageSize);
    const rdUri = new URI(API.serverRequest.url);
    rdUri.setQuery('url', apiUri.toString());
    store.dispatch({
        type: 'table.setValue',
        key: 'isLoading',
        value: true
    });
    const res = await ajax.get(rdUri.toString());
    if(res.code === 200){
        const resList = res.value.items || [];
        const list = this.props.list.concat(resList);
        store.dispatch({
            type: 'table.setValue',
            key: 'list',
            value: list
        });
        if(resList.length < pageSize){
            store.dispatch({
                type: 'table.setValue',
                key: 'noMore',
                value: true
            });
        }
    }else{
        message.error('获取列表失败：' + res.message);
    }
    store.dispatch({
        type: 'table.setValue',
        key: 'isLoading',
        value: false
    });
};
export default freshAuthorArticles;