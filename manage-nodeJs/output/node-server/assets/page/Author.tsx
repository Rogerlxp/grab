import '../sass/page/author.scss';
import * as React from 'react';
import Component from '../lib/Component';
import AuthorArticlesPreview from '../component/Modal/AuthorArticlesPreview';
import {connect} from 'react-redux';
const AUTHOR_FIELDS = require('../../common/db/T_AUTHOR.js');
import List from '../component/table/List';
import freshList from '../action/freshTableList';
import Filter from '../component/table/ListFilter';
import pageLib from '../lib/page';

const URI = require('urijs');
class AuthorPage extends Component{
    constructor(props){
        super(props);
        pageLib.setPageConfig({
            tableName: 'T_AUTHOR',
            fields: AUTHOR_FIELDS,
        });
    }
    render(){
        return (<div id="author-manage">
            <Filter />
            <List freshList={freshList}  />
            <AuthorArticlesPreview />
        </div>);
    }
}

const mapStateToProp = (state, props)=>{
    return state.table;
}
const mapDispatchToProps = (dispatch)=>{
    return {
        setTableValue: (key, value)=>dispatch({type: 'table.setValue', value, key}),
        dispatch,
    }
}
export default connect(
    mapStateToProp,
    mapDispatchToProps
)(AuthorPage);