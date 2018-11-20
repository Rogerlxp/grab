import ajax from '../lib/ajax';

export default function(dispatch){
    ajax.get('/api/crawlRule/getList')
        .then(res=>{
            const value = res.value;
            dispatch({type: 'table.setValue', value, key: 'list'});
        });
}