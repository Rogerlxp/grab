import * as React from 'react';
import Component from '../lib/Component';
import pageLib from '../lib/page';
import freshList from '../action/freshAuthorArticles';
import List from '../component/table/List';
const AUTHOR_ARTICLES = require('../../common/listFields/AUTHOR_ARTICLES');

class MainComponent extends Component {
    constructor(props){
        super(props);
        const pageConfig = {
            fields: AUTHOR_ARTICLES,
        };
        pageLib.setPageConfig(pageConfig);
    }
    render(){
        return (
            <div className="author-articles-page">
                <List freshList={freshList} />
            </div>
        )
    }
}

export default MainComponent;