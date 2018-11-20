import {
    message
} from 'antd';
import ajax from '../lib/ajax';
import API from '../const/API';
import handy from '../lib/handy';
import distributionLib from '../lib/distribution';
const URI = require('urijs');
export default async function(isForceRefresh){
    const uri = new URI();
    const query = uri.query(true);
    const disId = query.disId;
    const loading = ()=>{
        this.props.dispatch({type: 'table.setValue', value: [], key: 'list'});
        this.props.dispatch({type: 'table.setValue', value: 0, key: 'total'});
        this.props.dispatch({type: 'table.setValue', value: true, key: 'isLoading'});
    }
    const stopLoading = ()=>{
        this.props.dispatch({type: 'table.setValue', value: false, key: 'isLoading'});
    }
    loading();
    if(!this.props.serverAlgorithmInfo || isForceRefresh === true){
        // first load
        const disInfoRes = await ajax.get(API.getOneFromTable.url, {dbName: 'MEIZU_CONTENTS', tableName: 'T_CONTENT_DIS', keyName: 'FID', keyValue: disId});
        if(disInfoRes.code !== 200){
            message.error('获取当前配置错误：' + disInfoRes.message);
            stopLoading();
            return;
        }
        const serverAlgorithmInfo = disInfoRes.value;
        const order = serverAlgorithmInfo.FORDER === null ? null : serverAlgorithmInfo.FORDER;
        const serverAlgorithmName = serverAlgorithmInfo.FALGOVER === null ? '' : serverAlgorithmInfo.FALGOVER;
        await this.props.dispatch({type: 'contentAlgorithm.setValue', value: {
            serverAlgorithmInfo,
            orderType: order,
            selectedAlgorithm: serverAlgorithmName,
            displayStyle: serverAlgorithmInfo.FDISPLAY_STYLE,
            openType: serverAlgorithmInfo.FOPEN_TYPE,
            disCount: serverAlgorithmInfo.FDIS_COUNT,
            page: serverAlgorithmInfo.FPAGE
        }});
        await distributionLib.getConditions.call(this, serverAlgorithmName);
        await distributionLib.getCategory.call(this,serverAlgorithmName);
    }
    const apiUri = new URI('http://om.iflow.meizu.com/service/dis/list');
    const start = (this.props.page - 1) * 10;
    const limit = this.props.pageSize;
    // console.log(JSON.stringify(this.props.conditions));
    const param:any = {
        disId: disId,
        algoVer: this.props.selectedAlgorithm
    };
    if(this.props.selectedAlgorithm === ''){
        param.conditions = this.props.conditions.map(each=>{
            // id is not needed
            delete each.id;
            return each;
        });
        param.orderType = this.props.orderType;
        param.page = this.props.page;
        param.displayStyle = this.props.displayStyle;
        param.openType = this.props.openType;
        param.disCount = this.props.disCount;
    }else{
        // console.log('cp conditions: ' +JSON.stringify(this.props.cpConditions));
        let cpCondition = this.props.cpConditions[this.props.selectedAlgorithm];
        if(cpCondition){
            cpCondition = handy.copyObj(cpCondition);
            if(cpCondition.category){
                const category = this.props.category[this.props.selectedAlgorithm];
                const foundCategory = category.find(each=>each.id === cpCondition.category);
                if(foundCategory){
                    cpCondition.category = foundCategory.name;
                }
            }
            param.conditions = [cpCondition];
        }else{
            param.conditions = [];
        }
    }
    console.log('param: ' + JSON.stringify(param));
    apiUri.setQuery('start', start);
    apiUri.setQuery('limit', limit);
    apiUri.setQuery('param', JSON.stringify(param));
    const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()});
    if(res.code !== 200){
        message.error('预览列表失败');
        stopLoading();
        return;
    }
    const resValue = res.value || {};
    const list = resValue.newsVo || [];
    const total = resValue.total || 0;
    this.props.dispatch({type: 'table.setValue', value: list, key: 'list'});
    this.props.dispatch({type: 'table.setValue', value: total, key: 'total'});
    stopLoading();
}