const ajax = require('axios');
const fs = require('fs-extra');
const path = require('path');
let setting = {};
const COMMON_CONFIG_URL = 'http://yard.meizu.com/conf/contents/common/V1.0';
const NODE_CONFIG_URL = 'http://yard.meizu.com/conf/contents/contents-manager/V1.0';
setting.init = async function(){
    global.setting.parentUrl = global.setting.isDev ? 'local.meizu.com' : 'om.iflow.meizu.com';
    global.setting.protocol = 'http://';
    global.setting.port = global.setting.isDev ? 3000 : 80;
    global.setting.serverPort = 3000;
    global.setting.baseUrl = global.setting.protocol + global.setting.parentUrl + ':' + global.setting.port;
    const nodeRes = await ajax.get(NODE_CONFIG_URL);
    const commonRes = await ajax.get(COMMON_CONFIG_URL);
    const setToGlobal = function(res, name){
        if(res.status === 200){
            // console.log(res.data);
            const settingFilePath = path.join(global.setting.cwd, 'server', 'temp', name+'.prop');
            fs.ensureFileSync(settingFilePath);
            fs.writeFileSync(settingFilePath, res.data, 'utf-8');
            const match = res.data.match(/^([^#].+=.+)/gm);
            for(let m of match){
                let mArr = m.match(/([^=]*)=(.*)/);
                if(mArr.length === 3){
                    let key = mArr[1].trim();
                    let val = mArr[2].trim();
                    if(val === 'true'){
                        val = true;
                    }
                    if(val === 'false'){
                        val = false;
                    }
                    if(global.setting[key] === undefined){
                        global.setting[key] = val;
                    }
                }
            }
            // console.log(global.setting);
            return global.setting;
        }else{
            throw new Error('Can not get configuration. Server start failed.');
        }
    }
    setToGlobal(commonRes, 'common');
    setToGlobal(nodeRes, 'node');
    // console.log(global.setting);
}
module.exports = setting;