import * as React from 'react';
import {connect} from 'react-redux';
import ajax from '../../lib/ajax';
import {
    Form,
    message,
    Modal,
    Input,
    Select,
    Button } from 'antd';
import API from '../../const/API';
import freshDisList from '../../action/freshDistributionPreview';
const DISTRIBUTION_STYLES = require('../../../common/enum/DISTRIBUTION_STYLES.js');
const DISTRIBUTION_OPEN_TYPE = require('../../../common/enum/DISTRIBUTION_OPEN_TYPE.js');
const FormItem = Form.Item;
const Option = Select.Option;
class EditDisItemStyleModal extends React.Component<any>{
    constructor(props){
        super(props);
        this.freshList = freshDisList.bind(this);
    }
    freshList:any;
    closeModal=()=>{
        this.props.dispatch({
            type: 'disManage.setValue',
            key: 'isEditDisplayModalOpen',
            value: false
        });
    }
    fieldChange(key, value){
        let val = value;
        if(value.target && value.target.value !== undefined){
            val = value.target.value;
        }
        const editingStyle = JSON.parse(JSON.stringify(this.props.editingStyle));
        editingStyle[key] = val;
        this.props.dispatch({
            type: 'disManage.setValue',
            key: 'editingStyle',
            value: editingStyle
        });
    }
    submit= async ()=>{
        const editingStyle = this.props.editingStyle;
        const editStyleRes = await ajax.post(API.updateTableRow.url, {
            tableName: 'T_CONTENT_DIS_DISPLAY',
            fields: editingStyle
        });
        if(editStyleRes){
            if(editStyleRes.code === 200){
                message.success('保存成功');
                this.closeModal();
                this.freshList();
            }else{
                message.error(editStyleRes.message);
            }
        }
    }
    render(){
        const editingStyle = this.props.editingStyle;
        const isEditDisplayModalOpen = this.props.isEditDisplayModalOpen;
        // options
        const displayStyleOpts = DISTRIBUTION_STYLES.map(each=><Option key={each.value} value={each.value}>{each.name}</Option>);
        const openTypeOpts = DISTRIBUTION_OPEN_TYPE.map(each=><Option key={each.value} value={each.value}>{each.name}</Option>);
        return (
            <Modal visible={isEditDisplayModalOpen}
                onCancel={this.closeModal}
                onOk={this.submit}
                okText="保存"
                cancelText="取消"
                title="修改样式">
                <Form>
                    <FormItem label="分发ID">
                        <Input value={editingStyle.FDISID} disabled={true}></Input>
                    </FormItem>
                    <FormItem label="文章ID">
                        <Input value={editingStyle.FCONTENT_ID} disabled={true}></Input>
                    </FormItem>
                    <FormItem label="内容样式">
                        <Select value={editingStyle.FDISPLAY_STYLE} onChange={this.fieldChange.bind(this, 'FDISPLAY_STYLE')} placeholder="请选择">{displayStyleOpts}</Select>
                    </FormItem>
                    <FormItem label="详情打开方式">
                        <Select value={editingStyle.FOPEN_TYPE} onChange={this.fieldChange.bind(this, 'FOPEN_TYPE')} placeholder="请选择">{openTypeOpts}</Select>
                    </FormItem>
                    {editingStyle.FOPEN_TYPE === 3 && <FormItem label="详情打开地址">
                        <Input value={editingStyle.FOPEN_URL} onChange={this.fieldChange.bind(this, 'FOPEN_URL')}></Input>
                    </FormItem>}
                </Form>
            </Modal>
        )
    }
}
const mapState = function(state){
    const props = state.disManage;
    props.page = state.table.page;
    props.pageSize = state.table.pageSize;
    return state.disManage;
}
const container:any = connect(mapState)(EditDisItemStyleModal);
export default container;