import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import List from '../component/table/List';
import DistributeModal from '../component/Modal/Distribute';
import MakeUrlModal from '../component/Modal/MakeUrl';
import MakeSchemeModal from '../component/Modal/MakeScheme';
import QueryFilter from '../component/table/QueryFilter';
import freshContentList from '../action/freshContentList';
import Component from '../lib/Component';
import pageLib from '../lib/page';
const CONTENT_LIST = require('../../common/listFields/CONTENT_LIST.js');
const CONTENT_QUERY_FIELDS = require('../../common/filter/CONTENT_FILTER.js');
const URI = require('urijs');

class MainComponent extends Component {
    constructor(props){
        super(props);
        this.state = {};
        const uri = new URI();
        const query = uri.query(true);
        const keys = Object.keys(query);
        const queryFields = JSON.parse(JSON.stringify(CONTENT_QUERY_FIELDS));
        for(const key of keys){
            for (const field of queryFields) {
                if(key === field.keyName){
                    field.value = query[key];
                }
            }
        }
        const pageConfig = {
            fields: CONTENT_LIST,
            queryFields: queryFields,
            isAbleAddItem: true,
            editModalWidth: 1080,
            queryType: 'redux'
        };
        pageLib.setPageConfig(pageConfig);
    }
    freshList = freshContentList;
    render(){
        return (
            <div className="contents-page">
                <QueryFilter freshList={this.freshList} />
                <List freshList={this.freshList} />
                <MakeUrlModal />
                <MakeSchemeModal />
                <DistributeModal />
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
