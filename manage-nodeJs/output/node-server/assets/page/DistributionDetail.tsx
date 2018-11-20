import * as React from 'react';
import Component from '../lib/Component';
import {connect} from 'react-redux';
import TableList from '../component/table/List';
import Filter from '../component/table/ListFilter';
import freshList from '../action/freshTableList';
import pageLib from '../lib/page';
const T_CONTENT_VIEW_SUMMARY = require('../../common/db/T_CONTENT_VIEW_SUMMARY');
class DistributionManage extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            fields: T_CONTENT_VIEW_SUMMARY,
            tableName: 'T_CONTENT_VIEW_SUMMARY',
            init: ['initOMParameter']
        });
    }
    render(){
        return <div className="distribution-detail-page">
            <Filter />
            <TableList freshList={freshList} />
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