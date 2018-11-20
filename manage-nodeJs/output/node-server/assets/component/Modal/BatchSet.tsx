import * as React from 'react';
import {connect} from 'react-redux';
import store from '../../reducer';
import ajax from '../../lib/ajax';
import API from '../../const/API';
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
const URI = require('urijs');
const timeFormat = require('lc-time-format');
const FormItem = Form.Item;
const Option = Select.Option;
import DEF from '../../../common/batchSet';
import { RowSelectionType } from '../../../node_modules/antd/lib/table';
class SelectRule extends React.Component<any, any>{
    constructor(props){
        super(props);
        const def = this.props.def;
        this.fieldDef = DEF[def + '_FIELDS'];
        this.filterDef = DEF[def + '_FILTER'];
        this.selectedDef = DEF[def + '_SELECTED'];
        this.primaryField = this.fieldDef.find(each=>each.isPrimaryKey);
        this.listConfig = this.primaryField.listConfig;
        this.selectedConfig = this.primaryField.selectedConfig;
        this.updateConfig = this.primaryField.updateConfig;
        this.selectionType = this.primaryField.selectionType || 'checkbox';
        this.state = {
            columns: this.fieldDef.map(def=>{
                return {
                    title: def.name,
                    dataIndex: def.keyName,
                    render: (value, record)=>{
                        return value;
                    }
                }
            }),
            filter: {}
        };
    }
    fieldDef:any;
    filterDef:any;
    selectedDef:any;
    primaryField:any;
    listConfig:any;
    updateConfig:any;
    selectedConfig:any;
    selectionType:RowSelectionType;
    shouldComponentUpdate(nextProp){
        const next = nextProp.batchSet;
        const current = this.props.batchSet;
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
            modalName: 'batchSet'
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
    freshList = async (modalConfig) => {
        this.setState({
            isLoading: true
        });
        if(!modalConfig || !modalConfig.options){
            modalConfig = this.props.batchSet;
        }
        const record = modalConfig.options;
        // selected list arguments
        const selectedPayload = {};
        if(this.selectedConfig.argMap){
            Object.keys(this.selectedConfig.argMap).forEach(key=>{
                const value:string = this.selectedConfig.argMap[key];
                selectedPayload[key] = record[value];
            });
        }
        const selectedRes = await this.invoke(this.selectedConfig.api, selectedPayload);
        if(selectedRes.code === 200 && selectedRes.value && Array.isArray(selectedRes.value.data)){
            this.setState({
                selected: selectedRes.value.data.map(each=>each[this.primaryField.keyName])
            });
        }else{
            message.error('获取“已选择”列表失败');
        }
        const listUri = new URI(this.listConfig.api);
        if(this.listConfig.staticArg){
            Object.entries(this.listConfig.staticArg).forEach(([key, value])=>{
                listUri.setQuery(key, value + '');
            });
        }
        // filter arguments
        Object.entries(this.state.filter).forEach(function([key, value]){
            listUri.setQuery(key, value);
        });
        const selectionsRes = await this.invoke(listUri.toString());
        if(selectionsRes.code === 200 && selectionsRes.value && Array.isArray(selectionsRes.value.data)){
            this.setState({
                selection: selectionsRes.value.data
            });
        }else{
            message.error('获取“选择列表”失败');
        }
        this.setState({
            isLoading: false
        });
    }
    selectionOnChange = (selectedRowKeys)=>{
        this.setState({
            selected: selectedRowKeys
        });
    }
    saveSelection = async () => {
        const keyName = this.primaryField.keyName;
        const currentId = this.props.batchSet.options[keyName];
        // this structure is solid
        const selectData = this.state.selected.map(id=>{
            const row = this.state.selection.find(item=>item[keyName] === id);
            if(!row){
                throw new Error('Can not find id in selection.');
            }
            const data = {};
            const argMap = this.updateConfig.argMap;
            if(argMap){
                Object.keys(argMap).forEach(function(key){
                    const value = argMap[key];
                    data[key] = row[value];
                });
            }
            return data;
        });
        const jsonParams = {
            currentData: {
                [keyName]: currentId
            },
            selectData,
            formData: this.filterDef.map(def=>{
                return {
                    name: def.keyName,
                    value: this.state.filter[def.keyName] || ''
                };
            })
        };
        const res = await this.invoke(this.updateConfig.api, {jsonParams: JSON.stringify(jsonParams)});
        if(res.code === 200){
            message.success('操作成功');
            this.close();
        }else{
            message.error('操作失败');
        }
    }
    filterChange = (key, event) => {
        const value = event.target ? event.target.value : event;
        const filter = JSON.parse(JSON.stringify(this.state.filter));
        filter[key] = value;
        this.setState({filter});
    }
    render(){
        const modalConfig = this.props.batchSet || {};
        const data = this.state.selection || [];
        const rowSelection = {
            selectedRowKeys: this.state.selected,
            onChange: this.selectionOnChange,
            type: this.selectionType
        };
        const typeOptionsEl = [].map(option=>{
            return <Option key={option.value} value={option.value}>{option.name}</Option>
        });
        typeOptionsEl.push(<Option key={null} value={null}>全部</Option>);
        const formItems = this.filterDef.map(def=>{
            return (
                <FormItem key={def.keyName} label={def.name}>
                    <Input onChange={this.filterChange.bind(this, def.keyName)}
                        value={this.state.filter[def.keyName]}></Input>
                </FormItem>
            )
        });
        return (
            <Modal visible={modalConfig.isOpen}
                maskClosable={false}
                width={1080}
                title={this.primaryField.title || "配置脚本"}
                onOk={this.saveSelection}
                onCancel={this.close}>
                <Form layout="inline">
                    {formItems}
                    <FormItem>
                        <Button type="primary" onClick={this.freshList}>查询</Button>
                    </FormItem>
                </Form>
                <Divider />
                <Table columns={this.state.columns}
                    rowSelection={rowSelection}
                    rowKey={this.primaryField.keyName}
                    dataSource={data} />
            </Modal>
        );
    }
};

const container:any = connect(function(state:any){
    return state.modal;
})(SelectRule);

export default container;