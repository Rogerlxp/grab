import * as React from 'react';
import {connect} from 'react-redux';
import pageLib from '../lib/page';
import TableList from '../component/table/List';
import Filter from '../component/table/ListFilter';
import Component from '../lib/Component';
import freshList from '../action/freshTransferList';
const fieldList = require('../../common/listFields/GRAB_RULES');
const queryFields = require('../../common/filter/GRAB_RULES');
class Grab extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({

        });
    }
    render(){
        return (
            <div id="grab">
                <TableList freshList={freshList} />
            </div>
        );
    }
}

const mapState = function(state){
    return state.table;
};

const container = connect(mapState)(Grab);

export default container;