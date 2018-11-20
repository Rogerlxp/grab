import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import List from '../component/table/List';
import MakeUrlModal from '../component/Modal/MakeUrl';
import MakeSchemeModal from '../component/Modal/MakeScheme';
import ListFilter from '../component/table/ListFilter';
import freshContentList from '../action/freshGeneralList';
import Component from '../lib/Component';
import pageLib from '../lib/page';

const SPECIAL_ARTICLES = require('../../common/listFields/SPECIAL_ARTICLES.js');
const SPECIAL_ARTICLES_FILTERS = require('../../common/filter/SPECIAL_ARTICLES.js');

class MainComponent extends Component {
    constructor(props){
        super(props);
        const pageConfig = {
            fields: SPECIAL_ARTICLES,
            queryFields: SPECIAL_ARTICLES_FILTERS,
            queryType: 'redux'
        };
        pageLib.setPageConfig(pageConfig);
    }
    freshList = freshContentList;
    render(){
        return (
            <div className="contents-page">
                <ListFilter freshList={this.freshList} />
                <List freshList={this.freshList} />
                <MakeUrlModal />
                <MakeSchemeModal />
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
