import * as React from 'react';
import {connect} from 'react-redux';
import store from '../../reducer';
import ajax from '../../lib/ajax';
import API from '../../const/API';
import List from '../table/List';
import RULE_SCRIPT from '../../../common/listFields/RULE_SCRIPT';
import {
    Modal,
    message,
    Table,
    Form,
    Input,
    Select,
    Button,
    Divider
} from 'antd';
import handy from '../../lib/handy';
const URI = require('urijs');
const timeFormat = require('lc-time-format');
const FormItem = Form.Item;
const Option = Select.Option;
const SCRIPT_TYPES = require('../../../common/enum/RULE_SCRIPT_TYPES');
class SelectRule extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state = {
            columns: RULE_SCRIPT.map(field=>{
                return {
                    title: field.name,
                    dataIndex: field.keyName
                }
            }),
            id: '',
            name: '',
            type: null
        };
    }
    shouldComponentUpdate(nextProp){
        const next = nextProp.selectAnalysisRule;
        const current = this.props.selectAnalysisRule;
        if(!next){
            return false;
        }
        if(next.isOpen){
            if(!current || !current.isOpen){
                // open modal
                this.freshList(next);
            }
        }
        if(!next.isOpen){
            if(current && current.isOpen){
                // close modal
            }
        }
        return true;
    }
    close = ()=>{
        store.dispatch({
            type: 'modal.toggle',
            modalName: 'selectAnalysisRule'
        });
    }
    invoke(api, payload?){
        const apiUri = new URI(api);
        if(payload){
            Object.keys(payload).forEach(function(key){
                apiUri.setQuery(key, payload[key]);
            });
        }
        return ajax.get(API.serverRequest.url, {
            url: apiUri.toString()
        });
    }
    freshList = async (selectAnalysisRule) => {
        if(!selectAnalysisRule || !selectAnalysisRule.options){
            selectAnalysisRule = this.props.selectAnalysisRule;
        }
        const selectedRes = await this.invoke('http://om.iflow.meizu.com/service/rule/script/list', {
            ruleId: selectAnalysisRule.options.id
        });
        if(selectedRes.code === 200 && selectedRes.value && Array.isArray(selectedRes.value.data)){
            this.setState({
                selected: selectedRes.value.data.map(each=>each.id)
            });
        }else{
            message.error('获取“已选择”列表失败');
        }
        const listUri = new URI('http://om.iflow.meizu.com/service/script/list');
        listUri.setQuery('pageNumber', 1000);
        listUri.setQuery('start', 0);
        listUri.setQuery('length', 1000);
        listUri.setQuery('isOperate', 'false');
        listUri.setQuery('isBatch', 'true');
        listUri.setQuery('isSelect', 'true');
        if(this.state.id){
            listUri.setQuery('id', this.state.id);
        }
        if(this.state.type){
            listUri.setQuery('type', this.state.type);
        }
        if(this.state.name){
            listUri.setQuery('name', this.state.name);
        }
        const selectionsRes = await this.invoke(listUri.toString());
        if(selectionsRes.code === 200 && selectionsRes.value && Array.isArray(selectionsRes.value.data)){
            this.setState({
                selection: selectionsRes.value.data.map(each=>{
                    each['createTime'] = timeFormat(new Date(each['createTime']), 'Y-M-D H:N:S');
                    each['updateTime'] = timeFormat(new Date(each['updateTime']), 'Y-M-D H:N:S');
                    const typeDef = SCRIPT_TYPES.find(option=>option.value === each.type);
                    each.type = typeDef && typeDef.name || '-';
                    each.key = each.id;
                    return each;
                })
            });
        }else{
            message.error('获取“选择列表”失败');
        }
    }
    selectionOnChange = (selectedRowKeys)=>{
        this.setState({
            selected: selectedRowKeys
        });
    }
    saveSelection = async () => {
        const ruleId = this.props.selectAnalysisRule.options.id;
        // this structure is solid
        const selectData = this.state.selected.map(id=>{
            const row = this.state.selection.find(item=>item.id === id);
            if(!row){
                throw new Error('Can not find id in selection.');
            }
            const typeDef = SCRIPT_TYPES.find(each=>each.name === row.type);
            const typeValue = typeDef.value;
            return {type: typeValue, id}
        });
        const jsonParams = {
            currentData: {
                id: ruleId
            },
            selectData,
            formData: [{
                name: 'id',
                value: ''
            }, {
                name: 'name',
                value: ''
            }, {
                name: 'type',
                value: ''
            }]
        };
        const res = await this.invoke('http://om.iflow.meizu.com/service/rule/script/upd', {jsonParams: JSON.stringify(jsonParams)});
        if(res.code === 200){
            message.success('操作成功');
            this.close();
        }else{
            message.error('操作失败');
        }
    }
    filterChange = (key, event) => {
        const value = event.target ? event.target.value : event;
        this.setState({[key]: value});
    }
    render(){
        const modalConfig = this.props.selectAnalysisRule || {};
        const data = this.state.selection || [];
        const rowSelection = {
            selectedRowKeys: this.state.selected,
            onChange: this.selectionOnChange
        };
        const typeOptionsEl = SCRIPT_TYPES.map(option=>{
            return <Option key={option.value} value={option.value}>{option.name}</Option>
        });
        typeOptionsEl.push(<Option key={null} value={null}>全部</Option>);
        return (
            <Modal visible={modalConfig.isOpen}
                maskClosable={false}
                width={1080}
                title="配置脚本"
                onOk={this.saveSelection}
                onCancel={this.close}>
                <Form layout="inline">
                    <FormItem label="ID">
                        <Input onChange={this.filterChange.bind(this, 'id')} value={this.state.id}></Input>
                    </FormItem>
                    <FormItem label="名称">
                        <Input onChange={this.filterChange.bind(this, 'name')} value={this.state.name}></Input>
                    </FormItem>
                    <FormItem label="类型">
                        <Select onChange={this.filterChange.bind(this, 'type')} value={this.state.type} style={{width: 165}}>
                            {typeOptionsEl}
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.freshList}>查询</Button>
                    </FormItem>
                </Form>
                <Divider />
                <Table columns={this.state.columns} rowSelection={rowSelection} dataSource={data} />
            </Modal>
        );
    }
};

const container = connect(function(state:any){
    return state.modal;
})(SelectRule);

export default container;