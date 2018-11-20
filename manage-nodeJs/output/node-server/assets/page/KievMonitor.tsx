import '../sass/page/KievMonitor.scss';
import * as React from 'react';
import ajax from '../lib/ajax';
import Component from '../lib/Component';
import SITE_INFO from '../const/SITE_INFO';
import API from '../const/API';
import handy from '../lib/handy';
import {
    Table,
    message,
    Form,
    Select,
    Button,
    Modal,
    Input,
    Divider,
    Icon,
    Menu,
    Dropdown
} from 'antd';
const JSONEditor = require('jsoneditor');
const URI = require('urijs');
const FormItem = Form.Item;
const Option = Select.Option;
const TABLE_NAME = 'T_MONITOR_KIEV';
class KievMonitor extends Component{
    constructor(props){
        super(props);
        this.state = {
            kievList: {},
            loading: 0,
            isSavingRecord: false,
            selectedKiev: undefined,
            kievOptions: [],
            record: [{
                name: 'ID',
                keyName: 'id',
                type: 'number',
                disabled: true,
                dbKey: 'FID'
            }, {
                name: 'name',
                keyName: 'name',
                dbKey: 'FNAME'
            },{
                name: 'interfaceClass',
                keyName: 'interfaceClass',
                disabled: true,
                type: 'string',
                dbKey: 'FCLASS'
            }, {
                name: 'method',
                keyName: 'method',
                disabled: true,
                type: 'string',
                dbKey: 'FMETHOD_NAME'
            }, {
                name: 'methodDesc',
                keyName: 'methodDesc',
                type: 'array',
                dbKey: 'FMETHOD_DESC',
                valueType: 'json-string'
            }, {
                name: 'node',
                keyName: 'node',
                type: 'string',
                dbKey: 'FKIEV_NODE'
            }, {
                name: 'serviceName',
                keyName: 'serviceName',
                type: 'string',
                dbKey: 'FSERVICE_NAME'
            }],
        }
    }
    columns = [{
        dataIndex: 'id',
        title: 'ID',
        width: 20
    }, {
        dataIndex: 'name',
        title: 'Name',
        width: 50
    },{
        dataIndex: 'interfaceClass',
        title: 'interfaceClass',
        width: 180
    }, {
        dataIndex: 'method',
        title: 'method',
        width: 100
    }, {
        dataIndex: 'monitorUrl',
        title: 'monitorUrl',
        width: 300
    }, {
        dataIndex: 'node',
        title: 'node',
        width: 100
    }, {
        dataIndex: 'serviceName',
        title: 'serviceName',
        width: 100
    }, {
        dataIndex: 'control',
        title: '操作',
        width: 100,
        render: (text, record, index)=>{
            const menu = (
                <Menu onClick={this.clickActionButton.bind(this, record)}>
                  <Menu.Item key="1">执行</Menu.Item>
                  <Menu.Item key="2">复制</Menu.Item>
                  <Menu.Item key="3">删除</Menu.Item>
                </Menu>
              );
            return (
                <Dropdown.Button onClick={this.edit.bind(this, record)} overlay={menu}>
                    编辑
                </Dropdown.Button>
            );
        }
    }];
    componentDidMount(){
        this.loadList();
    }
    clickActionButton(record, { item, key, keyPath }){
        if(key === '1'){
            this.execMonitorUrl(record);
        }else if(key === '2'){
            this.duplicateRecord(record);
        }else if(key === '3'){
            this.deleteRecord(record);
        }
    }
    startLoading(){
        this.setState(state=>({loading: state.loading + 1}));
    }
    stopLoading(){
        this.setState(state=>({loading: state.loading - 1}));
    }
    loadList = async () => {
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: SITE_INFO.domain + '/service/monitor/kiev/info'});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取kiev列表错误：' + res.message);
            return;
        }
        const kievList = res.value || {};
        Object.keys(kievList).forEach(key=>{
            const kiev = kievList[key];
            for(const k of kiev){
                if(Array.isArray(k.methodDesc)){
                    for(const des of k.methodDesc){
                        if(typeof des.paramValue === 'object'){
                            des.paramValue = JSON.stringify(des.paramValue);
                        }
                    }
                }
            }
        })
        this.setState({kievList}, this.makeKievOptions);
    }
    changeState(path, event){
        const val = (event && event.target) ? event.target.value : event;
        const pathArr = path.split(/[\.\[]/).filter(each=>!!each);
        if(pathArr.length === 1){
            this.setState({[path]: val});
            return;
        }
        const targetPath = pathArr.shift();
        const targetState = this.state[targetPath];
        const applyPath = pathArr.map(each=>{
            if(/\]$/.test(each)){
                each = '[' + each;
            }else{
                each = '.' + each;
            }
            return each;
        }).join('');
        handy.applyObjByPath(targetState, applyPath, val);
        this.setState({[targetPath]: targetState});
    }
    addParam(){
        const record = this.clone(this.state.record);
        const methodDesc = record.find(each=>each.keyName === 'methodDesc');
        methodDesc.value.push({
            paramName: '',
            paramType: '',
            paramValue: ''
        });
        this.setState({record});
    }
    makeKievOptions () {
        const kievOptions = Object.keys(this.state.kievList).map(each=>({name: each, value: each}));
        this.setState({kievOptions});
    }
    clone(val){
        return JSON.parse(JSON.stringify(val));
    }
    applyRecord(record){
        const stateRecord = this.clone(this.state.record);
        for(const each of stateRecord){
            each.value = record[each.keyName];
        }
        return stateRecord;
    }
    edit(record){
        const stateRecord = this.applyRecord(record);
        this.setState({
            isEditing: true,
            record: stateRecord
        });
    }
    deleteRecord(record){
        Modal.confirm({
            okText: '删除',
            cancelText: '取消',
            content: '删除后不能恢复，确定？',
            onOk: async ()=>{
                this.startLoading();
                const res = await ajax.post(API.deleteOneFromTable.url, {
                    keyValue: record.id,
                    tableName: TABLE_NAME
                });
                this.stopLoading();
                if(res.code !== 200){
                    message.error('删除失败：' + res.message);
                    return;
                }
                message.success('删除成功');
                this.loadList();
            }
        });
    }
    async duplicateRecord(record){
        this.startLoading();
        const res = await ajax.post(API.duplicateRow.url, {
            keyValue: record.id,
            tableName: TABLE_NAME
        });
        this.stopLoading();
        if(res.code !== 200){
            message.error('复制失败：' + res.message);
            return;
        }
        message.success('复制成功');
        this.loadList();
    }
    closeRecordEditor=()=>{
        this.setState({
            isEditing: false
        });
    }
    saveRecord = async () =>{
        const fields = {};
        const record = this.clone(this.state.record);
        record.forEach(each=>{
            const key = each.dbKey;
            if(each.valueType === 'json-string'){
                fields[key] = each.value.map(each=>{
                    if(typeof each.paramValue === 'string'){
                        if(handy.isJsonValue(each.paramValue)){
                            try{
                                each.paramValue = JSON.parse(each.paramValue);
                            }catch(error){
                                // do nothing
                            }
                        }else{
                            each.paramValue = handy.adjustValueType(each.paramValue);
                        }
                    }
                    return each;
                });
            }else{
                fields[key] = each.value;
            }
        });
        const res = await this.invokeSaveRecord(fields);
        if(res.code !== 200){
            message.error('保存失败：' + res.message);
            return;
        }
        message.success('保存成功');
        this.setState({
            isEditing: false
        });
        this.loadList();
    }
    async invokeSaveRecord(fields){
        this.setState({isSavingRecord: true});
        const res = await ajax.post(API.updateTableRow.url, {
            fields,
            tableName: TABLE_NAME
        });
        this.setState({isSavingRecord: false});
        return res;
    }
    jsonEditor:any;
    jsonValuePath:string;
    openJsonEditor(path, value){
        let isValidJson = true;
        if(value){
            try{
                value = JSON.parse(value);
                if([undefined, null, 'number'].includes(typeof value)){
                    isValidJson = false;
                }
            }catch(error){
                isValidJson = false;
            }
        }
        if(isValidJson === false){
            message.error('只能编辑json文本');
            return;
        }
        this.jsonValuePath = path;
        this.setState({isJsonEditorOpen: true}, ()=>{
            setTimeout(() => {
                if(this.jsonEditor === undefined){
                    const container = document.getElementById('json-editor');
                    const option = {};
                    this.jsonEditor = new JSONEditor(container, option);
                }
                this.jsonEditor.set(value);
            }, 10);
        });
    }
    saveJson=()=>{
        this.changeState(this.jsonValuePath, JSON.stringify(this.jsonEditor.get()));
        this.closeJsonEditor();
    }
    closeJsonEditor=()=>{
        this.setState({isJsonEditorOpen: false});
    }
    execMonitorUrl=async(record)=>{
        const monitorUrl = record.monitorUrl;
        if(monitorUrl){
            const res = await ajax.get(API.serverRequest.url, {url: monitorUrl});
            Modal.success({
                title: '返回结果',
                content: JSON.stringify(res)
            })
        }else{
            message.error('没有Monitor url');
        }
    }
    render(){
        // kiev selector
        const kievOptions = this.state.kievOptions.map(each=><Option key={each.value} value={each.value}>{each.value}</Option>);
        let dataSource = [];
        if(this.state.selectedKiev){
            dataSource = this.state.kievList[this.state.selectedKiev];
        }
        // editor
        const editorFields = this.state.record.map((each, index)=>{
            if(each.type === 'array'){
                const val = each.value || [];
                const params = val.map((params, i)=>{
                    return (
                        <div className="param" key={i}>
                            <Input addonBefore="paramName"
                                onChange={this.changeState.bind(this, `record[${index}].value[${i}].paramName`)}
                                value={params.paramName}></Input>
                            <Input addonBefore="paramType"
                                onChange={this.changeState.bind(this, `record[${index}].value[${i}].paramType`)}
                                value={params.paramType}></Input>
                            <Input addonBefore="paramValue" value={params.paramValue}
                                suffix={<Icon type="edit" onClick={this.openJsonEditor.bind(this, `record[${index}].value[${i}].paramValue`, params.paramValue)} />}
                                onChange={this.changeState.bind(this, `record[${index}].value[${i}].paramValue`)}></Input>
                            <Divider />
                        </div>
                    );
                });
                return (
                    <FormItem label={each.name} key={each.keyName}>
                        {params}
                        {/* <Button icon="plus" className="block" onClick={this.addParam.bind(this)}></Button> */}
                    </FormItem>
                );
            }else{
                return (
                    <FormItem label={each.name} key={each.keyName}>
                        <Input value={each.value} disabled={each.disabled} onChange={this.changeState.bind(this, `record[${index}].value`)}></Input>
                    </FormItem>
                );
            }

        });
        return (
            <div className="kiev-monitor">
                <Form layout="inline">
                    <FormItem label="Kiev">
                        <Select onChange={this.changeState.bind(this, 'selectedKiev')}
                            style={{width: 400}}
                            placeholder="请选择Kiev"
                            value={this.state.selectedKiev}>{kievOptions}</Select>
                    </FormItem>
                </Form>
                <Table dataSource={dataSource}
                    rowKey="id"
                    loading={!!this.state.loading}
                    columns={this.columns}></Table>
                <Modal visible={this.state.isEditing}
                    onCancel={this.closeRecordEditor}
                    onOk={this.saveRecord}
                    maskClosable={false}
                    closable={false}
                    confirmLoading={this.state.isSavingRecord}
                    className="kiev-monitor-editor">
                    <Form>
                        {editorFields}
                    </Form>
                </Modal>
                <Modal visible={this.state.isJsonEditorOpen}
                    closable={false}
                    maskClosable={false}
                    onOk={this.saveJson}
                    onCancel={this.closeJsonEditor}
                    className="json-editor-modal">
                    <div id="json-editor"></div>
                </Modal>
            </div>
        )
    }
}

export default KievMonitor;