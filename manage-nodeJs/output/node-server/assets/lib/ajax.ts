import * as urlLib from 'url';
import {message} from 'antd';
const ajaxLib = require('lc-ajax');
const freshPage = function(){
    message.error('账户过期，正在重刷页面');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
};
let request = async function({url, payload, type}){
    type = type.toLowerCase();
    const req = ajaxLib[type];
    const headers = {
        'X-Requested-With': 'XMLHttpRequest'
    };
    // console.log('req payload: ', payload);
    // let res = await req(url, payload, headers);
    let res;
    try{
        res = await req(url, payload, headers, type==='post'?'JSON':'');
    }catch(error){
        res = error;
        console.log('http request response a error: ', error);
    }
    if(!res){
        message.error('API请求错误，请检查网络设置后重试');
        return;
    }
    if(res.status === 302){
        freshPage();
        return;
    }
    if([401, 402].includes(res.code)){
        freshPage();
    }else if(res.code !== 200){
        if(res.message){
            // message.error(res.data.message);
        }else{
            let codeText = res.code + '';
            if(/^4\d{2,}/.test(codeText)){
                message.error('账户错误，请检查账户状态和DNS环境。');
            }else if(/^5\d{2,}/.test(codeText)){
                message.error('服务器错误，请联系后端开发工程师。');
            }
        }
        if(res.redirect){
            console.log(res);
            // window.location.href = res.redirect;
        }
    }
    return res;
}
const ajax = {
    post(url, payload){
        return request({url, payload, type: 'post'});
    },
    get(url, payload?){
        let urlStr = url;
        if(payload){
            let urlObj = urlLib.parse(url, true);
            Object.keys(payload).forEach(key=>{
                if(!payload[key]){
                    urlObj.query[key] = null;
                }else if(typeof payload[key] === 'object'){
                    urlObj.query[key] = JSON.stringify(payload[key]);
                }else{
                    urlObj.query[key] = payload[key];
                }
            });
            // console.log(urlObj);
            urlStr = urlLib.format(urlObj);
            // console.log(urlStr);
        }
        // console.log(urlStr);
        return request({url:urlStr, payload:null, type: 'get'});
    },
    upload(payload, url, isCors = false){
        return new Promise((resolve, reject)=>{
            let formData = new FormData();
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            isCors && (xhr.withCredentials = true);
            xhr.addEventListener('load', function(){
                console.log(xhr.responseText);
                resolve(JSON.parse(xhr.responseText));
            });
            Object.keys(payload).forEach(key=>{
                formData.append(key, payload[key]);
            });
            xhr.send(formData);
        });
    }
}

export default ajax;