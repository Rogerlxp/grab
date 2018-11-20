import ajax from '../lib/ajax';
import API from '../const/API';
import {
    message
} from 'antd';
import handy from '../lib/handy';
import {EditorState} from 'braft-editor';
const URI = require('urijs');
const shortid = require('shortid');
export default async function(props, record?){
    console.log('record: ', record);
    const dispatch = props.dispatch;
    if(!props.editingId){
        return;
    }
    const primaryField = props.fields.find(field=>field.isPrimaryKey);
    const detailConfig = primaryField.detailConfig;
    let url = API.getOneFromTable.url;
    if(detailConfig && detailConfig.api){
        url = detailConfig.api;
    }
    // query
    const uri = new URI(url);
    // console.log(props);
    if(detailConfig){
        const argMap = detailConfig.argMap;
        Object.keys(argMap).forEach(key=>{
            const valueKey = argMap[key];
            console.log('key: ', key);
            uri.setQuery(key, record[valueKey]);
        });
    }else{
        uri.setQuery('tableName', props.tableName);
        uri.setQuery('dbName', props.dbName);
        uri.setQuery('keyName', props.dbName);
        uri.setQuery('keyValue', props.editingId);
    }
    // console.log(props);
    let fields = props.fields;
    // clean all field value
    fields.forEach(field=>{
        if(!field.keyName){
            return;
        }
        if(field.type === 'wysiwyg'){
            dispatch({type: 'fields.setValue', value: EditorState.createFrom(), key: field.keyName});
        }else{
            dispatch({type: 'fields.setValue', value: null, key: field.keyName});
        }
    });
    const urlStr = uri.toString();
    let res;
    if(detailConfig && detailConfig.isRedirect){
        const redirectUri = new URI(API.serverRequest.url);
        redirectUri.setQuery('url', urlStr);
        res = await ajax.get(redirectUri.toString());
    }else{
        res = await ajax.get(urlStr);
    }
    if(res.code !== 200){
        message.error('获取内容失败');
        return;
    }
    let value = res.value;
    if(!value){
        message.error('接口返回空的内容');
        return;
    }
    fields.forEach(field=>{
        const keyName = field.keyName;
        let val;
        if(handy.isValuePath(field.keyName)){
            // console.log('field:', field);
            // console.log('val: ', value);
            val = handy.getValueByPath(value, field.keyName);
            // console.log('got value: ', val);
        }else{
            val = value[keyName];
        }
        if(!keyName){
            return;
        }
        if(['image', 'images', 'file'].includes(field.type)){
            if(!val){
                return;
            }
            if(typeof val === 'string'){
                val = [val];
            }else if(Array.isArray(val)){
                // that's what I want.
            }else{
                throw new Error('Can not normalize this value of file.');
            }
            const files = val.map(v=>{
                const url = new URI(v);
                const uid = shortid.generate();
                const name = field.type === 'file' ? url.filename() : uid
                return {
                    uid,
                    url: v,
                    name,
                    status: 'done'
                };
            });
            // console.log(files);
            dispatch({type: 'fields.setValue', value: files, key: keyName});
        }else if(field.type === 'wysiwyg'){
            const template = document.createElement('template');
            template.innerHTML = val;
            const images = template.content.querySelectorAll('img');
            [].forEach.call(images, function(img){
                if(!img.src){
                    const dataSrc = img.getAttribute('data-src');
                    if(dataSrc){
                        img.setAttribute('src', dataSrc);
                    }
                }
            });
            val = template.innerHTML;
            // console.log('wysiwyg: ', val);
            dispatch({type: 'fields.setValue', value: EditorState.createFrom(val), key: keyName});
        }else{
            // console.log('keyName: ', keyName);
            // console.log('val: ', val);
            dispatch({type: 'fields.setValue', value: val, key: keyName});
        }
    });
    dispatch({type: 'table.setValue', value: value, key: 'originalFields'});
    dispatch({type: 'table.setValue', value: props.fields, key: 'fields'});
}