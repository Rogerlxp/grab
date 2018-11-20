import * as React from 'react';
import {connect} from 'react-redux';
import pageLib from '../lib/page';
import List from '../component/table/List';
import Component from '../lib/Component';
import freshList from '../action/freshTableList';
const CHANNEL_LIST = require('../../common/db/T_CHANNEL');
class SelfServiceTransfer extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            fields: CHANNEL_LIST,
            isAbleAddItem: true,
            tableName: 'T_CHANNEL'
        });
    }
    render(){
        return (
            <div id="channel-list">
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