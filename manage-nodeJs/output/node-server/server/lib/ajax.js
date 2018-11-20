const http = require('http');
const https = require('https');

let request = function({url, type}){
    return new Promise(function(resolve, reject){
        if(/^http/.test(url) === false){
            reject(new Error('Please provide a full url with protocol.'));
            return;
        }
        let xhr;
        if(/^https/.test(url)){
            xhr = https;
        }else{
            xhr.http;
        }
        if(!type){
            type = 'GET';
        }
        type = type.toUpperCase();
        if(type === 'GET'){
            xhr.get(url, function(res){
                let data = '';
                res.on('data', function(chunk){
                    data += chunk;
                });
                res.on('end', function(){
                    if(/json/i.test(res.headers['content-type'])){
                        data = JSON.parse(data);
                    }
                    resolve(data);
                });
            }).on('error', err=>{
                reject(err);
            });
            return;
        }else if(type === 'POST'){
            reject(new Error('not write this code yet.'));
            return;
        }
    });
}

module.exports = {
    get: function(url){
        return request({url, type: 'GET'});
    }
}