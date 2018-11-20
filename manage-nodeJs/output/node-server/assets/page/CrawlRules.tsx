import * as React from 'react';
import Component from '../lib/Component';
import List from '../component/table/List';
import Filter from '../component/table/ListFilter';
import {connect} from 'react-redux';
import pageLib from '../lib/page';
import CrawlTestModal from '../component/Modal/CrawlTest';
import freshList from '../action/freshTableList';
import CrawlFields from '../../common/db/T_CRAWL_RULE';
class CrawlRules extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            dbName: 'MEIZU_CONTENTS',
            tableName: 'T_CRAWL_RULE',
            fields: CrawlFields,
            isAbleAddItem: true,
        });
    }
    render(){
        return (
            <div id="crawl-rules">
                <Filter />
                <List freshList={freshList} />
                <CrawlTestModal />
            </div>
        );
    }
}

const mapState = function(state){
    return state.table;
}

export default connect(mapState)(CrawlRules);