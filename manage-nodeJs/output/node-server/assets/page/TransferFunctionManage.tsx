import * as React from 'react';
import Component from '../lib/Component';
import Filter from '../component/table/ListFilter';
import TableList from '../component/table/List';
import {connect} from 'react-redux';
import pageLib from '../lib/page';
import freshList from '../action/freshTableList';
import FunctionRuleFields from '../../common/db/T_FUNCTION_RULE';
class Transfer extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            dbName: 'MEIZU_CONTENTS',
            tableName: 'T_FUNCTION_RULE',
            fields: FunctionRuleFields,
            isAbleAddItem: true,
        });
    }
    render(){
        return (
            <div id="function-rule-list">
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