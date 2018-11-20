import ajax from '../lib/ajax';
import {message} from 'antd';
// this is a function for freshing all kinds of list
export default async function () {
    const listUrl:string = this.props.listUrl;
    if(!listUrl){
        throw new Error('Please provide list url.');
    }
    const setTableValue = (key, value)=>{
        return this.props.dispatch({
            type: 'table.setValue',
            key,
            value
        });
    }
    const page:number = this.props.page;
    const pageSize:number = this.props.pageSize;
    const res = await ajax.get(listUrl);
    await setTableValue('isLoading', true);
    await setTableValue('list', []);
    await setTableValue('total', 0);
    if(res.code === 200){
        if(res.value && Array.isArray(res.value.list)){
            await setTableValue('list', res.value.list);
        }
    }else{
        message.error('获取列表数据失败：' + res.message);
    }
    await setTableValue('isLoading', false);
}