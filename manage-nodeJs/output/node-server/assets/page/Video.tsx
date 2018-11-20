import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import List from '../component/table/List';
import Filter from '../component/table/ListFilter';
import freshVideoList from '../action/freshGeneralList';
import Component from '../lib/Component';
import pageLib from '../lib/page';
const VIDEO_FIELDS = require('../../common/listFields/VIDEO');
const VIDEO_FILTER = require('../../common/filter/VIDEO');

class MainComponent extends Component {
    constructor(props){
        super(props);
        this.state = {};
        // console.log(VIDEO_FILTER);
        pageLib.setPageConfig({
            fields: VIDEO_FIELDS,
            queryFields: VIDEO_FILTER
        });
    }
    render(){
        return (
            <div className="contents-page">
                <Filter freshList={freshVideoList} />
                <List freshList={freshVideoList} />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
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

export default withRouter(MainContainer);