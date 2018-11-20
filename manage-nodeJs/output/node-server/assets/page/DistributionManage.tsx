import * as React from 'react';
import Component from '../lib/Component';
import {connect} from 'react-redux';
import TableList from '../component/table/List';
import DisFilter from '../component/table/DisFilter';
import freshDisList from '../action/freshDistributionPreview';
import EditDisItemStyleModal from '../component/Modal/EditDistItemStyle';
import pageLib from '../lib/page';
const DIS_MANAGE_PREVIEW = require('../../common/listFields/DIS_MANAGE_PREVIEW');
import '../sass/page/disManage.scss';
class DistributionManage extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            fields: DIS_MANAGE_PREVIEW
        });
    }
    componentWillUnmount(){
        this.props.setDisManageValue('disInfo', {});
        this.props.dispatch({
            type: 'breadcrumb.setValue',
            key: 'extraLinks',
            value: []
        });
    }
    render(){
        return <div className="distribution-manage-page">
            <DisFilter />
            <TableList freshList={freshDisList} />
            <EditDisItemStyleModal freshList={freshDisList.bind(this)} />
        </div>
    }
}
const mapStateToProps = function(state){
    const props = state.table;
    props.disInfo = state.disManage.disInfo;
    props.conditions = state.disManage.conditions;
    return props;
};
const mapDispatchToProps = function(dispatch){
    return {
        setTableValue: (key, value)=>{dispatch({type: 'table.setValue', key, value})},
        setDisManageValue: (key, value)=>{dispatch({type: 'disManage.setValue', key, value})},
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DistributionManage);