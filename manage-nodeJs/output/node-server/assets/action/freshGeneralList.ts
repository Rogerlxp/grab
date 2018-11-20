import store from '../reducer';
import handy from '../lib/handy';
import getList from './getGeneralList';
import {
    message
} from 'antd';
export default async function () {
    const {res, listConfig} = await getList.call(this);
    if(res.code === 200){
        // get list
        let list;
        if(listConfig && listConfig.listMap){
            list = handy.getValueByPath(res, listConfig.listMap);
        }else{
            list = res.value.items;
        }
        list = list || [];
        // get total
        let total;
        if(listConfig && listConfig.totalMap){
            if(listConfig.totalMap === false){
                total = list.length;
            }else{
                total = handy.getValueByPath(res, listConfig.totalMap); 
            }
        }else{
            total = res.value.count;
        }
        store.dispatch({
            type: 'table.setValue',
            value: {
                list,
                total
            }
        });
        // console.log('list load finished.');
    }else{
        message.error('查询列表失败');
        store.dispatch({
            type: 'table.setValue',
            value: {
                list: [],
                total: 0
            }
        });
    }
    store.dispatch({
        type: 'table.setValue',
        key: 'isLoading',
        value: false
    });
};