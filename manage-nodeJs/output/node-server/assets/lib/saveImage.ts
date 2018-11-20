import ajax from './ajax';
import API from '../const/API';
const b64ToBlob = require('b64-to-blob');
const isBase64Reg = /^data:(image\/\w{1,5});base64,/;
const isBlobReg = /^blob:/;
const uploadFile = function(file){
    return new Promise(resolve=>{
        const xhr = new XMLHttpRequest();
        xhr.onload = ()=>{
            const res = JSON.parse(xhr.responseText);
            resolve(res);
        }
        const fd = new FormData();
        xhr.open('POST', API.reUploadImage.url);
        fd.append('file', file);
        xhr.send(fd);
    });
}
const uploadBase64 = function(b64Url){
    return new Promise(resolve=>{
        const matches = b64Url.match(isBase64Reg);
        // console.log('match: ', matches);
        const contentType = matches[1];
        const ext = contentType.match(/\/(.*)/)[1];
        const fileName = Date.now() + '.' + ext;
        const imgBlob = b64ToBlob(b64Url.replace(isBase64Reg, ''), contentType);
        // console.log('upload base64 image: ' + fileName);
        const imgFile = new File([imgBlob], fileName, {type: contentType, lastModified: Date.now()});
        resolve(uploadFile(imgFile));
    });
};
const downloadBlobUrl = function(blobUrl){
    return new Promise(resolve=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', blobUrl);
        xhr.responseType = 'blob';
        xhr.onload = function(){
            if(this.status === 200){
                const contentType = xhr.getResponseHeader("Content-Type");
                const ext = contentType.match(/\/(.*)/)[1];
                const fileName = Date.now() + '.' + ext;
                const blob = this.response;
                const file = new File([blob], fileName, {type: contentType, lastModified: Date.now()});
                resolve(file);
            }
        }
        xhr.send();
    });
}
export default async function(imgUrl){
    console.log('save img url: ', imgUrl);
    const isBase64 = isBase64Reg.test(imgUrl);
    const isBlob = isBlobReg.test(imgUrl);
    if(isBase64){
        return await uploadBase64(imgUrl);
    }else if(isBlob){
        const imgFile = await downloadBlobUrl(imgUrl);
        return await uploadFile(imgFile);
    }else{
        return await ajax.post(API.saveImage.url, {
            imgUrl
        });
    }
}