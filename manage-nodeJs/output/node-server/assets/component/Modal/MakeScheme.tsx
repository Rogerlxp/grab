import * as React from 'react';
import {connect} from 'react-redux';
import {
    Modal,
    Form,
    Select,
    message,
    Button
} from 'antd';
import store from '../../reducer';
import ajax from '../../lib/ajax';
import API from '../../const/API';
const URI = require('urijs');
const FormItem = Form.Item;
const Option = Select.Option;
class MakeUrlModal extends React.Component<any, any>{
    constructor(prop){
        super(prop);
        this.state = {
            selected: 1
        };
    }
    closeModal(){
        store.dispatch({
            type: 'modal.toggle',
            key: 'makeScheme',
            value: {
                isOpen: false
            }
        });
    }
    selectType(value){
        this.setState({
            selected: value
        });
    }
    submit(){
        const url = new URI(window.location.protocol + '//om.iflow.meizu.com/service/article/scheme');
        url.setQuery('appResource', this.state.selected);
        url.setQuery('id', this.props.makeScheme.options.id);
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', url.toString());
        const xhr = new XMLHttpRequest();
        xhr.open('GET', rdUri.toString(), false);
        xhr.send();
        const res = JSON.parse(xhr.responseText);
        if(res.code === 200){
            const clipboardEl = document.createElement('textarea');
            document.body.appendChild(clipboardEl);
            clipboardEl.value = res.value;
            clipboardEl.select();
            document.execCommand("copy");
            clipboardEl.parentNode.removeChild(clipboardEl);
            Modal.success({
                title: 'Scheme已拷贝到剪贴板',
                content: res.value
            });
        }else{
            message.error(res.message);
        }
    }
    render(){
        const props = this.props;
        const modalConfig = props.makeScheme;
        const isOpen = modalConfig ? modalConfig.isOpen : false;
        const options = [
            <Option key={1} value={1}>日历</Option>,
            <Option key={2} value={2}>天气</Option>,
            <Option key={3} value={3}>浏览器</Option>,
            <Option key={4} value={4}>游戏中心</Option>
        ];
        return (
            <Modal visible={isOpen}
                title="生成Scheme"
                onCancel={this.closeModal}
                okText="生成"
                maskClosable={false}
                onOk={this.submit.bind(this)}>
                <Form layout="inline">
                    <FormItem label="应用">
                        <Select onChange={this.selectType.bind(this)} value={this.state.selected} style={{width: 400}}>{options}</Select>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
const mapState = function(state){
    const modal = state.modal;
    return modal;
}
const container = connect(mapState)(MakeUrlModal);
export default container;