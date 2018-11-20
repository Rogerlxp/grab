import * as React from 'react';
import {connect} from 'react-redux';
import store from '../../reducer';
import ajax from '../../lib/ajax';
import API from '../../const/API';
const URI = require('urijs');
import {
    Modal,
    Form,
    Input,
    message
} from 'antd';
const validator = require('validator');
const FormItem = Form.Item;
interface PROPS{
    isOpen: boolean;
    id: string;
}
interface STATE {
    url: string;
}
class CrawlTester extends React.Component<any, STATE>{
    constructor(props){
        super(props);
        this.state = {
            url: ''
        }
    }
    closeModal = () => {
        store.dispatch({
            type: 'modal.toggle',
            key: 'crawlTest',
            value: {
                isOpen: false
            }
        });
    }
    urlInput = (event) => {
        const value = event.target.value;
        this.setState({
            url: value
        });
    }
    submit = async () => {
        const url = this.state.url;
        const validateOption = {
            require_tld: true,
            require_protocol: true,
            require_valid_protocol: true
        };
        if(validator.isURL(url, validateOption) === false){
            message.error('请输入完整的 url');
            return;
        }
        const res = await ajax.post(API.crawlUrl.url, {url});
        if(res.code === 200){
            console.log(res.value);
            message.success('抓取成功，请按F12打开调试面板->控制台（console）查看结果')
        }else{
            message.error(res.message);
        }
    }
    render(){
        return(
            <Modal title="爬虫规则测试"
                visible={this.props.isOpen}
                onCancel={this.closeModal}
                maskClosable={false}
                onOk={this.submit}
                okText="测试">
                <Form>
                    <FormItem label="测试地址">
                        <Input placeholder="填写完整的地址，包含http前缀" value={this.state.url} onChange={this.urlInput} />
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
const mapState = function(state){
    const props:PROPS = {
        id: state.table.rowId,
        isOpen: state.modal.crawlTest.isOpen
    };
    return props;
}
const component = connect(mapState)(CrawlTester);

export default component;