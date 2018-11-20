// for further development, I separate it from 'DisFilter'.
import * as React from 'react';
import {connect} from 'react-redux';
import {
    Form,
    Input,
    Select,
    Button,
    message
} from 'antd';
import handy from '../../lib/handy';
import distributionLib from '../../lib/distribution';
import '../../sass/component/filter/contentAlgorithm';
import ajax from '../../lib/ajax';
import API from '../../const/API';
import freshList from '../../action/freshAlgorithmContents';
const URI = require('urijs');
const ALGORITHM = require('../../../common/enum/ALGORITHM');
const CP_SOURCES = require('../../../common/enum/DISTRIBUTION_CP');
const CONTENT_TYPES = require('../../../common/enum/CONTENT_TYPES');
const DISTRIBUTION_ORDER = require('../../../common/enum/DISTRIBUTION_ORDER');
const DISPLAY_STYLE = require('../../../common/enum/DISTRIBUTION_STYLES');
const OPEN_TYPE = require('../../../common/enum/DISTRIBUTION_OPEN_TYPE');
const FormItem = Form.Item;
const Option = Select.Option;
class ContentAlgorithmFilter extends React.Component<any,any>{
    constructor(props){
        super(props);
        const uri = new URI();
        const query = uri.query(true);
        this.disId = query.disId;
        // static components
        this.AllOption = <Option value={null} key={null}>全部</Option>;
        this.CPOptions = CP_SOURCES.map(this.makeOption);
        this.CPOptions.push(this.AllOption);
        this.ContentTypeOptions = CONTENT_TYPES.map(this.makeOption);
        this.ContentTypeOptions.push(this.AllOption);
        this.OrderOptions = DISTRIBUTION_ORDER.map(this.makeOption);
        this.DisplayStyleOptions = DISPLAY_STYLE.map(this.makeOption);
        this.OpenTypeOptions = OPEN_TYPE.map(this.makeOption);
    }
    AllOption;
    CPOptions;
    ContentTypeOptions;
    OrderOptions;
    DisplayStyleOptions;
    OpenTypeOptions;
    disId:string;
    async componentDidMount(){
        // set default value
        this.props.setValue('selectedAlgorithm', '');
        this.props.setValue('conditions', []);
        this.props.setValue('cpConditions', {});
        this.props.setValue('category', {});
        this.props.setValue('firstCategory', []);
        this.props.setValue('serverAlgorithmInfo', undefined);
        this.props.setValue('serverConditions', undefined);
        this.props.setValue('orderType', undefined);
        this.props.setValue('displayStyle', undefined);
        this.props.setValue('openType', undefined);
        this.props.setValue('disCount', undefined);
        this.props.setValue('page', undefined);
    }
    AlgorithmOptions = ALGORITHM.map(each=>{
        return (
            <Option value={each.value} key={each.value}>{each.name}</Option>
        );
    });
    async fieldChange(keyName, event){
        const value = event.target ? event.target.value : event;
        this.props.setValue(keyName, value);
        if(keyName === 'selectedAlgorithm'){
            // get category
            await distributionLib.getCategory.call(this,value);
            // fresh preview
            await freshList.call(this);
        }
    }
    addCondition(){
        const conditions = handy.copyObj(this.props.conditions);
        conditions.push({
            category: null,
            subCategory: null,
            cpId: null,
            type: null
        });
        this.props.setValue('conditions', conditions);
    }
    deleteCondition(index){
        const conditions = handy.copyObj(this.props.conditions);
        conditions.splice(index, 1)
        this.props.setValue('conditions', conditions);
    }
    conditionChange(index, keyName, value){
        const conditions = handy.copyObj(this.props.conditions);
        conditions[index][keyName] = value;
        if(keyName === 'category'){
            conditions[index].subCategory = null;
        }
        this.props.setValue('conditions', conditions);
    }
    cpConditionChange(keyName, value){
        const cpConditions = handy.copyObj(this.props.cpConditions);
        cpConditions[this.props.selectedAlgorithm][keyName] = value;
        this.props.setValue('cpConditions', cpConditions);
    }
    
    save(){
        if(this.props.selectedAlgorithm === ''){
            this.saveNoAlgorithm();
        }else{
            this.saveOtherAlgorithm();
        }
        distributionLib.freshCache(this.disId);
    }
    async saveOtherAlgorithm(){
        const algorithm = this.props.selectedAlgorithm;
        const cpCondition = this.props.cpConditions[algorithm];
        const cpCategory = this.props.category[algorithm];
        const cpAlgorithm = ALGORITHM.find(each=>each.value === algorithm);
        const selectedCategory = cpCategory.find(each=>each.id === cpCondition.category) || {
            // table field can not be undefined
            name: '',
            id: ''
        };
        const condition = {
            _action: 'set',
            FCATEGORY: selectedCategory.name,
            FCATEGORYID: selectedCategory.id,
            FCPID: cpAlgorithm.cpId || '',
            FTYPE: cpAlgorithm.noContentType ? null : cpCondition.type,
            FDISID: this.disId,
            FALGOVER: algorithm,
            FID: cpCondition.id
        };
        const conditionTable = {
            tableName: 'T_CONTENT_DIS_CONDITION',
            rows: [condition]
        };
        const disTable = {
            tableName: 'T_CONTENT_DIS',
            rows: [{
                FID: this.disId,
                FALGOVER: algorithm
            }]
        };
        const tables = [conditionTable, disTable];
        const res = await ajax.post(API.multiTableSave.url, {tables});
        if(res.code !== 200){
            message.error('保存失败:' + res.message);
            return;
        }
        message.success('保存成功');
        freshList.call(this, true);
    }
    async saveNoAlgorithm(){
        // conditions
        const conditionTable = {
            tableName: 'T_CONTENT_DIS_CONDITION',
            rows: []
        };
        const stateConditions = this.props.conditions;
        for(const serverCondition of this.props.serverConditions){
            if(serverCondition.FALGOVER){
                continue;
            }
            if(!stateConditions.some(each=>each.id === serverCondition.FID)){
                conditionTable.rows.push({
                    _action: 'delete',
                    FID: serverCondition.FID
                });
            }
        }
        for(const condition of this.props.conditions){
            const serverCondition:any = {
                FCATEGORY: condition.category || '',
                FSUB_CATEGORY: condition.subCategory || '',
                FCPID: condition.cpId||'',
                FTYPE: condition.type,
                FDISID: this.props.serverAlgorithmInfo.FID,
                FALGOVER: ''
            };
            if(condition.id){
                serverCondition.FID = condition.id;
                serverCondition._action = 'set';
            }else{
                serverCondition._action = 'new';
            }
            conditionTable.rows.push(serverCondition);
        }
        // distribution
        const disTable = {
            tableName: 'T_CONTENT_DIS',
            rows: []
        };
        disTable.rows.push({
            FID: this.props.serverAlgorithmInfo.FID,
            FALGOVER: '',
            FORDER: this.props.orderType,
            FDISPLAY_STYLE: this.props.displayStyle,
            FOPEN_TYPE: this.props.openType,
            FDIS_COUNT: this.props.disCount,
            FPAGE: this.props.page
        });
        const tables = [conditionTable, disTable];
        const res = await ajax.post(API.multiTableSave.url, {tables});
        if(res.code !== 200){
            message.error('保存失败:' + res.message);
            return;
        }
        message.success('保存成功');
        freshList.call(this, true);
    }
    makeOption(op){
        return <Option key={op.value} value={op.value}>{op.name}</Option>
    }
    FirstCategoryOptions = [];
    NoAlgorithm(){
        const ConditionsFormItem = this.props.conditions.map((each,index)=>{
            // first category
            const firstCategoryOptions = this.props.firstCategory.map(category=><Option value={category} key={category}>{category}</Option>);
            firstCategoryOptions.push(this.AllOption);
            // sub category
            let subCategoryOptions = [];
            if(this.props.category.noAlgorithm && each.category){
                subCategoryOptions = this.props.category.noAlgorithm.filter(category=>{
                    return category.FCATEGORY === each.category;
                }).map(category=>{
                    return <Option value={category.FSUB_CATEGORY} key={category.FSUB_CATEGORY}>{category.FSUB_CATEGORY}</Option>;
                });
                subCategoryOptions.push(this.AllOption);
            };
            return (
                <Form layout="inline" key={index}>
                    <FormItem label="内容CP">
                        <Select value={each.cpId} onChange={this.conditionChange.bind(this, index, 'cpId')}>{this.CPOptions}</Select>
                    </FormItem>
                    <FormItem label="魅族一级分类">
                        <Select value={each.category} onChange={this.conditionChange.bind(this, index, 'category')}>{firstCategoryOptions}</Select>
                    </FormItem>
                    <FormItem label="魅族二级分类">
                        <Select value={each.subCategory} disabled={!each.category} onChange={this.conditionChange.bind(this, index, 'subCategory')}>{subCategoryOptions}</Select>
                    </FormItem>
                    <FormItem label="内容类型">
                        <Select value={each.type} onChange={this.conditionChange.bind(this, index, 'type')}>{this.ContentTypeOptions}</Select>
                    </FormItem>
                    <FormItem>
                        <Button.Group>
                            <Button icon="plus" onClick={this.addCondition.bind(this)}></Button>
                            <Button icon="minus" onClick={this.deleteCondition.bind(this, index)}></Button>
                        </Button.Group>
                    </FormItem>
                </Form>
            )
        });
        const AddNewConditionButton = (
            <Form>
                目前无过滤条件，<a onClick={this.addCondition.bind(this)}>新增一个</a>？
            </Form>
        );
        return (
            <div>
                {this.props.conditions.length ? ConditionsFormItem : AddNewConditionButton}
                <Form layout="inline">
                    <FormItem label="列表样式">
                        <Select value={this.props.displayStyle} onChange={this.fieldChange.bind(this, 'displayStyle')}>{this.DisplayStyleOptions}</Select>
                    </FormItem>
                    <FormItem label="排序方式">
                        <Select value={this.props.orderType} onChange={this.fieldChange.bind(this, 'orderType')}>{this.OrderOptions}</Select>
                    </FormItem>
                    <FormItem label="详情样式">
                        <Select value={this.props.openType} onChange={this.fieldChange.bind(this, 'openType')}>{this.OpenTypeOptions}</Select>
                    </FormItem>
                    <FormItem label="下发数量">
                        <Input value={this.props.disCount} onChange={this.fieldChange.bind(this, 'disCount')}></Input>
                    </FormItem>
                    <FormItem label="是否分页">
                        <Select value={this.props.page}>
                            <Option value={1}>不分页</Option>
                            <Option value={0}>分页</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        );
    }
    OtherAlgorithm(){
        if(this.props.selectedAlgorithm === ''){
            return '';
        }
        const algorithm = this.props.selectedAlgorithm;
        const foundCp = ALGORITHM.find(each=>each.value === algorithm);
        if(!foundCp){
            return '';
        }
        const category = this.props.category[algorithm];
        if(!category){
            return '分类加载中...';
        }
        const CategoryOptions = category.map(each=><Option key={each.id} value={each.id}>{each.name}</Option>);
        // default category is "recommendation"
        // CategoryOptions.push(this.AllOption);
        const cpCondition = this.props.cpConditions[algorithm] || {};
        let ContentTypeOptions;
        if(algorithm === 'baidu_algover'){
            ContentTypeOptions = CONTENT_TYPES.filter(each=>each.value !== 2).map(this.makeOption);
            ContentTypeOptions.push(this.AllOption);
        }else{
            ContentTypeOptions = this.ContentTypeOptions;
        }
        return (
            <div>
                <Form layout="inline">
                    <FormItem label="内容CP">
                        <Select value={foundCp.value}><Option value={foundCp.value}>{foundCp.name}</Option></Select>
                    </FormItem>
                    <FormItem label={foundCp.categoryName}>
                        <Select value={cpCondition.category} onChange={this.cpConditionChange.bind(this, 'category')}>{CategoryOptions}</Select>
                    </FormItem>
                    {foundCp.noContentType !== true && <FormItem label="内容类型">
                        <Select value={cpCondition.type} onChange={this.cpConditionChange.bind(this, 'type')}>{ContentTypeOptions}</Select>
                    </FormItem>}
                </Form>
            </div>
        )
    }
    render(){
        const props = this.props;
        return (
            <div id="content-algorithm-filter">
                <Form layout="inline">
                    <FormItem label="算法">
                        <Select id="select-algorithm" onChange={this.fieldChange.bind(this, 'selectedAlgorithm')} value={props.selectedAlgorithm}>{this.AlgorithmOptions}</Select>
                    </FormItem>
                    <FormItem>
                        <Button.Group>
                            <Button onClick={freshList.bind(this)}>预览</Button>
                            <Button onClick={this.save.bind(this)}>保存</Button>
                        </Button.Group>
                    </FormItem>
                </Form>
                {props.selectedAlgorithm === '' ? this.NoAlgorithm() : this.OtherAlgorithm()}
            </div>
        );
    }
};

const mapStateToProps = function(state){
    const props = {...state.contentAlgorithm};
    props.page = state.table.page;
    props.pageSize = state.table.pageSize;
    return props;
};
const mapDispatchToProps = function(dispatch){
    return {
        setValue: (key, value)=>{dispatch({type: 'contentAlgorithm.setValue', key, value})},
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentAlgorithmFilter);