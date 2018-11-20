import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import List from '../component/table/List';
import ListFilter from '../component/table/ListFilter';
import freshContentList from '../action/freshGeneralList';
import Component from '../lib/Component';
import pageLib from '../lib/page';

const ANALYSIS_SCRIPT = require('../../common/listFields/ANALYSIS_SCRIPT');
const ANALYSIS_SCRIPT_FILTER = require('../../common/filter/ANALYSIS_SCRIPT');

class MainComponent extends Component {
    constructor(props){
        super(props);
        const pageConfig = {
            fields: ANALYSIS_SCRIPT,
            queryFields: ANALYSIS_SCRIPT_FILTER,
            queryType: 'redux',
            isAbleAddItem: true
        };
        pageLib.setPageConfig(pageConfig);
    }
    freshList = freshContentList;
    render(){
        return (
            <div className="analysis-script">
                <ListFilter freshList={this.freshList} />
                <List freshList={this.freshList} />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return state.table;
}
const MainContainer = connect(
    mapStateToProps
)(MainComponent);

export default withRouter(MainContainer);
