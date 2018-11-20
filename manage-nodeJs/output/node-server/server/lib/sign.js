const path = require('path');
const fs = require('fs');
const NodeRsa = require('node-rsa');

module.exports = {
    uaParams(params){
        let keys = Object.keys(params);
        let paramsText = '';
        for(let key of keys){
            paramsText += (key + '=' + params[key]);
        }
        const rsaKey = new NodeRsa();
        rsaKey.importKey(global.setting.rsa_private_pkcs8_pem, 'pkcs8-private-pem');
        const privateRsaKey = rsaKey.exportKey();
        const signature = new NodeRsa(privateRsaKey, {signingScheme: 'sha1'})
            .sign(paramsText).toString('base64');
        return encodeURIComponent(signature);
    }
}