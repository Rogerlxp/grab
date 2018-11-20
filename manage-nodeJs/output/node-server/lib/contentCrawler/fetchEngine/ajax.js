const iconv = require('iconv-lite');
const axios = require('axios');
module.exports = async function (url) {
    let res = await axios({
        url,
        method: 'get',
        responseType: 'arraybuffer',
        timeout: 30000
    });
    // console.log(res.headers);
    const contentType = res.headers['content-type'];
    let charset = '';
    let utf8Text = res.data.toString('utf-8');
    if(/charset/i.test(contentType)){
        const match = contentType.match(/charset=([^;]*)/i);
        charset = match[1];
    }else{
        let matchCharset = utf8Text.match(/<meta.*charset=(.*)\/>/);
        if(matchCharset){
            charset = matchCharset[1].trim().toLowerCase();
        }
    }
    console.log('charset: ' + charset);
    if(/(gbk)|(gb-?2312)/i.test(charset)){
        res.data = iconv.decode(res.data, 'gb2312');
    }else{
        res.data = utf8Text;
    }
    return res.data;
}