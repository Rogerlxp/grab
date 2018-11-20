import * as React from 'react';
import {connect} from 'react-redux';
import pageLib from '../lib/page';
import List from '../component/table/List';
import Filter from '../component/table/ListFilter';
import Component from '../lib/Component';
import freshList from '../action/freshGeneralList';
const CP_API_LIST = require('../../common/listFields/CP_API_LIST');
const CP_API_LIST_FILTER = require('../../common/filter/CP_API_LIST');
class SelfServiceTransfer extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            fields: CP_API_LIST,
            isAbleAddItem: false,
            queryFields: CP_API_LIST_FILTER
        });
    }
    render(){
        return (
            <div id="cp-transfer">
                <Filter freshList={freshList} />
                <List freshList={freshList} />
            </div>
        );
    }
}

const mapState = function(state){
    return state.table;
};

const container = connect(mapState)(SelfServiceTransfer);

export default container;