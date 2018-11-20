import ajax from '../lib/ajax';
import API from '../const/API';
import disLib from '../lib/distribution';
import {message} from 'antd';
const URI = require('urijs');
const shortid = require('shortid');
export default async function(){
    const url = 'http://om.iflow.meizu.com/service/dis/list';
    const queryArr = [];
    const uri = new URI();
    const query = uri.query(true);
    const page = this.props.page || 1;
    const pageSize = this.props.pageSize || 10;
    const disId = query.keyValue ? +(query.keyValue) : null;
    if(!disId){
        message.error('没有分发ID.');
        throw new Error('Can not fresh without dis id.');
    }
    // console.log('current page', this.props.page);
    queryArr.push('start=' + (page-1)*pageSize);
    queryArr.push('limit=' + pageSize);
    let disInfo = JSON.parse(JSON.stringify(this.props.disInfo));
    let conditions = JSON.parse(JSON.stringify(this.props.conditions));
    // console.log('conditions: ' + JSON.stringify(conditions));
    // console.log('fresh dis info: ', disInfo);
    const loading = ()=>{
        this.props.dispatch({type: 'table.setValue', value: [], key: 'list'});
        this.props.dispatch({type: 'table.setValue', value: 0, key: 'total'});
        this.props.dispatch({type: 'table.setValue', value: true, key: 'isLoading'});
    }
    const stopLoading = ()=>{
        this.props.dispatch({type: 'table.setValue', value: false, key: 'isLoading'});
    }
    loading();
    if(!disInfo.FID || disInfo.FID !== disId){
        console.log('first load dis info.');
        const disInfoRes = await ajax.get(API.getOneFromTable.url, {dbName: 'MEIZU_CONTENTS', tableName: 'T_CONTENT_DIS', keyName: 'FID', keyValue: disId});
        if(disInfoRes.code === 200){
            disInfo = disInfoRes.value;
            this.props.dispatch({type: 'disManage.setValue', key: 'disInfo', value: disInfo});
            this.props.dispatch({type: 'breadcrumb.setValue', key: 'extraLinks', value: [{
                name: disInfo.FNAME + `(ID: ${disInfo.FID})`,
                link: '',
                key: shortid.generate()
            }]});
        }
        if(disInfo.FID){
            // get default conditions
            conditions = await disLib.getDefaultCondition(disInfo);
            // if(!(Array.isArray(conditions) && conditions.length)){
            //     conditions = [{
            //         _key: shortid.generate(),
            //         FDISID: disId,
            //         FSUB_CATEGORY: {
            //             options: []
            //         }
            //     }];
            // }
            this.props.dispatch({type: 'disManage.setValue', key: 'conditions', value: conditions});
        }
    }
    if(!disInfo.FID){
        console.log('no dis id, no fresh.');
        stopLoading();
        return;
    }
    // if(!conditions){
    //     console.log('no condition, no fresh');
    //     stopLoading();
    //     return;
    // }
    if(Array.isArray(conditions)){
        // if(conditions.length === 0){
        //     console.log('can not get preview list by no condition.');
        //     stopLoading();
        //     return;
        // }
    }else{
        console.warn('distribution condition is not a array type value. please check this out if somewhere go wrong.');
    }
    const filteredConditions = conditions.filter(item=>item._action !== 'delete').map(item=>{
        return {
            cpId: item.FCPID,
            type: item.FTYPE,
            category: item.FCATEGORY,
            subCategory: item.FSUB_CATEGORY.value
        }
    });
    // console.log('dis info: ', JSON.stringify(disInfo));
    const param = {
        disId: disInfo.FID,
        displayStyle: disInfo.FDISPLAY_STYLE,
        openType: disInfo.FOPEN_TYPE,
        openUrl: null,
        orderType: disInfo.FORDER,
        disCount: disInfo.FDIS_COUNT,
        page: 1, // this is not pagination page, 0.不分页 1.分页
        conditions: filteredConditions
    };
    console.log('preview param: ', param);
    queryArr.push('param='+encodeURIComponent(JSON.stringify(param)));
    let serverUrl = API.serverRequest.url + '?' + 'url=' + encodeURIComponent(url + '?' + queryArr.join('&'));
    const queryRes = await ajax.get(serverUrl);
    if(queryRes.code === 200){
        if(queryRes.value && Array.isArray(queryRes.value.newsVo)){
            const list = queryRes.value.newsVo.map((item, index)=>{
                item.id = item.id + '';
                item.cpId = item.cpId + '';
                item.disId = disInfo.FID;
                item.position = index;
                return item;
            });
            //todo: change it to set table list
            this.props.dispatch({type: 'table.setValue', value: list, key: 'list'});
            this.props.dispatch({type: 'table.setValue', value: queryRes.value.total, key: 'total'});
        }else{
            // message.error('没有找到数据');
        }
    }else{
        message.error('获取列表失败：' + queryRes.message);
        // this.props.dispatch({type: 'table.setValue', value: [], key: 'list'});
    }
    stopLoading();
}