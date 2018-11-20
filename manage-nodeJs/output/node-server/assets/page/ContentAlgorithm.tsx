import * as React from 'react';
import Component from '../lib/Component';
import {connect} from 'react-redux';
import TableList from '../component/table/List';
import ContentAlgorithmFilter from '../component/table/ContentAlgorithmFilter';
import freshAlgorithmContents from '../action/freshAlgorithmContents';
import pageLib from '../lib/page';
const PREVIEW_CONTENT = require('../../common/db/CONTENT_ALGORITHM.js');
import '../sass/page/contentAlgorithm.scss';
class DistributionManage extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            fields: PREVIEW_CONTENT
        });
    }
    componentWillUnmount(){

    }
    render(){
        return <div className="content-algorithm-page">
            <ContentAlgorithmFilter />
            <TableList freshList={freshAlgorithmContents.bind(this)} />
        </div>
    }
}
const mapStateToProps = function(state){
    const props = state.contentAlgorithm;
    props.page = state.table.page;
    props.pageSize = state.table.pageSize;
    return props;
};
const mapDispatchToProps = function(dispatch){
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DistributionManage);