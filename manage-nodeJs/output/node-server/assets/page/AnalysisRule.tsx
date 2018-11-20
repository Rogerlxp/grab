import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import List from '../component/table/List';
import ListFilter from '../component/table/ListFilter';
import freshContentList from '../action/freshGeneralList';
import SelectAnalysisRule from '../component/Modal/SelectAnalysisRule';
import Component from '../lib/Component';
import pageLib from '../lib/page';

const ANALYSIS_RULE = require('../../common/listFields/ANALYSIS_RULE.js');
const ANALYSIS_RULE_FILTER = require('../../common/filter/ANALYSIS_RULE.js');

class MainComponent extends Component {
    constructor(props){
        super(props);
        const pageConfig = {
            fields: ANALYSIS_RULE,
            queryFields: ANALYSIS_RULE_FILTER,
            queryType: 'redux',
            isAbleAddItem: true
        };
        pageLib.setPageConfig(pageConfig);
    }
    freshList = freshContentList;
    render(){
        return (
            <div className="contents-page">
                <ListFilter freshList={this.freshList} />
                <List freshList={this.freshList} />
                <SelectAnalysisRule />
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
