import * as React from 'react';
import {connect} from 'react-redux';
import {
    Modal,
    Form,
    Select,
    message
} from 'antd';
import API from '../../const/API';
import store from '../../reducer';
import ajax from '../../lib/ajax';
const URI = require('urijs');
import DISTRIBUTION_CHANNEL from '../../../common/enum/DISTRIBUTION_CHANNEL';
class DistributeModal extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state = {
            disList: []
        };
    }
    close = () => {
        store.dispatch({
            type: 'modal.toggle',
            key: 'distribute',
            value: {
                isOpen: false
            }
        });
    }
    channelSelect = async (channelId)=>{
        this.setState({
            channelId
        });
        const uri = new URI(API.getByKeyName.url);
        uri.setQuery('dbName', 'MEIZU_CONTENTS');
        uri.setQuery('tableName', 'T_CONTENT_DIS');
        uri.setQuery('keyName', 'FCHANNEL_ID');
        uri.setQuery('keyValue', channelId);
        const res = await ajax.get(uri.toString());
        if(res.code === 200){
            this.setState({
                disList: res.value
            });
        }else{
            message.error(res.message);
        }
    }
    disSelect = (disId)=>{
        this.setState({
            disId
        });
    }
    submit = async () => {
        const apiUri = new URI(window.location.protocol + '//om.iflow.meizu.com/service/dis/fliter/add');
        // console.log('dis: ', this.props.distribute);
        const param = {
            disId: this.state.disId + '',
            contentId: this.props.distribute.options.id + '',
            cpEntityId: this.props.distribute.options.uniqueId + '',
            cpId: +this.props.distribute.options.resourceType,
            publishTime: +this.props.distribute.options.posttime,
        };
        apiUri.setQuery('param', JSON.stringify(param));
        console.log('add to distribution: ', param);
        const rdUri = new URI(API.serverRequest.url);
        const rdUrl = window.btoa(apiUri.toString());
        // console.log(rdUrl);
        rdUri.setQuery('url', rdUrl);
        rdUri.setQuery('encode', 'base64');
        const res = await ajax.get(rdUri.toString());
        if(res.code === 200){
            message.success('添加成功');
            this.close();
        }else{
            message.error(res.message);
        }
    }
    render(){
        // console.log(this.props);
        const channels = DISTRIBUTION_CHANNEL.map(channel=>{
            return <Select.Option value={channel.value} key={channel.value}>
                {channel.name}
            </Select.Option>;
        });
        let isOpen = false;
        // console.log(this.props);
        if(this.props.distribute){
            isOpen = this.props.distribute.isOpen;
        }
        let disOptions = [];
        let disPlaceholder = '';
        if(this.state.disList.length){
            disOptions = this.state.disList.map(dis=>{
                return <Select.Option value={dis.FID} key={dis.FID}>{dis.FNAME}</Select.Option>;
            });
            disPlaceholder = '请选择分发频道';
        }else{
            disPlaceholder = '请先选择应用渠道'
        }
        return (
            <Modal
                visible={isOpen}
                okText="确定"
                cancelText="取消"
                onCancel={this.close}
                onOk={this.submit}
                title="添加到分发频道">
                <Form>
                    <Form.Item label="应用渠道">
                        <Select placeholder="选择分发渠道" onChange={this.channelSelect.bind(this)} value={this.state.channelId}>{channels}</Select>
                    </Form.Item>
                    <Form.Item label="分发ID">
                        <Select placeholder={disPlaceholder} value={this.state.disId} onChange={this.disSelect.bind(this)}>{disOptions}</Select>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
const mapState = function(state){
    return state.modal;
}
const container = connect(mapState)(DistributeModal);

export default container;