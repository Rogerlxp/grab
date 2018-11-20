/**
 * EditFormModal submit function
 */
import {
    message
} from 'antd';
import saveImage from '../lib/saveImage';
import handy from '../lib/handy';
import API from '../const/API';
import ajax from '../lib/ajax';
import informServer from '../action/informServer';
const URI = require('urijs');
export default async function () {
    const isValid = await this.validate();
    if (!isValid) {
        return;
    }
    const isEditing = this.props.contentEditModal.options.isEditing;
    const fields = this.props.fields;
    const primaryField = fields.find(field => field.isPrimaryKey === true);
    const upsertConfig = primaryField.upsertConfig;
    const updateConfig = primaryField.updateConfig;
    const addConfig = primaryField.addConfig;
    const preData = this.props.formFields;
    console.log('submit data: ', preData);
    // arrange post data
    const payload: any = {};
    let payloadFields;
    if (upsertConfig || updateConfig || addConfig) {
        // console.log('update config : ', upsertConfig);
        payloadFields = payload;
    } else {
        payload.fields = {};
        payload.dbName = this.props.dbName;
        payload.tableName = this.props.tableName;
        payloadFields = payload.fields;
    }
    // const keys = Object.keys(preData);
    // console.log('preData: ', preData);
    // console.log('keys: ', keys);
    this.setState({
        confirmLoading: true
    });
    // prepare data
    for (const field of this.props.fields) {
        const key = field.keyName;
        let value = preData[key];
        if (!field) {
            console.log('can not find this field: ' + key);
            continue;
        }

        if(['create-time','update-time'].includes(field.type)){
            // don't sent these field to server
            continue;
        }

        if (isEditing) {
            if(field.notShowWhenUpdate){
                continue;
            }
        }else{
            if(field.newByField){
                const targetField = this.props.fields.find(each=>each.keyName === field.newByField.keyName);
                if(!targetField){
                    throw new Error('can not find "newByField" target field.');
                }
                if(field.newByField.targetProperty){
                    if(targetField.type !== 'select'){
                        throw new Error('if you set "targetProperty", than the target field must be a "select" type.');
                    }
                    const foundOption = targetField.options.find(op=>op.value === preData[targetField.keyName]);
                    if(foundOption){
                        value = foundOption[field.newByField.targetProperty];
                    }
                }
            }else if(field.notShowWhenNew){
                continue;
            }
        }
        if (!value && field.isSentEvenEmpty && typeof value !== 'number') {
            // console.log('send even empty: ', field.keyName);
            payloadFields[key] = '';
            continue;
        }
        if (field.isAutoGen) {
            if (!value) {
                continue;
            }
        }
        // Some fields like viewed-count, hot-rate etc can not be edited.
        // These fields won't show on edit form and won't send to server for updating nor inserting.
        // Notice that readonly field will be shown on edit form and it will be sent to server, they are different.
        if (field.isForceSend) {
            // some fields like id no matter how, just send it.
        } else if (field.uneditable) {
            continue;
        } else if (field.isNotSend) {
            continue;
        }
        // readonly will send as well, if you don't want to send it, use isNotSend
        // if(field.readonly === true){
        //     continue;
        // }
        if (value instanceof File) {
            continue;
        }
        if(field.valueType === 'bit'){
            if(Array.isArray(value)){
                value = handy.transferIndexToBit(value);
            }
        }
        if (typeof value === 'string') {
            value = value.trim();
        }
        if (field.type === 'wysiwyg') {
            value = value.toHTML();
            const template = document.createElement('template');
            template.innerHTML = value;
            const temEl = template.content;
            const imgEls: any = temEl.querySelectorAll('img');
            for (const imgEl of imgEls) {
                const src = imgEl.src || imgEl.getAttribute('data-src');
                if (!src) {
                    console.warn('can not find image in content img src.');
                    continue;
                }
                if (/^file:/.test(src)) {
                    message.error('由于浏览器的安全保护机制，目前不能直接上传本地文件。');
                    continue;
                }
                const srcUri = new URI(src);
                const srcUriQuery = srcUri.query(true);
                const srcProtocol = srcUri.protocol();
                // console.log('src protocol: ' + srcProtocol);
                // meizu image no need to upload again
                if (!['blob', 'data'].includes(srcProtocol)) {
                    if(/(\.mzres\.)|(\.meizu\.)/.test(src)){
                        // set image width and height
                        // console.log('this is mz source.');
                        const imgW = imgEl.width;
                        const imgH = imgEl.height;
                        if (!imgW || !imgH) {
                            const width = srcUriQuery.width;
                            const height = srcUriQuery.height;
                            if (width) {
                                imgEl.setAttribute('width', width);
                            }
                            if (height) {
                                imgEl.setAttribute('height', height);
                            }
                        }
                    }else{
                        const res = await ajax.post(API.saveImage.url, {
                            imgUrl: src
                        });
                        if(res.code === 200){
                            // replace src
                            imgEl.setAttribute('src', res.value);
                        }
                    }
                    continue;
                }
                // saveImage function can deal with almost all type of image, base64, blob, http etc.
                const saveRes = await saveImage(src);
                if (saveRes.code === 200) {
                    if (saveRes.value) {
                        console.log('replace src: ' + saveRes.value);
                        const imgUrl = new URI(saveRes.value);
                        const imgUrlQuery = imgUrl.query(true);
                        const width = imgUrlQuery.width;
                        const height = imgUrlQuery.height;
                        imgEl.setAttribute('width', width);
                        imgEl.setAttribute('height', height);
                        imgEl.setAttribute('src', saveRes.value);
                    } else {
                        console.error('server response img without value, please check what happened.');
                    }
                }
            }
            const templateHtml = template.innerHTML;
            console.log('html: ', templateHtml);
            // value = value.replace(/\s?style="[^"]*"/g, '');
            payloadFields[key] = templateHtml;
        } else if (['image', 'images', 'file'].includes(field.type)) {
            if (!value) {
                continue;
            }
            if (Array.isArray(value) === false) {
                value = [value];
            }
            const allUrl = [];
            for (const file of value) {
                if (file) {
                    // console.log(file);
                    allUrl.push(file.url);
                } else {
                    throw new Error('找不到上传的文件');
                }
            }
            if (handy.isValuePath(field.keyName)) {
                handy.applyObjByPath(payloadFields, field.keyName, allUrl.join(','));
            } else {
                payloadFields[key] = allUrl.join(',');
            }
        } else if (typeof value === 'string' || typeof value === 'number') {
            if (handy.isValuePath(field.keyName)) {
                handy.applyObjByPath(payloadFields, field.keyName, value);
            } else {
                payloadFields[key] = value;
            }
        }
    }

    // console.log('payload: ', payload);
    // payload.keyName = this.primaryField.keyName;
    // payload.keyValue = this.props.formFields[this.primaryField.keyName];
    // console.log('payload: ', payload);
    let updateRes;
    const invoke = function (args: any) {
        console.log('invoke args: ', args);
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(args.method, args.url);
            const headers = args.headers || {};
            headers['X-Requested-With'] = 'XMLHttpRequest';
            const enctype = args.enctype || 'json';
            let payload;
            if (/urlencoded/i.test(enctype)) {
                headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                if (args.payload) {
                    payload = Object.entries(args.payload).map(([key, value]) => {
                        if ([undefined, null].includes(value)) {
                            value = '';
                        }
                        if (Array.isArray(value)) {
                            return value.map(val => `${key}=${encodeURIComponent(val + '')}`).join('&');
                        } else {
                            if (typeof value === 'string') {
                                value = value.trim();
                            }
                            return `${key}=${encodeURIComponent(value + '')}`
                        }
                    }).join('&');
                    // console.log(payload);
                }
            } else {
                headers['content-type'] = 'application/json; charset=UTF-8';
                if (args.payload) {
                    payload = JSON.stringify(args.payload);
                }
            }
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value + '');
            });
            xhr.onload = () => {
                const res = JSON.parse(xhr.responseText);
                resolve(res);
            };
            xhr.onerror = (evt) => {
                reject(evt);
            }
            xhr.send(payload);
        });
    };
    let url = API.updateTableRow.url;
    let enctype = 'json';
    let isRedirect = false;
    let apiConfig;
    if (isEditing) {
        apiConfig = updateConfig || upsertConfig;
    } else {
        apiConfig = addConfig;
    }
    if(apiConfig){
        url = apiConfig.api;
        isRedirect = apiConfig.isRedirect || isRedirect;
        enctype = apiConfig.enctype || enctype;
    }
    if (isRedirect) {
        const reqUri = new URI(API.serverRequest.url);
        reqUri.setQuery('url', url);
        url = reqUri.toString();
    }
    try {
        updateRes = await invoke({
            url,
            method: 'POST',
            payload,
            enctype: enctype
        });
    } catch (error) {
        console.error(error);
        message.error('保存失败，服务器发生错误');
    }
    this.setState({ confirmLoading: false });
    // console.log('res: ', updateRes);
    if (!updateRes) {
        return;
    }
    if (updateRes.code === 200) {
        message.success('保存成功');
        this.toggleModal();
        this.freshList();
        informServer.call(this);
    } else {
        message.error('保存失败：' + updateRes.message);
    }
}