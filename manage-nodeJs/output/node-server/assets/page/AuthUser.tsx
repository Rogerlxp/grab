import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import List from '../component/table/List';
import ListFilter from '../component/table/ListFilter';
import BatchSetModal from '../component/Modal/BatchSet';
import freshContentList from '../action/freshGeneralList';
import Component from '../lib/Component';
import pageLib from '../lib/page';

const AUTH_USER = require('../../common/listFields/AUTH_USER');
const AUTH_USER_FILTER = require('../../common/filter/AUTH_USER');

class MainComponent extends Component {
    constructor(props){
        super(props);
        const pageConfig = {
            fields: AUTH_USER,
            queryFields: AUTH_USER_FILTER,
            queryType: 'redux',
            isAbleAddItem: true
        };
        pageLib.setPageConfig(pageConfig);
    }
    freshList = freshContentList;
    render(){
        return (
            <div className="auth-user">
                <ListFilter freshList={this.freshList} />
                <List freshList={this.freshList} />
                <BatchSetModal def="ROLE_LIST" />
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
