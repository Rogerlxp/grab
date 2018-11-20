import * as React from 'react';
import Component from '../lib/Component';
import {connect} from 'react-redux';
import Filter from '../component/table/ListFilter';
import List from '../component/table/List';
import freshList from '../action/freshTableList';
import pageLib from '../lib/page';
const T_CONTENT_VIEW_STATUS = require('../../common/db/T_CONTENT_VIEW_STATUS');
class DistributionManage extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            fields: T_CONTENT_VIEW_STATUS,
            tableName: 'T_CONTENT_VIEW_STATUS',
            init: ['initOMParameter']
        });
    }
    render(){
        return <div className="distribution-control-page">
            <Filter />
            <List freshList={freshList} />
        </div>
    }
}
const mapStateToProps = function(state){
    const props = state.table;
    return props;
}
const mapDispatchToProps = function(dispatch){
    return {
        setTableValue: (key, value)=>{dispatch({type: 'table.setValue', key, value})},
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DistributionManage);