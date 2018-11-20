import * as React from 'react';
import {connect} from 'react-redux';
import store from '../../reducer';
import ajax from '../../lib/ajax';
import API from '../../const/API';
import buttonActions from '../../action/buttonActions';
const URI = require('urijs');
const timeFormat = require('lc-time-format');
import {
    Modal,
    Form,
    Input,
    message,
    Button,
    Spin
} from 'antd';
const AUTHOR_ARTICLES_API = window.location.protocol + '//om.iflow.meizu.com/service/author/content';
const defaultState = {
    isLoading: true,
    isMoreLoading: false,
    list: [],
    isNoMore: true,
    page: 1,
    pageSize: 10
};
const visitContentDef = buttonActions.find(def=>def.name === 'visitContent');
class AuthorArticlesPreview extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state = defaultState;
    }
    async freshList (){
        // console.log(this.props.authorArticlesPreview);
        const authorInfo = this.props.authorArticlesPreview.options;
        const currentUri = new URI();
        const currentQuery = currentUri.query(true);
        const page = this.state.page;
        const pageSize = this.state.pageSize;
        const authorId = authorInfo.FID;
        if(!authorId){
            throw new Error('author id is required.');
        }
        const apiUri = new URI(AUTHOR_ARTICLES_API);
        apiUri.setQuery('authorId', authorId);
        apiUri.setQuery('page', page);
        apiUri.setQuery('pageSize', pageSize);
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', apiUri.toString());
        this.setState({
            isMoreLoading: true
        });
        const res = await ajax.get(rdUri.toString());
        if(res.code === 200){
            const resList = res.value.items || [];
            const list = this.state.list.concat(resList);
            this.setState({
                list
            });
            if(resList.length < pageSize){
                this.setState({
                    isNoMore: true
                });
            }else{
                this.setState({
                    isNoMore: false
                });
            }
        }else{
            message.error('获取列表失败：' + res.message);
        }
        this.setState({
            isMoreLoading: false
        });
    }
    loadMore(){
        this.setState({
            page: this.state.page + 1
        }, this.freshList);
    }
    firstLoad(){
        setTimeout(async () => {
            this.setState({
                isLoading: true
            });
            await this.freshList();
            this.setState({
                isLoading: false
            });
        }, 10);
    }
    cleanState(){
        this.setState(defaultState);
    }
    shouldComponentUpdate(nextProp){
        if(!nextProp.authorArticlesPreview){
            // console.log('no props: ', nextProp.authorArticlesPreview);
            return false;
        }
        if(nextProp.authorArticlesPreview.isOpen){
            if(!this.props.authorArticlesPreview || !this.props.authorArticlesPreview.isOpen){
                // open modal
                this.firstLoad();
            }
        }
        if(nextProp.authorArticlesPreview.isOpen === false){
            if(this.props.authorArticlesPreview && this.props.authorArticlesPreview.isOpen){
                // close modal
                this.cleanState();
            }
        }
        return true;
    }
    closeModal(){
        store.dispatch({
            type: 'modal.toggle',
            modalName: 'authorArticlesPreview'
        });
    }
    complicateTime(publishTime){
        const oneDay = 86400000;
        const oneHour = 3600000;
        const oneMinute = 60000;
        const now = Date.now();
        const last = now - publishTime;
        if(last < oneDay){
            if(last < oneHour){
                if(last < oneMinute){
                    return '刚刚';
                }
                const minutes = last / 1000 / 60
                return Math.floor(minutes) + '分钟前';
            }
            const hours = last / 1000 /60 / 60;
            return Math.floor(hours) + '小时前';
        }
        return timeFormat(new Date(publishTime), 'd/m');
    }
    rowRender(row){
        const liProps:any = {
            key: row.contentId,
            onClick: visitContentDef.action.bind(this, row)
        };
        // console.log('row: ', row);
        const time = this.complicateTime(row.publishTime);
        let images = [];
        if(row.imgInfo){
            if(Array.isArray(row.imgInfo.bigImgInfos)){
                images = images.concat(row.imgInfo.bigImgInfos);
            }
        }
        if([0, 1].includes(row.type)){
            if(row.type === 0){
                images = images.slice(0, 1).map(info=>{
                    return <img src={info.url} key="1" />;
                });
            }
            liProps.className = 'type-zero';
            return (
                <li {...liProps}>
                    <div className="left">
                        <div className="title">{row.title}</div>
                        <div className="info"><span>{row.author}</span><span>{time}</span></div>
                    </div>
                    {row.type === 0 && <div className="right">
                        {images}
                    </div>}
                </li>
            );
        }else if([4].includes(row.type)){
            liProps.className = 'type-fourth';
            images = images.slice(0, 3).map(info=>{
                return <img src={info.url} key={info.url} />;
            });
            return (
                <li {...liProps}>
                    <div className="title">{row.title}</div>
                    <div className="images">{images}</div>
                    <div className="info"><span>{row.author}</span><span>{time}</span></div>
                </li>
            );
        }else if([7].includes(row.type)){
            liProps.className = 'type-seventh';
            images = images.slice(0,1).map(img=>{
                return <img src={img.url} key={img.url} />;
            });
            return (
                <li {...liProps}>
                    <div className="title">{row.title}</div>
                    <div className="cover">{images}</div>
                    <div className="info"><span>{row.author}</span><span>{time}</span></div>
                </li>
            );
        }
        return <li {...liProps}>{row.title}</li>
    }
    render(){
        const modalConfig = this.props.authorArticlesPreview || {};
        // console.log('config: ', modalConfig);
        const footer = <Button onClick={this.closeModal}>关闭</Button>;
        let content;
        if(this.state.isLoading){
            content = <div style={{display:'flex',justifyContent: 'center'}}><Spin /></div>;
        }else{
            // console.log('list: ', this.state.list);
            if(this.state.list.length){
                const list = this.state.list.map(this.rowRender.bind(this));
                content = <ul>{list}</ul>;
            }else{
                content = <div style={{display:'flex',justifyContent: 'center'}}>暂无数据</div>
            }
        }
        let more;
        if(this.state.isNoMore === false){
            more = <div className="more" onClick={this.loadMore.bind(this)}>{this.state.isMoreLoading ? '加载中...' : '查看更多'}</div>
        }
        return <Modal title={modalConfig.options && modalConfig.options.FNAME}
            footer={footer}
            maskClosable={false}
            onCancel={this.closeModal}
            className="author-articles-preview"
            visible={modalConfig.isOpen}>
            {content}
            {more}
        </Modal>
    }
}

const container = connect(function(state:any){
    return state.modal;
})(AuthorArticlesPreview);

export default container;