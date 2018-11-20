import ajax from '../lib/ajax';
import API from '../const/API';
import {
    message
} from 'antd';
const URI = require('urijs');
// some resource no need to request many times repeatedly.
// so just return cache value.
const cache:any = {
    freeOrNotCP: [],
    chargeCP: [],
    maxExposeAmount: 0,
    isRes: false,
    channelOptions: []
};
const actions:any = [{
    name: 'initOMParameter',
    action: async function(){
        if(cache.isRes === true){
            return;
        }
        const res = await ajax.post(API.queryOne.url, {
            tableName: 'T_OM_PARAMETER',
            selectFields: [{keyName: 'FVALUE'}],
            filter: {
                FTYPE: 'cp',
                FKEY: 'view_count_limit'
            }
        });
        if(res.code === 200){
            if(!res.value.FVALUE){
                console.error('配置平台未填写“收费CP”和“CP浏览量最大值”');
                return;
            }
            cache.isRes = true;
            // max
            // the server response value is not a valid json.
            const valueArray = res.value.FVALUE.replace(/[\{\}]/, '').split(',').map(each=>each.trim());
            const value = {};
            valueArray.forEach(each=>{
                const eachArr = each.split(':').map(each=>each.trim().replace(/\'/g, ''));
                value[eachArr[0]] = +(eachArr[1]);
            });
            cache.maxExposeAmount = +(value['-1']);
            // options
            const options = [];
            const keys = Object.keys(value);
            const chargeCP = [];
            for(const key of keys){
                if(key === '-1'){
                    continue;
                }
                chargeCP.push(key);
            }
            const str = chargeCP.join(',');
            options.push({
                name: '是',
                value: str
            });
            // options.push({
            //     name: '否',
            //     value: '!=' + str
            // });
            cache.freeOrNotCP = options;
            // charge cp
            cache.chargeCP = chargeCP.map(id=>+id);
            console.log('cache: ', cache);
        }
    }
}, {
    name: 'maxExposeAmount',
    action: function(){
        return cache.maxExposeAmount;
    }
}, {
    name: 'freeOrNotCP',
    action: function(){
        return cache.freeOrNotCP
    }
}, {
    name: 'sum-row',
    action: function(record){
        if(record && record.key === 'sum'){
            return 'sum-row';
        }else{
            return '';
        }
    }
}, {
    name: 'isFreeOrNotRow',
    action: function (record) {
        const uri = new URI();
        const query = uri.query(true);
        if(!query){
            return '';
        }
        let filter = query.filter;
        if(!filter){
            return '';
        }
        if(typeof filter === 'string'){
            filter = JSON.parse(decodeURIComponent(filter));
        }
        if(filter.FCPID){
            return '';
        }else{
            const cps = cache['chargeCP'];
            // console.log('cps: ', cps);
            const id = record['FCPID'];
            // console.log('green: ', id);
            if(cps.includes(id)){
                return 'green';
            }else{
                return '';
            }
        }
    }
}];
actions.push({
    name: 'highlightAddedDistribution',
    action: function(record){
        if(record.fliterOrder !== 0){
            return 'green';
        }
        return '';
    }
});

actions.push({
    name: 'changeVideoStatus',
    action: async function(){
        await this.props.dispatch({
            type: 'fields.setValue',
            value: {
                status: 2
            }
        });
    }
});
// let baseDataTypes;
// actions.push({
//     name: 'baseDataTypes',
//     action: function(isReload:boolean){
//         baseDataTypes = async function(){
            
//         }();
//     }
// });
actions.push({
    name: 'initChannelList',
    action: async function(){
        const res = await ajax.get(API.queryTable.url, {
            tableName: 'T_CHANNEL',
        });
        if(res.code === 200){
            const list = res.value.list || [];
            const channelIdSet = [];
            cache['subChannelOptions'] = list.map(each=>{
                if(channelIdSet.some(eachChannel=>eachChannel.value === each.FCHANNEL_ID) === false){
                    channelIdSet.push({
                        name: each.FNAME,
                        value: each.FCHANNEL_ID
                    });
                }
                return {
                    name: each.FCNAME,
                    value: each.FID,
                    row: each
                }
            });
            cache['channelOptions'] = channelIdSet;
            return;
        }
        throw new Error('Can not fetch channel list: ' + JSON.stringify(res));
    }
});
actions.push({
    name: 'channelOptions',
    action: function(){
        return cache['channelOptions'];
    }
});
actions.push({
    name: 'subChannelOptions',
    action: function(){
        return cache['subChannelOptions'];
    }
});
export default actions;