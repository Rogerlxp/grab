import ajax from '../lib/ajax';
import API from '../const/API';
const FILTERS_DEFINED = require('../../common/filter/index.js');
import {
    message
} from 'antd';
const URI = require('urijs');
interface PAYLOAD{
    dbName: string;
    tableName:string;
    offset:number;
    pageSize:number;
    filter?:{[key:string]:string};
    sortBy?:string;
    sortOrder?:string;
    exposeType?:string;
}
interface ARGUMENT{
    exposeType?:string;
}
const freshList = async function(arg:ARGUMENT = {}){
    const exposeType = arg.exposeType;
    // console.log('arg: ', arg);
    const props = this.props;
    if(!props.tableName || !props.dbName){
        const errMsg = `Can not find dbName and tableName.`;
        throw new Error(errMsg);
    }
    const uri = new URI();
    const query = uri.query(true);
    const page = props.page || 1;
    const pageSize = props.pageSize || 10;
    // console.log('page: ', page);
    let dispatch = props.dispatch;
    const queryUrl = API.queryTable.url;
    const payload:PAYLOAD = {
        dbName: props.dbName,
        tableName: props.tableName,
        offset: (page - 1) * pageSize,
        pageSize: pageSize
    };
    // filter
    const filterQuery = {};
    props.queryFields.forEach(queryField=>{
        if([null, undefined, ''].includes(queryField.value)){
            return;
        }
        // console.log(filterDef);
        if(queryField.searchMode && queryField.searchMode.toUpperCase() === 'LIKE'){
            filterQuery[queryField.keyName] = `%${queryField.value}%`;
            return;
        }
        filterQuery[queryField.keyName] = queryField.value;
    });
    Object.keys(query).forEach(key=>{
        const field = props.fields.find(each=>each.keyName === key);
        if(field){
            filterQuery[key] = query[key];
            if(field.valueType === 'number'){
                filterQuery[key] = +filterQuery[key];
            }
        }
    });
    const filterKeys = Object.keys(filterQuery);
    if(filterKeys.length){
        payload.filter = filterQuery;
    }
    // sort
    if(query.sortBy){
        const order = query.sortOrder || 'ASC';
        payload.sortBy = query.sortBy;
        payload.sortOrder = order;
    }
    if(exposeType){
        payload.exposeType = exposeType;
        const uri = new URI(queryUrl);
        Object.keys(payload).forEach(key=>{
            if(payload[key] && typeof payload[key] === 'object'){
                uri.setQuery(key, encodeURIComponent(JSON.stringify(payload[key])));
            }else{
                uri.setQuery(key, payload[key]);
            }
        });
        window.location.assign(uri.toString());
    }else{
        // clear all data and set loading state
        dispatch({type: 'table.setValue', value: [], key: 'list'});
        dispatch({type: 'table.setValue', value: 0, key: 'total'});
        dispatch({type: 'table.setValue', value: true, key: 'isLoading'});
        const res = await ajax.post(queryUrl, payload);
        dispatch({type: 'table.setValue', value: false, key: 'isLoading'});
        if(res.code === 200 && res.value){
            const value = res.value;
            if(Array.isArray(value.list)){
                dispatch({type: 'table.setValue', value: value.list, key: 'list'});
                dispatch({type: 'table.setValue', value: value.total, key: 'total'});
                // else{
                //     if(page > 1){
                //         let validPage = 1;
                //         if(page - 1 > 1){
                //             validPage = page - 1;
                //         }
                //         const uri = new URI();
                //         uri.setQuery('page', validPage);
                //         this.props.history.push(uri.pathname() + '?' + uri.query());
                //     }
                // }
            }
        }else{
            message.error(res.message);
        }
    }
}

export default freshList;