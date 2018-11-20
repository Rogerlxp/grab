import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {
    Breadcrumb,
    Icon
} from 'antd';
import PATH_NAME_MAP from '../const/PATH_NAME_MAP';
const shortid = require('shortid');
const PATHS = PATH_NAME_MAP.map(each=>{
    each.key = shortid.generate();
});
const BreadcrumbCp = function(props){
    const BreadcrumbItem = Breadcrumb.Item;
    let pathname = props.location.pathname;
    let allPaths = pathname.split('/');
    let paths = allPaths.filter(eachPath => {
        return !!eachPath;
    }).slice();
    const links = paths.map(path=>{
        const link = PATH_NAME_MAP.find(each=>each.keyName === path);
        if(!link){
            return;
        }
        if(link.isHide){
            return;
        }
        return link;
    }).concat(props.extraLinks).filter(each=>!!each);
    // console.log('links: ', links);
    const items = links.map(link=>{
        let iconEl:JSX.Element|string = '';
        if(link.icon){
            iconEl = <Icon type={link.icon} />;
        }
        let linkEl:JSX.Element = link.name;
        const linkProps:any = {};
        if(link.isCurrentLink){
            linkProps.to = window.location.pathname + window.location.search;
        }else if(link.link){
            linkProps.to = link.link;
        }
        if(linkProps.to){
            linkEl = <Link {...linkProps}>{link.name}</Link>
        }
        return <BreadcrumbItem key={link.key}>{iconEl}<span>{linkEl}</span></BreadcrumbItem>
    });
    return (
        <Breadcrumb>
            {items}
        </Breadcrumb>
    )
}
const mapState = function(state){
    return state.breadcrumb;
}
const component:any = connect(mapState)(BreadcrumbCp);
export default withRouter(component);
