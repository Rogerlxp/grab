import {
    message
} from 'antd';
const URI = require('urijs');
import ajax from '../lib/ajax';
import API from '../const/API';
export default async function(){
    const primaryField = this.props.fields.find(each=>each.isPrimaryKey);
    if(primaryField && primaryField.informServer){
        const apiUri = new URI(primaryField.informServer.api);
        // add query
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', apiUri.toString());
        const res = await ajax.get(rdUri.toString());
        if(res.code === 200){
            message.success('刷新缓存成功');
        }else{
            message.error('刷新缓存失败，' + 'JAVA服务器返回信息：' + res.message);
        }
    }
}