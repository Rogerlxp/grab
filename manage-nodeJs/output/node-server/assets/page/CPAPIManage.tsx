/**
 * 接口配置页面
 * 作者：JamesYin
 * 该页面用于配置接口签名、转换、参数等内容，使用前请大喊“嘛哩嘛哩哄”，否则页面会崩溃（手动笑脸）。
 * 
 * 1、因为该页面的内容比较独立，所以不使用redux，以免影响整体
 * 2、页面大部分内容由罗小平同学提供逻辑，我实现交互，所以为什么会用选择框、输入框之类的问题，请找小平同学。
 * 3、为了方便接手人维护，尽量少写复杂的通用函数
 */
import * as React from 'react';
import Component from '../lib/Component';
import {connect} from 'react-redux';
import ajax from '../lib/ajax';
import API from '../const/API';
import handy from '../lib/handy';
import SITE_INFO from '../const/SITE_INFO';
import {
    Steps,
    Icon,
    Button,
    Form,
    Input,
    message,
    Divider,
    Switch,
    Col,
    Modal,
    Select,
    Spin,
    Tooltip,
    AutoComplete
} from 'antd';
const URI = require('urijs');
const flatten = require('flat');
const JSONEditor = require('jsoneditor');
const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const InputGroup = Input.Group;
const SIGN_TYPE_ENUM = [{
    name: 'MD5',
    value: 1
}, {
    name: 'SHA1',
    value: 2
}, {
    name: 'SHA256',
    value: 3
}];
class CPAPIManage extends Component{
    constructor(props){
        super(props);
        // query
        const uri = new URI();
        this.query = uri.query(true);
        this.grabId = this.query.id || 0;
        this.cpId = this.query.cpId;
        this.isEditing = !!this.grabId;
        this.isEdited = false;
        this.isSignEdited = false;
        this.state = {
            loading: 0,
            current: 0,
            cpSourceMap: [],
            proxyMap: [],
            expressionCache: '',
            modelId: null,
            resultModelList: [],
            proxyParam: {
                attributes: '',
                baseRule: '' 
            },
            isMapEditorOpen: false,
            isResultExpressionOpen: false,
            isJsonEditorOpen: false,
            isJsonViewerOpen: false,
            editingMapKeyName: 0,
            resultMapEditingIndex: null,
            editingResultDataMap: {},
            dragging: {},
            errorCode: [],
            fields: [{
                label: '签名',
                keyName: 'signSchema.id',
                category: 'sign',
                options: [],
                type: 'select',
                emptyName: '新建'
            }, {
                label: 'CP ID',
                keyName: 'signSchema.cpId',
                category: 'sign',
                isHide: true
            },{
                label: '签名名称',
                keyName: 'signSchema.remark',
                category: 'sign'
            }, {
                label: '签名类型',
                keyName: 'signSchema.signTypeEnum',
                category: 'sign',
                type: 'select',
                options: SIGN_TYPE_ENUM
            }, {
                label: '字符串添加位置',
                keyName: 'signSchema.positionEnum',
                category: 'sign',
                type: 'select',
                options: [{
                    name: 'HEAD',
                    value: 1
                }, {
                    name: 'URL',
                    value: 2
                }, {
                    name: 'ENTITY',
                    value: 3
                }]
            }, {
                label: '参数排序方式',
                keyName: 'signSchema.signParamOrderEnum',
                category: 'sign',
                type: 'select',
                options: [{
                    name: '指定顺序',
                    value: 1
                }, {
                    name: '按参数key正序',
                    value: 2
                }, {
                    name:'按参数key逆序',
                    value: 3
                }, {
                    name: '按value正序',
                    value: 4
                }, {
                    name: '按value逆序',
                    value: 5
                }]
            }, {
                label: '签名参数名称',
                keyName: 'signSchema.signParamName',
                category: 'sign',
            },{
                label: '待签名参数',
                keyName: 'signSchema.paramNames',
                category: 'sign',
                type: 'list',
                value: []
            }, {
                label: '单个参数格式',
                keyName: 'signSchema.singleParamFormat',
                category: 'sign',
            }, {
                label: '开始字符',
                keyName: 'signSchema.beginCharacter',
                category: 'sign',
                placeholder: '不参与排序的签名key'
            }, {
                label: '结束字符',
                keyName: 'signSchema.endCharacter',
                category: 'sign',
                placeholder: '不参与排序的签名key'
            }, {
                label: '参数拼接字符',
                keyName: 'signSchema.spliceCharacter',
                category: 'sign',
                placeholder: '参与排序的参数'
            }, {
                label: '参与排序的签名key',
                keyName: 'signSchema.signKeyMap',
                category: 'sign'
            }, {
                label: '保留最后的拼接字符',
                keyName: 'signSchema.hasLastSplice',
                category: 'sign',
                type: 'switch'
            },{
                label: '签名',
                keyName: 'signId',
                category: 'request',
                type: 'select',
                options: []
            }, {
                label: '名称',
                keyName: 'name',
                category: 'request',
                required: true
            },{
                label: 'URL',
                keyName: 'url',
                category: 'request',
                required: true
            }, {
                label: '访问方式',
                keyName: 'methodType',
                category: 'request',
                type: 'select',
                required: true,
                options: [{
                    name: 'GET',
                    value: 1
                }, {
                    name: 'POST(Json)',
                    value: 2
                }, {
                    name: 'POST(Map)',
                    value: 3
                }]
            }, {
                label: 'token位置',
                keyName: 'positionEnum',
                category: 'request',
                type: 'select',
                options: [{
                    name: 'head',
                    value: 'HEAD'
                }, {
                    name: 'url',
                    value: 'URL'
                }, {
                    name: 'entity',
                    value: 'ENTITY'
                }]
            }, {
                label: 'token名称',
                keyName: 'tokenName',
                category: 'request'
            }, {
                label: 'token获取方式',
                keyName: 'tokenGrabId',
                category: 'request',
                type: 'select',
                options: []
            }, {
                label: '用户唯一标识',
                placeholder: '标识token使用',
                category: 'request',
                keyName: 'userTokenRule'
            },{
                label: '返回数据格式',
                keyName: 'extractElement.type',
                category: 'request',
                type: 'select',
                options: [{
                    name: 'HTML',
                    value: 'HTML'
                }, {
                    name: 'JSON',
                    value: 'JSON'
                }, {
                    name: 'JSONP',
                    value: 'JSONP'
                }]
            },{
                label: 'JSONP回调名',
                keyName: 'extractElement.jsonpMethod',
                category: 'request',
                isShow: {
                    keyName: 'extractElement.type',
                    value: 'JSONP'
                }
            },{
                label: 'head参数',
                keyName: 'heads',
                category: 'request',
                type: 'multi-value',
                value: [{
                    key: '',
                    value: ''
                }],
                combine: {
                    key: 'headName',
                    value: 'headValue'
                }
            },{
                label: '参数map结构',
                keyName: 'paramSchema.paramMap',
                category: 'request',
                type: 'multi-value',
                value: [{
                    key: '',
                    value: ''
                }]
            }, {
                label: '返回码表达式',
                keyName: 'extractElement.grabResultDataStatus.codeSchema.expression',
                category: 'error-handle',
                source: 'grab-detail',
                noGrid: true
            }, {
                label: '返回码名称',
                keyName: 'extractElement.grabResultDataStatus.codeSchema.name',
                category: 'error-handle',
                source: 'grab-detail',
                noGrid: true,
                defaultValue: 'code'
            }, {
                label: '返回码类型',
                keyName: 'extractElement.grabResultDataStatus.codeSchema.objectType',
                category: 'error-handle',
                type: 'select',
                source: 'grab-detail',
                options: [{
                    name: '对象',
                    value: 'OBJECT'
                }, {
                    name: '列表',
                    value: 'LIST'
                }],
                noGrid: true
            }, {
                label: '成功码列表',
                keyName: 'extractElement.grabResultDataStatus.success',
                category: 'error-handle',
                placeholder: '请使用英文逗号分隔',
                type: 'string-list',
                source: 'grab-detail',
                noGrid: true
            }, {
                label: '错误码映射',
                keyName: 'extractElement.grabResultDataStatus.errorCodeMap',
                category: 'error-handle',
                type: 'key-value',
                source: 'grab-detail',
                noGrid: true,
                valueConfig: {
                    type: 'select',
                    options: 'errorCode',
                    placeholder: '值'
                },
                keyConfig: {
                    type: 'input',
                    placeholder: '键',
                }
            }]
        };
    }
    query;
    grabId:number;
    cpId:string;
    resultId:number;
    isEditing:boolean;
    isEdited:boolean;
    isSignEdited:boolean;
    signReg = /^signSchema\./;
    nextStep= async () => {
        if(this.state.current === 1){
            // step three need to load a bunch of configuration from server
            const value = await this.getGrabApiResult();
            const flatJson = flatten(value);
            const keys = Object.keys(flatJson);
            this.setState({
                cpSourceMap: keys.map(key=>({key: '$.'+key, value: flatJson[key]}))
            });
            // result model
            await this.getResultModelList();
            // result map
            this.getResultMapDetail();
            // error code
            this.getErrorCode();
        }
        this.setState({
            current: this.state.current + 1
        });
    }
    previousStep=()=>{
        this.setState({
            current: this.state.current - 1
        });
    }
    applySignSchema(signSchema){
        const fields = this.clone(this.state.fields);
        for(const field of fields){
            if(field.category !== 'sign'){
                continue;
            }
            if(this.signReg.test(field.keyName)){
                const key = field.keyName.replace('signSchema.', '');
                const value = signSchema[key];
                if(field.type === 'list'){
                    field.value = typeof value === 'string' ? JSON.parse(value) : value;
                }else{
                    field.value = value;
                }
            }
        }
        this.setState({fields});
    }
    async freshSignSchema(signId){
        if(!signId){
            this.applySignSchema({
                id: signId,
                beginCharacter:"",
                endCharacter:"",
                hasLastSplice:0,
                paramNames:[''],
                positionEnum:null,
                remark:"",
                signKeyMap:null,
                signParamName:"",
                signParamOrderEnum:null,
                signTypeEnum:null,
                singleParamFormat:"",
                spliceCharacter:"",
            });
            return;
        }
        this.startLoading();
        const apiUri = new URI('http://om.iflow.meizu.com/service/biz/grab/sign/detail');
        apiUri.setQuery('signId', signId);
        const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取签名信息失败：' + res.message);
            return;
        }
        const signSchema = res.value;
        this.applySignSchema(signSchema);
    }
    switchSignSchema(signId){
        // console.log('switch sign id: ', signId);
        const onOk = ()=>{
            const {field, fields} = this.getField('signId');
            field.value = signId;
            this.setState({fields}, this.freshSignSchema.bind(this, signId));
            this.isSignEdited = false;
        };
        if(this.isSignEdited === false){
            onOk();
            return;
        }
        Modal.confirm({
            title: '提示',
            onOk,
            content: '当前配置将会丢失，确定？'
        });
    }
    upsertSignSchema=async()=>{
        const {field: signIdField, fields} = this.getField('signId');
        const signId = signIdField.value;
        const signSchema:any = {};
        const signFields = fields.filter(field=>field.category === 'sign');
        for(const field of signFields){
            if(this.signReg.test(field.keyName)){
                const key = field.keyName.replace('signSchema.', '');
                let value;
                if(field.type === 'list'){
                    value = field.value.filter(each=>['', undefined, null].includes(each) === false);
                }else{
                    value = field.value;
                }
                signSchema[key] = value;
            }
        }
        const isEditing = !!signId;
        if(isEditing === false){
            delete signSchema.id;
            signSchema.cpId = this.cpId;
        }
        const updateApi = SITE_INFO.domain + '/service/biz/grab/sign/update';
        const addApi = SITE_INFO.domain + '/service/biz/grab/sign/add';
        const apiUri = new URI(isEditing ? updateApi : addApi);
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', apiUri.toString());
        this.startLoading();
        const res = await ajax.post(rdUri.toString(), signSchema);
        this.stopLoading();
        if(res.code !== 200){
            message.error('保存签名失败：' + res.message);
            return;
        }
        message.success('保存签名成功');
        this.freshSignList();
        this.freshSignSchema(signId);
    }
    //  get grab detail
    async getDetail(){
        if(!this.grabId){
            console.log('new grab api.');
            return;
        }
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/detail');
        apiUri.setQuery('grabId', this.grabId);
        const url = apiUri.toString();
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取接口配置详情失败：' + res.message);
            return;
        }
        let fields = this.clone(this.state.fields);
        const value = res.value;
        if(value.paramSchema){
            value.paramSchema = JSON.parse(value.paramSchema);
        }
        if(value.grabExtractElement){
            value.grabExtractElement = JSON.parse(value.grabExtractElement);
        }
        if(value.signSchema){
            value.signSchema.signParamOrderEnum = value.signSchema.signParamOrderEnumInt;
        }
        fields = fields.map(field=>{
            const keyName = field.keyName;
            const isValuePath = handy.isValuePath(keyName);
            let val = res.value[keyName];
            if(isValuePath){
                val = handy.getValueByPath(value, field.keyName);
            }
            if(['', null, undefined].includes(val) && field.defaultValue !== undefined){
                val = field.defaultValue;
            }
            if(field.type === 'string-list'){
                val = Array.isArray(val) ? val.join(',') : '';
            }
            if(field.type === 'select' && val){
                if(field.options.some(each=>each.value === val) === false){
                    const foundName = field.options.find(each=>each.name === val);
                    if(foundName){
                        val = foundName.value;
                    }
                }
            }
            if(['multi-value', 'key-value'].includes(field.type)){
                if(typeof val === 'string'){
                    val = JSON.parse(val);
                }
                if(!val || (Array.isArray(val) && val.length === 0)){
                    field.value = [{
                        key: '',
                        value: ''
                    }];
                }else{
                    if(Array.isArray(val)){
                        if(field.combine){
                            field.value = val.map(each=>{
                                return {
                                    key: each[field.combine.key],
                                    value: each[field.combine.value]
                                }
                            });
                        }else{
                            field.value = val;
                        }
                    }else if (typeof val === 'object'){
                        field.value = Object.keys(val).map(key=>({key, value: val[key]}));
                    }
                }
            }else if(field.type === 'list'){
                if(!val){
                    field.value = [''];
                }else{
                    field.value = val;
                }
            }else{
                field.value = val;
            }
            return field;
        });
        // apply original param
        if(value.originalParam){
            // proxy param
            const proxyParam = this.clone(this.state.proxyParam);
            proxyParam.attributes = value.originalParam.attributes;
            proxyParam.baseRule = value.originalParam.baseRule;
            // proxy map
            const proxyMap = value.originalParam.params.map(each=>{
                return {
                    rule: each.rule,
                    name: each.name,
                    valueType: each.valueType,
                    objectType: each.objectType
                };
            });
            this.setState({
                proxyParam,
                proxyMap
            });
        }
        this.setState({
            fields
        });
    }
    getResultModelAndList(modelId?){
        if(!modelId){
            modelId = this.state.modelId;
        }
        const resultModelList = this.clone(this.state.resultModelList);
        const resultModel = resultModelList.find(each=>each.id === modelId);
        return {resultModelList, resultModel};
    }
    getResultMapDetail = async () => {
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/result/detail');
        apiUri.setQuery('grabId', this.grabId);
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()})
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取来源结果转换配置失败：' + res.message);
            return;
        }
        if(res.value){
            // fixedValueMap
            let fixedValueMap = [];
            if(res.value.fixedValues){
                const fixedValues = JSON.parse(res.value.fixedValues);
                if(fixedValues.fixedValueMap){
                    fixedValueMap = Object.keys(fixedValues.fixedValueMap).map(key=>{
                        return {key, value: fixedValues.fixedValueMap[key]};
                    });
                }
            }
            // mappings
            let mappings = [];
            if(res.value.mappings) {
                mappings = JSON.parse(res.value.mappings).map(each=>{
                    return {
                        keyName: each.keyName,
                        valNames: Array.isArray(each.valNames) ? each.valNames.join(',') : (each.valNames ?  each.valNames : ''),
                        expression: each.expression
                    }
                });
            }
            // mapping values
            let mappingStr = res.value.mappingValues;
            let mappingValues = [];
            if(mappingStr){
                const mappingArr = mappingStr.match(/"mappingMap"\s*:\s*({[^}]*})/g);
                if(mappingArr && mappingArr.length){
                    mappingArr.forEach(each=>{
                        const arr = each.replace(/"mappingMap"\s*:\s*/, '')
                            .replace(/\s*/g, '')
                            .replace(/^\{/, '')
                            .replace(/\}$/, '')
                            .split(',')
                            .map(couple=>{
                                if(!couple){
                                    return;
                                }
                                const arr = couple.split(/:(.+)/);
                                const source = arr[0].replace(/"/g, '');
                                const target = arr[1].replace(/"/g, '');
                                return {source, target};
                            }).filter(each=>!!each);
                        mappingStr = mappingStr.replace(each, `"mappingMap":`+ JSON.stringify(arr));
                    });
                    mappingValues = JSON.parse(mappingStr);
                }
            }
            // back-end developer make a typo mistake.
            // modeId === modelId
            const modelId = res.value.modeId;
            const {resultModel, resultModelList} = this.getResultModelAndList(modelId);
            if(!resultModel){
                message.error('找不到相应的转换模型');
                return;
            }
            resultModel.mappings = mappings;
            resultModel.mappingValues = mappingValues;
            resultModel.fixedValueMap = fixedValueMap;
            // some id
            resultModel.grabId = this.grabId;
            resultModel.resultId = res.value.id;
            this.setState({
                resultModelList,
                modelId
            });
            this.getResultModel(res.value.modeId);
        }
    }
    getResultModelList = async () => {
        if(this.state.resultModelList.length){
            console.log('model list is exist, dont retrieve again.')
            return;
        }
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/result/model');
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取转换模型列表失败：' + res.message);
            return;
        }
        this.setState({resultModelList: res.value});
    }
    getResultModel = async (modelId) => {
        const {resultModel, resultModelList} = this.getResultModelAndList(modelId);
        if(resultModel.model && resultModel.model.length){
            console.log('this model has been retrieved, dont fetch again.');
            return;
        }
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/result/getModel');
        apiUri.setQuery('modelId', modelId);
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取转换模型失败：' + res.message);
            return;
        }
        resultModel.model = res.value;
        this.setState({resultModelList});
    }
    async componentDidMount(){
        await this.getDetail();
        await this.freshGrabList();
        const signField = this.findField(this.state.fields, 'signId');
        this.freshSignSchema(signField.value);
        this.freshSignList();
        
    }
    async freshSignList(){
        this.startLoading();
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/sign/list');
        const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取签名列表失败：' + res.message);
            return;
        }
        const fields = this.clone(this.state.fields);
        const options = res.value.map(schema=>{
            return {name: schema.remark, value: schema.id};
        });
        for(const field of fields){
            if(['signId', 'signSchema.id'].includes(field.keyName)){
                field.options = options;
            }
        }
        this.setState({fields});
    }
    async freshGrabList(){
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/list');
        apiUri.setQuery('cpId', this.cpId);
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取当前CP的接口列表失败：' + res.message);
            return;
        }
        const {field, fields} = this.getField('tokenGrabId');
        field.options = res.value.map(each=>{
            return {
                name: each.name,
                value: each.id
            };
        });
        this.setState({fields});
    }
    startLoading(){
        this.setState(prevState=>({
            loading: prevState.loading + 1
        }));
    }
    stopLoading(){
        this.setState(prevState=>({
            loading: prevState.loading - 1
        }));
    }
    clone(target){
        return JSON.parse(JSON.stringify(target));
    }
    getField(keyName){
        const fields = this.clone(this.state.fields);
        const field = this.findField(fields, keyName);
        return {
            fields,
            field
        };
    }
    findField(fields, keyName){
        return fields.find(field=>field.keyName === keyName);
    }
    addMultiValue(keyName){
        const {field, fields} = this.getField(keyName);
        // console.log(foundField);
        field.value.push({
            key: undefined,
            value: undefined
        });
        this.setState({fields});
    }
    deleteMultiValue(keyName, index){
        const {field, fields} = this.getField(keyName);
        field.value.splice(index, 1);
        this.setState({fields});
    }
    multiValueChange(keyName, targetIndex, targetKey, event){
        const val = (event && event.target) ? event.target.value : event;
        const {field, fields} = this.getField(keyName);
        field.value[targetIndex][targetKey] = val;
        this.setState({fields});
        this.isEdited = true;
    }
    listValueChange(keyName, targetIndex, event){
        const value = event.target.value;
        const {field, fields} = this.getField(keyName);
        field.value[targetIndex] = value;
        this.setState({fields});
    }
    addListValue(keyName){
        const {field, fields} = this.getField(keyName);
        field.value.push('');
        this.setState({fields});
    }
    deleteListValue(keyName, index){
        const {field, fields} = this.getField(keyName);
        field.value.splice(index, 1);
        this.setState({fields});
    }
    changeValue(keyName, event){
        const val = (event && event.target) ? event.target.value : event;
        const fields = this.clone(this.state.fields);
        const foundField = this.findField(fields, keyName);
        foundField.value = val;
        this.setState({fields});
        this.isEdited = true;
        if(this.signReg.test(keyName)){
            this.isSignEdited = true;
        }
    }
    makeSignSchemeFromFields(){
        const signSchema:any = {};
        for(const field of this.state.fields){
            if(this.signReg.test(field.keyName)){
                const key = field.keyName.replace(this.signReg, '');
                if(key){
                    signSchema[key] = field.value;
                }
            }
        }
        return signSchema;
    }
    makeRequestSchemaFromFields(){
        const requestSchema:any = {
            extractElement: {},
            originalParam: {}
        };
        // console.log('cp id: ', this.cpId);
        if(this.grabId){
            requestSchema.id = +this.grabId;
        }
        requestSchema.cpId = +this.cpId;
        for(const field of this.state.fields){
            if(['error-handle', 'request'].includes(field.category) === false){
                continue;
            }
            const val = this.getFieldValue(field);
            const isValuePath = handy.isValuePath(field.keyName);
            if(isValuePath){
                handy.applyObjByPath(requestSchema, field.keyName, val);
            }else{
                requestSchema[field.keyName] = val;
            }
        }
        if(this.state.proxyParam){
            const originalParam = this.state.proxyParam;
            requestSchema.originalParam.attributes = originalParam.attributes;
            requestSchema.originalParam.baseRule = originalParam.baseRule;
        }
        if(Array.isArray(this.state.proxyMap)){
            requestSchema.originalParam.params = this.state.proxyMap.map(each=>{
                return each;
            });
        }
        // if error code expression is empty. don't send grabResultDataStatus value.
        if(!requestSchema.extractElement.grabResultDataStatus.codeSchema.expression){
            delete requestSchema.extractElement.grabResultDataStatus;
        }
        return requestSchema;
    }
    getGrabApiResult = async () => {
        const checkApiUri = new URI('http://om.iflow.meizu.com/service/biz/grab/test');
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', checkApiUri.toString());
        const signSchema = this.makeSignSchemeFromFields();
        const requestSchema = this.makeRequestSchemaFromFields();
        this.startLoading();
        const res = await ajax.post(rdUri.toString(), {
            signSchemaString: signSchema,
            grabParamString: requestSchema,
            grabSite: {}
        });
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取测试数据失败: ' + res.message);
        }
        return JSON.parse(res.value);
    }
    checkGrabApi = async() => {
        const value = await this.getGrabApiResult();
        if(value){
            this.viewJsonResult(value);
        }else{
            message.error('没有返回数据');
        }
    }
    // result map
    resultMapAdd = () => {
        const {resultModel, resultModelList} = this.getResultModelAndList();
        if(!resultModel.mappings){
            resultModel.mappings = [];
        }
        const mappings = resultModel.mappings;
        mappings.push({
            keyName: '',
            keyValue: ''
        });
        this.setState({resultModelList});
    }
    resultItemChange = (index, keyName, event) => {
        const val = (event && event.target) ? event.target.value : event;
        const {resultModel, resultModelList} = this.getResultModelAndList();
        const mappings = resultModel.mappings;
        mappings[index][keyName] = val;
        this.setState({resultModelList});
    }
    resultItemDelete = (index)=>{
        const {resultModel, resultModelList} = this.getResultModelAndList();
        const mappings = resultModel.mappings;
        mappings.splice(index, 1);
        this.setState({resultModelList});
    }
    toggleResultExpressionModal=(resultMapEditingIndex, type = '')=>{
        // console.log('open expression index: ' + resultMapEditingIndex);
        const {resultModel, resultModelList} = this.getResultModelAndList();
        const mappings = resultModel.mappings;
        const item = mappings[resultMapEditingIndex];
        let expressionCache = '';
        let isResultExpressionOpen = false;
        // console.log('item: ' + JSON.stringify(item));
        if(resultMapEditingIndex !== null){
            expressionCache = item.expression;
            isResultExpressionOpen = true;
        }
        if(type === 'cancel'){
            item.expression = this.state.expressionCache;
            isResultExpressionOpen = false;
            resultMapEditingIndex = null;
        }
        if(type === 'save'){
            // it saved already in this.resultExpressChange
            isResultExpressionOpen = false;
        }
        this.setState({
            isResultExpressionOpen,
            resultMapEditingIndex,
            expressionCache,
            resultModelList
        });
    }
    resultExpressChange=(event)=>{
        const {resultModel, resultModelList} = this.getResultModelAndList();
        const mappings = resultModel.mappings;
        const item = mappings[this.state.resultMapEditingIndex];
        item.expression = event.target.value;
        this.setState({
            resultModelList
        });
    }
    getFieldValue(field){
        if(field.type === 'string-list'){
            return typeof field.value === 'string' ? field.value.split(',').map(each=>each.trim()) : [];
        }else if(['multi-value', 'key-value'].includes(field.type)){
            let result;
            const isNeedCombine:boolean = !!field.combine;
            if(isNeedCombine){
                result = [];
            }else{
                result = {};
            }
            field.value.forEach(each=>{
                if(!each.key){
                    return;
                }
                if(typeof each.value === 'string' && handy.isJsonValue(each.value)){
                    each.value = JSON.parse(each.value);
                }
                if(isNeedCombine){
                    result.push({
                        [field.combine.key]: each.key,
                        [field.combine.value]: each.value
                    });
                }else{
                    result[each.key] = this.adjustValueType(each.value);
                }
            });
            return result;
        }else{
            return field.value;
        }
    }
    makeGrabResultParam(){
        const resultModel = this.state.resultModelList.find(each=>each.id === this.state.modelId);
        if(!resultModel){
            message.error('找不到转换模型');
            return;
        }
        const model = this.clone(resultModel);
        delete model.model;
        if(Array.isArray(model.mappingValues) && model.mappingValues.length){
            model.mappingValues = model.mappingValues.map(each=>{
                if(Array.isArray(each.mappingMap) && each.mappingMap.length){
                    const mappingMap = {};
                    each.mappingMap.forEach(eachMap => {
                        const source = this.adjustValueType(eachMap.source);
                        const target = this.adjustValueType(eachMap.target);
                        mappingMap[source] = target;
                    });
                    each.mappingMap = mappingMap;
                }else{
                    each.mappingMap = {};
                    if(!each.paramMappingSelectEnum && !each.defaultValue){
                        return null;
                    }
                }
                return each;
            }).filter(each=>!!each);
        }
        if(Array.isArray(model.fixedValueMap) && model.fixedValueMap.length){
            const fixedValueMap = {};
            model.fixedValueMap.forEach(each=>{
                fixedValueMap[each.key] = this.adjustValueType(each.value);
            });
            model.fixedValues = {
                fixedValueMap
            };
            delete model.fixedValueMap;
        }
        model.mappings = model.mappings.map(function(each){
            if(typeof each.valNames === 'string' && each.valNames){
                each.valNames = each.valNames.split(',');
            }else{
                if(['',null,undefined].includes(each.valNames)){
                    each.valNames = [];
                }else{
                    each.valNames = [each.valNames];
                }
            }
            return each;
        });
        // transfer object to string
        model.fixedValues = JSON.stringify(model.fixedValues);
        model.mappingValues = JSON.stringify(model.mappingValues);
        model.mappings = JSON.stringify(model.mappings);
        // "modeId" is not a typo error
        model.modeId = this.state.modelId;
        // if update a grab, append grab id to parameters
        if(this.grabId){
            model.grabId = +(this.grabId);
        }
        // In editing state, "id" is "model id". But in post state, "id" should be "grab result id".
        if(model.resultId){
            model.id = model.resultId;
            delete model.resultId;
        }else{
            delete model.id;
        }
        return model;
    }
    adjustValueType(val){
        if(typeof val !== 'string'){
            return val;
        }
        if(val === 'null'){
            return null;
        }
        if(val === 'true'){
            return true;

        }
        if(val === 'false'){
            return false;
        }
        if(val === 'undefined'){
            return undefined;
        }
        if(val === ''){
            return '';
        }
        if(/[^\d]/.test(val) === false){
            // this value may bigger than Number.MAX_SAFE_INTEGER.
            const v = (+val);
            if(v < Number.MAX_SAFE_INTEGER){
                val = v;
            }
        }
        return val;
    }
    makeResultModelPayload(){
        const signSchemaString = this.makeSignSchemeFromFields();
        const grabParamString = this.makeRequestSchemaFromFields();
        const grabResultParamString = this.makeGrabResultParam();
        return {
            signSchemaString,
            grabParamString,
            grabResultParamString,
            grabSite: {}
        };
    }
    async getErrorCode(){
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/result/getErrorCode');
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: apiUri.toString()});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取错误码列表错误：' + res.message);
            return;
        }
        const errorCode = Array.isArray(res.value) ? res.value.map(each=>({name: each.des, value: each.type})) : [];
        this.setState({errorCode});
    }
    checkResultModel=async ()=>{
        const payload = this.makeResultModelPayload();
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/result/test');
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', apiUri.toString());
        this.startLoading();
        const res = await ajax.post(rdUri.toString(), payload);
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取验证信息失败：' + res.message);
            return;
        }
        this.viewJsonResult(res.value);
    }
    invokeSaveGrab=async()=>{
        const grabParamString = this.makeRequestSchemaFromFields();
        const apiUri = new URI(SITE_INFO.domain + '/service/biz/grab/update');
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', apiUri.toString());
        this.startLoading();
        const res = await ajax.post(rdUri.toString(), grabParamString);
        this.stopLoading();
        return res;
    }
    saveGrab=async()=>{
        const res = await this.invokeSaveGrab();
        if(res.code !== 200){
            message.error('保存访问配置失败：' + res.message);
            return;
        }
        if(!res.value){
            message.error('没返回保存grab的id.');
            return;
        }
        if(res.value === true){
            // when return true, it mean update grab no add a new grab.
        }else{
            this.grabId = +res.value;
        }
        message.success('保存成功');
        this.getDetail();
    }
    saveGrabResult=async()=>{
        const grabRes = await this.invokeSaveGrab();
        if(grabRes.code !== 200){
            message.error('保存访问配置失败：' + grabRes.message);
            return;
        }
        this.getDetail();
        this.getResultMapDetail();
        const grabResultParamString = this.makeGrabResultParam();
        const rdUri = new URI(API.serverRequest.url);
        rdUri.setQuery('url', SITE_INFO.domain + '/service/biz/grab/result/update');
        this.startLoading();
        const res = await ajax.post(rdUri.toString(), grabResultParamString);
        this.stopLoading();
        if(res.code !== 200){
            message.error('保存转换配置失败：' + res.message);
            return;
        }
        message.success('保存成功');
        this.getResultMapDetail();
    }
    cancel=()=>{
        if(this.isEdited){
            Modal.confirm({
                title: '提示',
                content: '编辑的内容将会丢失，确定？',
                onOk(){
                    window.history.back();
                }
            });
        }else{
            window.history.back();
        }
    }
    jsonEditor;
    jsonEditorKeyName;
    jsonEditorIndex;
    openJsonEditor(keyName, index){
        const field = this.state.fields.find(each=>each.keyName === keyName);
        let value = field.value[index].value;
        if(typeof value === 'string'){
            value = JSON.parse(value);
        }
        this.setState({isJsonEditorOpen: true}, ()=>{
            this.jsonEditorKeyName = keyName;
            this.jsonEditorIndex = index;
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
    jsonViewer;
    viewJsonResult(value){
        if(!value){
            return;
        }
        if(typeof value !== 'object'){
            try{
                value = JSON.parse(value);
            }catch{
                message.error('json-editor: 无法展示该变量');
                return;
            }
        }
        this.setState({isJsonViewerOpen: true}, ()=>{
            setTimeout(() => {
                if(this.jsonViewer === undefined){
                    const container = document.getElementById('json-viewer');
                    const option = {};
                    this.jsonViewer = new JSONEditor(container, option);
                }
                this.jsonViewer.set(value);
            }, 10);
        });
    }
    closeJsonViewer=()=>{
        this.setState({isJsonViewerOpen: false});
    }
    closeJsonEditor=()=>{
        this.setState({isJsonEditorOpen: false});
    }
    saveJson=()=>{
        this.multiValueChange(this.jsonEditorKeyName, this.jsonEditorIndex, 'value', JSON.stringify(this.jsonEditor.get()));
        this.closeJsonEditor();
    }
    makeFormItem(field){
        // console.log('field:', field);
        if(field.isShow){
            const relateKeyName = field.isShow.keyName;
            const relateValue = field.isShow.value;
            const foundField = this.findField(this.state.fields, relateKeyName);
            if(foundField.value !== relateValue){
                return '';
            }
        }else if(field.isHide){
            return '';
        }
        const elProps:any = {};
        const itemProps:any = {};
        let el;
        if(field.placeholder){
            elProps.placeholder = field.placeholder;
        }
        if(field.readonly){
            elProps.disabled = true;
        }
        elProps.onChange = this.changeValue.bind(this, field.keyName);
        elProps.value = field.value;
        if(field.type === 'switch'){
            el = (
                <Switch {...elProps} />
            );
        }else if(field.type === 'list'){
            el = field.value.map((each,index)=>{
                return (
                    <div key={index}>
                        <Col span={20}>
                            <FormItem>
                                <Input value={each} onChange={this.listValueChange.bind(this, field.keyName, index)}></Input>
                            </FormItem>
                        </Col>
                        <Col span={3} offset={1}>
                            <Button.Group>
                                <Button icon="plus" onClick={this.addListValue.bind(this, field.keyName)}></Button>
                                {field.value.length !== 1 && <Button icon="minus" onClick={this.deleteListValue.bind(this, field.keyName, index)}></Button>}
                            </Button.Group>
                        </Col>
                    </div>
                );
            });
        }else if(field.type === 'multi-value'){
            const labelCol = {span: 4};
            const wrapperCol = {span: 18};
            el = field.value.map((val,i)=>{
                const editJSONIcon = <Icon type="edit" onClick={this.openJsonEditor.bind(this, field.keyName, i, 'value')} />;
                if(typeof val.value !== 'string'){
                    val.value = JSON.stringify(val.value);
                }
                let isValueJson = handy.isJsonValue(val.value);
                return (
                    <div key={i}>
                        <Col span={10}>
                            <FormItem label="参数" labelCol={labelCol} wrapperCol={wrapperCol}>
                                <Input value={val.key} onChange={this.multiValueChange.bind(this, field.keyName, i, 'key')}></Input>
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label="值" labelCol={labelCol} wrapperCol={wrapperCol}>
                                <Input value={val.value} onChange={this.multiValueChange.bind(this, field.keyName, i, 'value')}
                                    suffix={isValueJson&&editJSONIcon}></Input>
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <Button.Group>
                                <Button icon="plus" onClick={this.addMultiValue.bind(this, field.keyName)}></Button>
                                {field.value.length !== 1 && <Button icon="minus" onClick={this.deleteMultiValue.bind(this, field.keyName, i)}></Button>}
                            </Button.Group>
                        </Col>
                    </div>
                )
            });
        } else if(field.type === 'key-value'){
            // 'key-value' type is kind of update from 'multi-value' type.
            Array.isArray(field.value) === false && (field.value = []);
            el = field.value.map((val,i)=>{
                const makeInput = (config, target)=>{
                    let inputEl;
                    if(config.type === 'select'){
                        let options;
                        if(Array.isArray(config.options)){
                            options = config.options;
                        }else if(typeof config.options === 'string'){
                            options = this.state[config.options];
                        }
                        const optionsEl = options.map(each=><Option key={each.value} value={each.value}>{each.name}</Option>);
                        inputEl = <Select value={val[target]}
                            placeholder={config.placeholder}
                            onChange={this.multiValueChange.bind(this, field.keyName, i, target)}>{optionsEl}</Select>;
                    }else{
                        inputEl = <Input value={val[target]}
                            placeholder={config.placeholder}
                            onChange={this.multiValueChange.bind(this, field.keyName, i, target)}></Input>;
                    }
                    return inputEl;
                };
                return (
                    <div className="item" key={i}>
                        {makeInput(field.keyConfig, 'key')}
                        <Icon type="right" />
                        {makeInput(field.valueConfig, 'value')}
                        <Button icon="close" onClick={this.deleteMultiValue.bind(this, field.keyName, i)}></Button>
                    </div>
                )
            });
            el.unshift(<Divider key="divider">{field.label}</Divider>);
            el.push(<div className="item" key="plus"><Button icon="plus" className="block" onClick={this.addMultiValue.bind(this, field.keyName)}></Button></div>);
            return el;
        }else if(field.type === 'select'){
            if(field.value === undefined){
                field.value = null;
            }
            const allOp = <Option key="all" value={null}>{field.emptyName || '无'}</Option>;
            const options = field.options.map(op=>{
                return <Option key={op.value} value={op.value}>{op.name}</Option>
            });
            options.unshift(allOp);
            const selectProps:any = {};
            selectProps.value = field.value;
            selectProps.onChange = field.keyName === 'signSchema.id' ?
                this.switchSignSchema.bind(this):
                this.changeValue.bind(this, field.keyName);
            el = (
                <Select {...selectProps}>
                    {options}
                </Select>
            );
        }else{
            el = (
                <Input {...elProps}></Input>
            );
        }
        itemProps.label = field.label;
        if(field.noGrid){
            // no grid
        }else{
            itemProps.labelCol = {span: 4};
            itemProps.wrapperCol = {span: 18};
        }
        itemProps.key = field.label;
        if(field.required){
            itemProps.required = true;
        }
        return (
            <FormItem {...itemProps}>
                {el}
            </FormItem>
        );
    }
    proxyParamChange = (key, event) => {
        const proxyParam = this.clone(this.state.proxyParam);
        proxyParam[key] = event.target.value;
        this.setState({proxyParam});
    }
    proxyParamDrop = (key) => {
        const proxyParam = this.clone(this.state.proxyParam);
        proxyParam[key] = this.state.dragging.key;
        this.setState({proxyParam});
    }
    dragItem = (item, _from) => {
        this.setState({
            dragging: {...item, _from}
        });
    }
    addProxyItem = () => {
        const proxyMap = this.clone(this.state.proxyMap);
        proxyMap.push({
            rule: '',
            name: '',
            valueType: null,
            objectType: null,
            map: []
        });
        this.setState({proxyMap});
    }
    deleteProxyItem = (index) => {
        const proxyMap = this.clone(this.state.proxyMap);
        proxyMap.splice(index, 1);
        this.setState({proxyMap});
    }
    proxyItemChange = (index, key, event) => {
        const value = (event && event.target) ? event.target.value : event;
        const proxyMap = this.clone(this.state.proxyMap);
        const item = proxyMap[index];
        item[key] = value;
        this.setState({proxyMap});
    }
    proxyItemDrop = (index) => {
        const proxyMap = this.clone(this.state.proxyMap);
        proxyMap[index].rule = this.state.dragging.key;
        this.setState({proxyMap});
    }
    preventDragOver = (event) =>{
        event.preventDefault();
        // console.log(arguments);
    }
    toggleMapEditor= (keyName) => {
        if(!keyName){
            message.error('请先选择目标参数');
            return;
        }
        if(keyName === '_ok'){
            this.setState({
                isMapEditorOpen: false
            });
            return;
        }
        const {resultModel, resultModelList} = this.getResultModelAndList();
        if(!resultModel.mappingValues){
            resultModel.mappingValues = [];
        }
        const mappingValues = resultModel.mappingValues;
        if(keyName === '_cancel'){
            // fallback original value
            const editingKeyName = this.state.editingResultDataMap.keyName;
            const index = mappingValues.findIndex(each=>each.keyName === editingKeyName);
            mappingValues.splice(index, 1, this.state.editingResultDataMap);
            this.setState({
                resultModelList,
                isMapEditorOpen: false
            });
            return;
        }
        if(keyName){
            const item = mappingValues.find(each=>each.keyName === keyName);
            if(!item){
                mappingValues.push({
                    defaultValue: '',
                    keyName: keyName,
                    mappingMap: [],
                    paramMappingSelectEnum: ''
                });
            }
        }
        const editingResultDataMap = mappingValues.find(each=>each.keyName === keyName);
        this.setState({
            editingResultDataMap,
            resultModelList,
            isMapEditorOpen: !this.state.isMapEditorOpen,
            editingMapKeyName: keyName
        });
    }
    addMapItem=()=>{
        const {resultModel, resultModelList} = this.getResultModelAndList();
        const mappingValues = resultModel.mappingValues;
        mappingValues.push({
            keyName: '',
            defaultValue: '',
            paramMappingSelectEnum: null,
            mappingMap: []
        });
        this.setState({resultModelList});
    }
    addMappingMap=()=>{
        const {resultModel, resultModelList} = this.getResultModelAndList();
        const mappingValues = resultModel.mappingValues;
        const item = mappingValues.find(each=>each.keyName === this.state.editingMapKeyName);
        item.mappingMap.push({
            source: '',
            target: ''
        });
        this.setState({resultModelList});
    }
    deleteMapItem(index){
        const {resultModel, resultModelList} = this.getResultModelAndList();
        const mappingValues = resultModel.mappingValues;
        const item = mappingValues.find(each=>each.keyName === this.state.editingMapKeyName);
        item.mappingMap.splice(index, 1);
        this.setState({resultModelList});
    }
    mapItemChange=(target, mappingIndex, event)=>{
        const {resultModel, resultModelList} = this.getResultModelAndList();
        const mappingValues = resultModel.mappingValues;
        const val = (event && event.target) ? event.target.value : event;
        const item = mappingValues.find(each=>each.keyName === this.state.editingMapKeyName);
        if(mappingIndex === null){
            item[target] = val;
        }else{
            item.mappingMap[mappingIndex][target] = val;
        }
        this.setState({resultModelList});
    }
    modelIdChange = (modelId)=>{
        this.getResultModel(modelId);
        this.setState({modelId})
    }
    // fixed value map
    addFixedValueMap=()=>{
        const {resultModel, resultModelList} = this.getResultModelAndList();
        if(Array.isArray(resultModel.fixedValueMap) === false){
            console.log('fixedValueMap not a array, set it to array');
            resultModel.fixedValueMap = [];
        }
        resultModel.fixedValueMap.push({
            key: '',
            value: ''
        });
        this.setState({resultModelList});
    }
    deleteFixedValueMap=(index)=>{
        const {resultModel, resultModelList} = this.getResultModelAndList();
        resultModel.fixedValueMap.splice(index, 1);
        this.setState({resultModelList});
    }
    changeFixedValueMap=(index, keyName, event)=>{
        const {resultModel, resultModelList} = this.getResultModelAndList();
        resultModel.fixedValueMap[index][keyName] = event.target.value;
        this.setState({resultModelList});
    }
    render(){
        const {current} = this.state;
        const signFields = this.state.fields
            .filter(field=>field.category==='sign')
            .map(field=>{
                return this.makeFormItem(field);
            });
        const stepOne = (
            <div className="step step-one">
                <Form layout="horizontal">
                    {signFields}
                </Form>
            </div>
        );
        const requestFields = this.state.fields
            .filter(field=>field.category==='request')
            .map(field=>{
                return this.makeFormItem(field);
            });
        const stepTwo = (
            <div className="step step-two">
                <Form layout="horizontal">
                    {requestFields}
                </Form>
            </div>
        );
        const cpSourceMap = this.state.cpSourceMap.map(each=>{
            return <div className="item" onDragStart={this.dragItem.bind(this, each, 'cp-source')} draggable key={each.key} title={each.value + ''}>{each.key}</div>;
        });
        const proxyMap = this.state.proxyMap.map((each,index)=>{
            const valueTypeSelect = (
                <Select onChange={this.proxyItemChange.bind(this, index, 'valueType')} value={each.valueType}>
                    <Option value={null}>默认</Option>
                    <Option value={1} data-name="object">对象</Option>
                    <Option value={2} data-name="list">列表</Option>
                </Select>
            );
            return (
                <div className="item" key={index}>
                    <div className="source">
                        <Input value={each.rule} placeholder="来源表达式"
                            onDrop={this.proxyItemDrop.bind(this, index)}
                            onDragOver={this.preventDragOver}
                            onChange={this.proxyItemChange.bind(this, index, 'rule')} />
                    </div>
                    <div className="icon swap-right-icon"><Icon type="right" /></div>
                    <InputGroup className="target" compact>
                        {valueTypeSelect}
                        <Input value={each.name} placeholder="参数名称"
                            onChange={this.proxyItemChange.bind(this, index, 'name')} />
                    </InputGroup>
                    <Button icon="close" type="danger" onClick={this.deleteProxyItem.bind(this, index)} />
                </div>
            );
        });
        const resultModel = this.state.resultModelList.find(each=>each.id === this.state.modelId) || {};
        const model = resultModel.model || [];
        const modelDataSource = model.map(each=>{
            return {value: each.name, text: each.desc};
        });
        // mappings
        const mappings = resultModel.mappings || [];
        const mappingsCPN = mappings.map((each, index)=>{
            const sourceSelect = (
                <AutoComplete value={each.keyName || undefined}
                    showSearch={true}
                    dataSource={modelDataSource}
                    placeholder="目标参数"
                    style={{"minWidth": 165}} onChange={this.resultItemChange.bind(this, index, 'keyName')}>
                </AutoComplete>
            );
            return (
                <div className="item" key={index}>
                    {sourceSelect}
                    <Icon type="right" />
                    <Input value={each.valNames}
                        placeholder="来源数据"
                        onChange={this.resultItemChange.bind(this, index, 'valNames')}></Input>
                    <Tooltip title="数据映射"><Button icon="swap" onClick={this.toggleMapEditor.bind(this, each.keyName)}></Button></Tooltip>
                    <Tooltip title="表达式"><Button icon="code-o" onClick={this.toggleResultExpressionModal.bind(this, index)}></Button></Tooltip>
                    <Tooltip title="删除"><Button onClick={this.resultItemDelete.bind(this, index)} type="danger" icon="close" /></Tooltip>
                </div>
            );
        });
        // fixed value
        const fixedValue = resultModel && resultModel.fixedValueMap && resultModel.fixedValueMap.map((each,index)=>{
            return (
                <div className="item" key={index}>
                    <Input value={each.key} onChange={this.changeFixedValueMap.bind(this, index, 'key')} placeholder="参数名"></Input>
                    <Icon type="right" />
                    <Input value={each.value} placeholder="值" onChange={this.changeFixedValueMap.bind(this, index, 'value')}></Input>
                    <Tooltip title="删除"><Button onClick={this.deleteFixedValueMap.bind(this, index)} type="danger" icon="close" /></Tooltip>
                </div>
            )
        });
        // error handle
        const errorHandle = this.state.fields.filter(field=>{
            return field.category === 'error-handle';
        }).map(field=>{
            return this.makeFormItem(field);
        });
        const stepThree = (
            <div className="step step-three">
                <div className="cp-map">
                    {cpSourceMap}
                </div>
                <Icon type="arrow-right" />
                <div className="proxy-map">
                    <div className="list">
                        <FormItem label="层级属性" className="item proxy-param">
                            <Input value={this.state.proxyParam.attributes} onChange={this.proxyParamChange.bind(this, 'attributes')}></Input>
                        </FormItem>
                        <FormItem label="对应层级" className="item proxy-param">
                            <Input value={this.state.proxyParam.baseRule}
                                onDragOver={this.preventDragOver}
                                onDrop={this.proxyParamDrop.bind(this, 'baseRule')}
                                onChange={this.proxyParamChange.bind(this, 'baseRule')}></Input>
                        </FormItem>
                        <Divider>错误处理</Divider>
                        {errorHandle}
                        <Divider>参数映射</Divider>
                        {proxyMap}
                        <div className="item">
                            <Button icon="plus" className="add-proxy-map-item" onClick={this.addProxyItem} />
                        </div>
                    </div>
                </div>
                <Icon type="arrow-right" />
                <div className="target-map">
                    <FormItem label="目标模型" className="inline item">
                        <Select value={this.state.modelId} onChange={this.modelIdChange} style={{width: 345}}>
                            {this.state.resultModelList.map(each=><Option key={each.id} value={each.id}>{each.desc}</Option>)}
                        </Select>
                    </FormItem>
                    <div className="item">
                        <Divider>固定映射参数</Divider>
                    </div>
                    {fixedValue}
                    <div className="item">
                        <Button icon="plus" className="block" onClick={this.addFixedValueMap} />
                    </div>
                    <div className="item">
                        <Divider>转换列表</Divider>
                    </div>
                    {mappingsCPN}
                    <div className="item">
                        <Button icon="plus" className="block" onClick={this.resultMapAdd} />
                    </div>
                </div>
            </div>
        );
        // mapping value
        const mappingValues = resultModel.mappingValues || [];
        const mappingValue = mappingValues.find(each=>each.keyName === this.state.editingMapKeyName);
        let mapEditForm;
        if(mappingValue){
            const mappingMap = mappingValue.mappingMap.map((each, index)=>{
                return <div className="inline-input" key={index}>
                    <Input value={each.source}
                        onChange={this.mapItemChange.bind(this, 'source', index)}
                        placeholder="来源值"></Input>
                    <Icon type="right" />
                    <Input value={each.target}
                        onChange={this.mapItemChange.bind(this, 'target', index)}
                        placeholder="目标值"></Input>
                    <Tooltip title="删除">
                        <Button type="danger" icon="close" onClick={this.deleteMapItem.bind(this, index)} />
                    </Tooltip>
                </div>
            });
            const paramMappingOptions = [
                    {key: 1, value:'ORIGINAL', name: '原始值'},
                    {key: 2, value: 'NULL', name: '空值'},
                    {key: 3, value: 'DEFAULT', name: '默认值'}
                ].map(each=>{
                    return <Option key={each.key} value={each.value}>{each.name}</Option>
            });
            paramMappingOptions.unshift(<Option key={null} value={null} disabled={true}>请选择</Option>);
            mapEditForm = (
                <Form layout="horizontal">
                    <FormItem label="键名">
                        <Input value={mappingValue.keyName}
                            disabled={true}
                            placeholder="keyName" />
                    </FormItem>
                    <FormItem label="默认值">
                        <Input value={mappingValue.defaultValue}
                            placeholder="key"
                            onChange={this.mapItemChange.bind(this, 'defaultValue', null)} />
                    </FormItem>
                    <FormItem label="参数值">
                        <Select value={mappingValue.paramMappingSelectEnum}
                            onChange={this.mapItemChange.bind(this, 'paramMappingSelectEnum', null)} >
                            {paramMappingOptions}
                        </Select>
                    </FormItem>
                    <FormItem label="数据映射">
                        {mappingMap}
                        <Button icon="plus" className="block" onClick={this.addMappingMap.bind(this)}></Button>
                    </FormItem>
                </Form>
            )
        }
        return (
            <div className="cp-api-manage">
                <div className="steps">
                    <Steps current={current}>
                        <Step title="签名配置" />
                        <Step title="访问配置" />
                        <Step title="转换配置" />
                    </Steps>
                </div>
                <div className="step-content">
                    <Spin spinning={!!this.state.loading}>
                        {current === 0 && stepOne}
                        {current === 1 && stepTwo}
                        {current === 2 && stepThree}
                        <div className="panel">
                            <Divider />
                            <Button.Group className="step-button">
                                {current !== 0 && <Button onClick={this.previousStep}>上一步</Button>}
                                {current === 1 && <Button onClick={this.checkGrabApi}>验证访问配置</Button>}
                                {current === 2 && <Button onClick={this.checkResultModel}>验证转换配置</Button>}
                                {current !== 2 && <Button onClick={this.nextStep}>下一步</Button>}                    
                            </Button.Group>
                            <Divider type="vertical" />
                            <Button.Group>
                                {current === 0 && <Button onClick={this.upsertSignSchema}>保存签名配置</Button>}
                                {current === 1 && <Button onClick={this.saveGrab}>保存访问配置</Button>}
                                {current === 2 && <Button onClick={this.saveGrabResult}>保存</Button>}
                                <Button onClick={this.cancel}>取消</Button>
                            </Button.Group>
                        </div>
                    </Spin>
                </div>
                <Modal visible={this.state.isMapEditorOpen}
                    onCancel={this.toggleMapEditor.bind(this, '_cancel')}
                    onOk={this.toggleMapEditor.bind(this, '_ok')}
                    closable={false}
                    className="result-mapping-editor-modal"
                    title="编辑Map">
                    {mapEditForm}
                </Modal>
                <Modal visible={this.state.isResultExpressionOpen}
                    title="编辑转换表达式"
                    className="result-express-modal"
                    closable={true}
                    onCancel={this.toggleResultExpressionModal.bind(this, this.state.resultMapEditingIndex, 'cancel')}
                    footer={<Button type="primary" onClick={this.toggleResultExpressionModal.bind(this, null, 'save')}>保存</Button>}>
                    <TextArea autosize={{minRows: 5}}
                        value={this.state.resultMapEditingIndex === null ? '' : mappings[this.state.resultMapEditingIndex].expression}
                        onChange={this.resultExpressChange} placeholder="请输入转换表达式"></TextArea>
                </Modal>
                <Modal visible={this.state.isJsonEditorOpen}
                    closable={false}
                    maskClosable={false}
                    onOk={this.saveJson}
                    onCancel={this.closeJsonEditor}
                    title="编辑JSON"
                    className="json-editor-modal">
                    <div id="json-editor"></div>
                </Modal>
                <Modal visible={this.state.isJsonViewerOpen}
                    closable={true}
                    maskClosable={false}
                    onCancel={this.closeJsonViewer}
                    width={720}
                    title="查看JSON"
                    footer={<Button onClick={this.closeJsonViewer}>关闭</Button>}
                    className="json-viewer-modal">
                    <div id="json-viewer"></div>
                </Modal>
            </div>
        );
    }
}

const container = connect()(CPAPIManage);

export default container;