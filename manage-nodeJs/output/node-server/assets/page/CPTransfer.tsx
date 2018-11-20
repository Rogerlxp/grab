import * as React from 'react';
import {connect} from 'react-redux';
import pageLib from '../lib/page';
import List from '../component/table/List';
import Filter from '../component/table/ListFilter';
import Component from '../lib/Component';
import freshList from '../action/freshGeneralList';
const CP_LIST = require('../../common/listFields/CP_LIST');
const CP_LIST_FILTER = require('../../common/filter/CP_LIST');
class SelfServiceTransfer extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            fields: CP_LIST,
            isAbleAddItem: true,
            queryFields: CP_LIST_FILTER
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