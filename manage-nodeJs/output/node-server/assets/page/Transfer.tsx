import * as React from 'react';
import Component from '../lib/Component';
import TableList from '../component/table/List';
import Filter from '../component/table/ListFilter';
import {connect} from 'react-redux';
import freshList from '../action/freshTableList';
import pageLib from '../lib/page';
import FunctionFields from '../../common/db/T_FUNCTION';
class Transfer extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            dbName: 'MEIZU_CONTENTS',
            tableName: 'T_FUNCTION',
            fields: FunctionFields,
            isAbleAddItem: true,
        });
    }
    render(){
        return (
            <div id="function-list">
                <Filter />
                <TableList freshList={freshList} />
            </div>
        );
    }
}

const mapState = function(state){
    return state.table;
}

export default connect(mapState)(Transfer);