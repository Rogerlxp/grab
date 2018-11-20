import * as React from 'react';
import {connect} from 'react-redux';
import List from '../component/table/List';
import Filter from '../component/table/ListFilter';
import freshList from '../action/freshTableList';
import Component from '../lib/Component';
import pageLib from '../lib/page';
const T_CONTENT_DIS = require('../../common/db/T_CONTENT_DIS.js');
const URI = require('urijs');

class MainComponent extends Component {
    constructor(props){
        super(props);
        this.state = {};
        pageLib.setPageConfig({
            fields: T_CONTENT_DIS,
            tableName: 'T_CONTENT_DIS',
            dbName: 'MEIZU_CONTENTS',
            isAbleAddItem: true
        });
    }
    render(){
        return (
            <div className="distribution-page">
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