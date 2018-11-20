import * as React from 'react';
import {connect} from 'react-redux';
import List from '../component/table/List';
import Filter from '../component/table/ListFilter';
import freshList from '../action/freshTableList';
import Component from '../lib/Component';
import pageLib from '../lib/page';
const CHANNEL_DISTRIBUTION = require('../../common/db/CHANNEL_DISTRIBUTION.js');
const CHANNEL_DISTRIBUTION_FILTER = require('../../common/filter/CHANNEL_DISTRIBUTION');
class MainComponent extends Component {
    constructor(props){
        super(props);
        this.state = {};
        pageLib.setPageConfig({
            fields: CHANNEL_DISTRIBUTION,
            tableName: 'CHANNEL_DISTRIBUTION',
            isAbleAddItem: true,
            queryFields: CHANNEL_DISTRIBUTION_FILTER,
            init: ['initChannelList']
        });
    }
    render(){
        return (
            <div className="channel-distribution-page">
                <Filter />
                <List freshList={freshList} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state.table;
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        setTableValue: (key, value)=>dispatch({type: 'table.setValue', value, key}),
    };
}
const MainContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainComponent);

export default MainContainer;