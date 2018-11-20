import * as React from 'react';
import {connect} from 'react-redux';
import freshContentList from '../../action/freshContentList';
import store from '../../reducer';
import {
    Modal,
    Form,
    Input,
    message,
    Divider,
    Select
} from 'antd';
import ajax from '../../lib/ajax';
import API from '../../const/API';
import SITE_INFO from '../../const/SITE_INFO';
const timeFormat = require('lc-time-format');
const URI = require('urijs');
const FormItem = Form.Item;
const Option = Select.Option;
class CrawlInput extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state = {
            crawlUrl: '',
            result: null,
            cpId: undefined,
            loading: 0,
            cpList: [],
            videoId: ''
        };
    }
    componentDidMount(){

    }
    shouldComponentUpdate(props, state){
        if(this.props.isOpen === false && props.isOpen === true){
            // modal open
            this.loadCpList();
        }
        return true;
    }
    freshList = freshContentList.bind(this);
    fieldChange=(fieldName, value)=>{
        let val;
        if(value && value.target){
            val = value.target.value;
        }else{
            val = value;
        }
        store.dispatch({
            type: 'videoInput.setValue',
            key: fieldName,
            value: val
        });
    }
    closeModal = () => {
        store.dispatch({
            type: 'videoInput.setValue',
            key: 'isOpen',
            value: false
        });
    }
    // submit = async () => {
    //     const crawlUri = new URI('/service/biz/contents/grab?cpId=65');
    //     crawlUri.host('om.iflow.meizu.com');
    //     crawlUri.protocol(window.location.protocol);
    //     crawlUri.setQuery('cpEntityId', this.props.videoId);
    //     const crawlUrl = crawlUri.toString();
    //     const res = await ajax.get(API.serverRequest.url, {url: crawlUrl});
    //     if(res.code === 200){
    //         message.success('抓取成功');
    //         this.freshList();
    //         this.setState({
    //             result: res.value
    //         });
    //         // this.closeModal();
    //     }else{
    //         message.error(res.message);
    //     }
    // }
    syncVideo=async()=>{
        if(!this.state.videoId){
            message.error('请输入视频ID');
            return;
        }
        if(!this.state.cpId){
            message.error('请选择cp');
            return;
        }
        const apiUri = new URI(SITE_INFO.domain + '/service/article/syncContent');
        apiUri.setQuery('cpId', this.state.cpId);
        apiUri.setQuery('cpEntityId', this.state.videoId);
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()});
        this.stopLoading();
        if(res.code !== 200){
            message.error('抓取视频失败');
            return;
        }
        message.success('抓取成功');
        const keys = Object.keys(res.value.result);
        const result = res.value.result[keys[0]];
        this.setState({
            result
        });
    }
    renderTime(time){
        if((time + '').length <= 12){
            time = time * 1000;
        }
        return timeFormat(new Date(time), 'Y/M/D H:N:S');
    }
    startLoading(){
        this.setState(state=>({loading: state.loading + 1}));
    }
    stopLoading(){
        this.setState(state=>({loading: state.loading - 1}));
    }
    loadCpList=async()=>{
        if(this.state.cpList.length){
            return;
        }
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: SITE_INFO.domain + '/service/article/syncContent/cp'});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取CP列表错误');
            return;
        }
        this.setState({
            cpList: res.value
        });
    }
    selectCp=(cpId)=>{
        this.setState({
            cpId
        });
    }
    videoIdChange=(event)=>{
        const videoId = event.target.value;
        this.setState({videoId});
    }
    render(){
        let result:JSX.Element;
        if(this.state.result){
            const val = this.state.result;
            let bigImg:JSX.Element;
            if(val.imgInfo && val.imgInfo.bigImgInfos && val.imgInfo.bigImgInfos.length){
                const imgInfo = val.imgInfo.bigImgInfos[0];
                if(imgInfo.url){
                    bigImg = <p><img style={{maxWidth: '100%'}} src={imgInfo.url} /></p>
                }
            }
            result = <div id="result">
                <Divider>视频信息</Divider>
                <h3><a href={val.h5_url} target="_blank">{val.title}</a></h3>
                <p><strong>描述：</strong>{val.desc || '--'}</p>
                <p><strong>作者：</strong>{val.author}</p>
                {bigImg && bigImg}
                <p><strong>时长：</strong>{val.videoDuration || '-'} 秒</p>
                <p><strong>创建时间：</strong>{this.renderTime(val.createTime)}</p>
                <p><strong>发布时间：</strong>{this.renderTime(val.publishTime)}</p>
                <p><strong>上架时间：</strong>{this.renderTime(val.release_time)}</p>
            </div>
        }
        const cpOptions = this.state.cpList.map(each=>{
            return <Option value={each.cpId} key={each.cpId}>{each.name}</Option>
        });
        return (
            <Modal visible={this.props.isOpen}
                title="添加视频"
                onCancel={this.closeModal}
                okText="添加"
                cancelText="关闭"
                confirmLoading={!!this.state.loading}
                maskClosable={false}
                onOk={this.syncVideo}>
                <Form>
                    <FormItem required={true}>
                        <Select onChange={this.selectCp} placeholder="选择cp" value={this.state.cpId}>
                            {cpOptions}
                        </Select>
                    </FormItem>
                    <FormItem label="视频ID">
                        <Input value={this.state.videoId} onChange={this.videoIdChange}></Input>
                    </FormItem>
                </Form>
                {result}
            </Modal>
        )
    }
}
const mapState = function(state){
    // console.log('crawl input state: ', state.crawlInput);
    return state.videoInput;
}
const container = connect(mapState)(CrawlInput);
export default container;