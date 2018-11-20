import * as React from 'react';
import {connect} from 'react-redux';
import {
    Menu,
    Icon,
    Row,
    Col
} from 'antd';
import {Link} from 'react-router-dom';
import ajax from '../lib/ajax';
const URI = require('urijs');
const SYSTEM = require('../../common/SYSTEM.js');
import PATH_MAP from '../const/PATH_NAME_MAP';
import NAV_LINKS from '../const/NAV_LINKS';
const logoPNG = require('../img/logo.png');
const urlPrefix = '/'+SYSTEM.urlVersion.value;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;
class Navigation extends React.Component<any, any>{
    constructor(props){
        super(props);
        // active item
        const uri = new URI();
        let pathname = uri.pathname();
        const defaultSelectedKeys = [pathname];
        // let allPaths = pathname.split('/');
        // let paths = allPaths.filter(eachPath => {
        //     return !!eachPath;
        // }).slice();
        // paths.shift(); // remove 'v2'
        // paths.shift(); // remove 'page'
        // // defaultSelectedKeys
        // const defaultSelectedKeys = [];
        // paths.forEach(pathUrl=>{
        //     const foundLink = PATH_MAP.find(each=>each.keyName === pathUrl);
        //     if(foundLink){
        //         defaultSelectedKeys.push(foundLink.name)
        //     }
        // })
        this.state = {
            defaultSelectedKeys
        };
    }
    async componentDidMount(){
        let res = await ajax.get(urlPrefix + '/api/user/getInfo');
        const userInfo = res.value;
        Object.keys(userInfo).forEach(key=>this.props.setUserValue(key, userInfo[key]));
    }
    render(){
        const props = this.props;
        let loginNav = function(){
            if(props.user.name){
                return (
                <SubMenu title={<span className="submenu-title-wrapper"><Icon type="user" />{props.user.name}</span>}>
                        <MenuItemGroup>
                            <MenuItem><a href={urlPrefix + '/api/user/logout'}><Icon type="logout"></Icon>退出登录</a></MenuItem>
                        </MenuItemGroup>
                    </SubMenu>
                );
            }else{
                return (
                    <MenuItem>
                        <Icon type="user" /><a href={urlPrefix + '/api/user/login'}><Icon type="login"></Icon>登录</a>
                    </MenuItem>
                );
            }
        }
        NAV_LINKS.forEach((link, index)=>{
            if(props.user.permissions.includes('authorization')){
                NAV_LINKS[index].isShow = true;
                return;
            }
            if(props.user.permissions.includes(link.permissionRequired)){
                NAV_LINKS[index].isShow = true;
            }
        });
        // links = links.filter(link=>link.isShow);
        const navItems = NAV_LINKS.map(link=>{
            if(Array.isArray(link.links)){
                const items = link.links.map(l=>{
                    if(l.isHardRedirect){
                        return <MenuItem key={l.href}><a href={l.href}>{l.name}</a></MenuItem>
                    }else{
                        return <MenuItem key={l.href}><Link to={l.href}>{l.name}</Link></MenuItem>
                    }
                });
                return <SubMenu title={link.name} key={link.name}>
                    <MenuItemGroup>
                        {items}
                    </MenuItemGroup>
                </SubMenu>
            }else{
                if(link.isHardRedirect){
                    return <MenuItem key={link.href}><a href={link.href}>{link.name}</a></MenuItem>
                }else{
                    return <MenuItem key={link.href}><Link to={link.href}>{link.name}</Link></MenuItem>
                }
            }
        });
        const homeUrl = urlPrefix + '/page/contents';

        return (
            <Row justify="space-between" className="navigation">
                <Col span={22}>
                    <Menu mode="horizontal" theme="dark" defaultSelectedKeys={this.state.defaultSelectedKeys}>
                        <MenuItem className="nav-brand"><Link to={homeUrl}><img src={logoPNG} /></Link></MenuItem>
                        {navItems}
                    </Menu>
                </Col>
                <Col span={2}>
                    <Menu mode="horizontal" className="nav-user" theme="dark">
                        {loginNav()}
                    </Menu>
                </Col>
            </Row>
        )
    }
}



const mapStateToProps = (state, props) => {
    return {user: state.user};
}
const mapDispatchToProps = dispatch => {
    return {
        setUserValue: (key, value)=>dispatch({type: 'user.setValue', value, key}),
        inputUserValue: (key, event)=>dispatch({type: 'user.setValue', value: event.target.value, key})
    }
}

const NavigationContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);

export default NavigationContainer;