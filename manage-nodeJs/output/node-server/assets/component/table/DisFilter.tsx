import * as React from 'react';
import {connect} from 'react-redux';
import {
    Button,
    Divider,
    Form,
    Select,
    Collapse,
    Icon,
    Input,
    message
} from 'antd';
import ajax from '../../lib/ajax';
import API from '../../const/API';
import disLib from '../../lib/distribution';
import freshList from '../../action/freshDistributionPreview';
const shortid = require('shortid');
const CP_SOURCES = require('../../../common/enum/CP_SOURCES.js');
const CONTENT_TYPES = require('../../../common/enum/CONTENT_TYPES.js');
const DISTRIBUTION_ORDER = require('../../../common/enum/DISTRIBUTION_ORDER.js');
const DISTRIBUTION_STYLES = require('../../../common/enum/DISTRIBUTION_STYLES.js');
const DISTRIBUTION_CHANNEL = require('../../../common/enum/DISTRIBUTION_CHANNEL.js');
const DISTRIBUTION_OPEN_TYPE = require('../../../common/enum/DISTRIBUTION_OPEN_TYPE.js');
const SOURCES_OPTIONS = require('../../../common/enum/DISTRIBUTION_CP');

class DisFilter extends React.Component<any>{
    constructor(props){
        super(props);
        this.freshList = freshList.bind(this);
    }
    freshList:any;
    async componentDidMount(){
        const firstCategory = await disLib.getFirstCategory();
        // console.log(firstCategory);
        this.props.setDisManage('firstCategory', firstCategory);
    }
    firstCategorySelect = async (condition, value) => {
        // console.log(value);
        // console.log(JSON.stringify(condition));
        let conditions = JSON.parse(JSON.stringify(this.props.conditions));
        for(let item of conditions){
            // console.log(item);
            if(item._key === condition._key){
                if(value){
                    item.FSUB_CATEGORY.options = await disLib.getSubCategory(value);
                }else{
                    item.FSUB_CATEGORY.options = [];
                }
                item.FCATEGORY = value;
                item.FSUB_CATEGORY.value = undefined;
            }
        }
        // console.log('after: ', conditions);
        this.props.setDisManage('conditions', conditions);
    }
    selectSubCategory(condition, value){
        let conditions = JSON.parse(JSON.stringify(this.props.conditions));
        for(let item of conditions){
            if(item._key === condition._key){
                // console.log('got: ', item);
                item.FSUB_CATEGORY.value = value;
            }
        }
        // console.log('after: ', conditions);
        this.props.setDisManage('conditions', conditions);
    }
    selectCondition(condition, keyName, value){
        // console.log(value);
        let conditions = JSON.parse(JSON.stringify(this.props.conditions));
        for(let item of conditions){
            if(item._key === condition._key){
                item[keyName] = value;
            }
        }
        this.props.setDisManage('conditions', conditions);
    }
    addCondition(){
        let conditions = JSON.parse(JSON.stringify(this.props.conditions));
        conditions.push({
            FID: '',
            FCPID: undefined,
            FCATEGORY: undefined,
            FDISID: this.props.disInfo.FID,
            FSUB_CATEGORY: {
                value: undefined,
                options: []
            },
            FTYPE: undefined,
            _action: 'add',
            _key: shortid.generate()
        });
        // console.log(conditions);
        this.props.setDisManage('conditions', conditions);
    }
    deleteCondition(condition){
        let conditions = JSON.parse(JSON.stringify(this.props.conditions));
        conditions = conditions.map(c=>{
            if(c._key === condition._key){
                c._action = 'delete';
            }
            return c;
        });
        this.props.setDisManage('conditions', conditions);
    }
    disInfoChange(keyName, event){
        let value;
        if(event === null){
            value = event;
        }else if(typeof event === 'object'){
            value = event.target.value;
        }else{
            value = event;
        }
        console.log(event);
        console.log(keyName);
        const disInfo = JSON.parse(JSON.stringify(this.props.disInfo));
        disInfo[keyName] = value;
        console.log('dis info: ', disInfo);
        this.props.setDisManage('disInfo', disInfo);
    }
    normalizeDistribution(){
        const disInfo = JSON.parse(JSON.stringify(this.props.disInfo));
        delete disInfo.FCREATE_TIME;
        delete disInfo.FUPDATE_TIME;
        return disInfo;
    }
    async saveDis(){
        const payload = {list: []};
        const conditions = JSON.parse(JSON.stringify(this.props.conditions));
        for(let condition of conditions){
            if(!condition.FCATEGORY){
                condition.FCATEGORY = '';
            }
            // console.log(condition);
            condition.FSUB_CATEGORY = condition.FSUB_CATEGORY.value || '';
            delete condition.FUPDATE_TIME;
            delete condition.FCREATE_TIME;
            delete condition.isNew;
            delete condition._key;
            if(condition.FTYPE !== 0){
                if(!condition.FTYPE){
                    condition.FTYPE = null;
                }
            }
        }
        payload.list.push({
            dbName: 'MEIZU_CONTENTS',
            tables: [{
                tableName: 'T_CONTENT_DIS',
                rows: [this.normalizeDistribution()]
            }, {
                tableName: 'T_CONTENT_DIS_CONDITION',
                rows: conditions
            }]
        });
        // console.log(payload);
        const saveRes = await ajax.post(API.saveDistribution.url, payload);
        if(saveRes.code === 200){
            message.success('保存成功');
        }else{
            message.error(saveRes.message);
        }
        await this.freshList();
    }
    adaptSelectValue(value){
        if([null, ''].includes(value)){
            return undefined;
        }else{
            return value;
        }
    }
    render(){
        // components
        const FormItem = Form.Item;
        const Option = Select.Option;
        const Panel = Collapse.Panel;
        // distribution info
        const disInfo = this.props.disInfo;
        // channel name
        let channelName = '-';
        let foundChannel = DISTRIBUTION_CHANNEL.find(item=>item.value === disInfo.FCHANNEL_ID);
        if(foundChannel){
            channelName = foundChannel.name;
        }
        // conditions
        const conditionSelectWidth = 200;
        const sourcesOptions = SOURCES_OPTIONS.map(item=><Option value={item.value} key={item.value}>{item.name}</Option>);
        sourcesOptions.push(<Option key={shortid.generate()} value={null}>全部</Option>);
        const firstCategoryOpts = this.props.firstCategory.map(item=><Option key={item.value} value={item.value}>{item.name}</Option>);
        const contentTypeOpts = CONTENT_TYPES.map(item=><Option key={item.value} value={item.value}>{item.name}</Option>);
        contentTypeOpts.push(<Option key={shortid.generate()} value={null}>全部</Option>)
        const conditionsEl = this.props.conditions.filter(c=>c._action !== 'delete').map((condition, index, all)=>{
            const subCategoryOpts = condition.FSUB_CATEGORY.options.map(item=><Option key={item.value} value={item.value}>{item.name}</Option>);
            // const isOnly = all.length === 1;
            const isLast = index === (all.length - 1);
            // adapt value type
            condition.FCPID = this.adaptSelectValue(condition.FCPID);
            condition.FCATEGORY = this.adaptSelectValue(condition.FCATEGORY);
            condition.FSUB_CATEGORY.value = this.adaptSelectValue(condition.FSUB_CATEGORY.value);
            condition.FTYPE = this.adaptSelectValue(condition.FTYPE);
            return (
                <Form className="conditions" layout="inline" key={condition._key}>
                    <FormItem label="内容来源">
                        <Select style={{width: conditionSelectWidth}}
                            value={condition.FCPID === undefined ? null : condition.FCPID}
                            onChange={this.selectCondition.bind(this, condition, 'FCPID')}
                            placeholder="请选择">{sourcesOptions}</Select>
                    </FormItem>
                    <FormItem label="一级分类">
                        <Select style={{width: conditionSelectWidth}}
                            onChange={this.firstCategorySelect.bind(this, condition)}
                            value={condition.FCATEGORY}
                            placeholder="请选择">{firstCategoryOpts}</Select>
                    </FormItem>
                    {condition.FCATEGORY && <FormItem label="二级分类">
                        <Select style={{width: conditionSelectWidth}}
                            value={condition.FSUB_CATEGORY.value}
                            onChange={this.selectSubCategory.bind(this, condition)}
                            placeholder="请选择">{subCategoryOpts}</Select>
                    </FormItem>}
                    <FormItem label="内容类型">
                        <Select style={{width: conditionSelectWidth}}
                            onChange={this.selectCondition.bind(this, condition, 'FTYPE')}
                            value={condition.FTYPE === undefined ? null : condition.FTYPE}
                            placeholder="请选择">{contentTypeOpts}</Select>
                    </FormItem>
                    {<FormItem>
                        <Button onClick={this.deleteCondition.bind(this, condition)}
                            shape="circle"
                            icon="minus"></Button>
                    </FormItem>}
                    {isLast === true && <FormItem>
                        <Button onClick={this.addCondition.bind(this)}
                                shape="circle"
                                icon="plus"></Button>
                    </FormItem>}
                </Form>
            );
        });
        if(conditionsEl.length === 0){
            conditionsEl.push(
                <FormItem key={shortid.generate()}>
                    <Button onClick={this.addCondition.bind(this)}
                            shape="circle"
                            icon="plus"></Button>
                </FormItem>);
        }
        // distribution info
        const displayStyleOptions = DISTRIBUTION_STYLES.map(item=><Option value={item.value} key={item.value}>{item.name}</Option>);
        const disOrderOptions = DISTRIBUTION_ORDER.map(item=><Option value={item.value} key={item.value}>{item.name}</Option>);
        const openTypeOptions = DISTRIBUTION_OPEN_TYPE.map(item=><Option value={item.value} key={item.value}>{item.name}</Option>);
        const disInfoSelectWidth = 100;
        // render
        return <div className="dis-filter">
            <div className="block-title"><Icon type="bars" />过滤条件</div>
            {conditionsEl}
            <div className="block-title"><Icon type="bars" />下发配置</div>
            <Form layout="inline">
                <FormItem label="列表样式">
                    <Select  onChange={this.disInfoChange.bind(this, 'FDISPLAY_STYLE')}
                        placeholder="请选择"
                        style={{width: disInfoSelectWidth}}
                        value={disInfo.FDISPLAY_STYLE}>{displayStyleOptions}</Select>
                </FormItem>
                <FormItem label="排序方式">
                    <Select  onChange={this.disInfoChange.bind(this, 'FORDER')}
                        placeholder="请选择"
                        style={{width: disInfoSelectWidth}}
                        value={disInfo.FORDER}>{disOrderOptions}</Select>
                </FormItem>
                <FormItem label="详情样式">
                    <Select  onChange={this.disInfoChange.bind(this, 'FOPEN_TYPE')}
                        placeholder="请选择"
                        style={{width: disInfoSelectWidth}}
                        value={disInfo.FOPEN_TYPE || undefined}>{openTypeOptions}</Select>
                </FormItem>
                <FormItem label="下发数量">
                    <Input onChange={this.disInfoChange.bind(this, 'FDIS_COUNT')} style={{width: disInfoSelectWidth}} placeholder="请填写" value={disInfo.FDIS_COUNT} />
                </FormItem>
                <FormItem label="是否分页">
                    <Select onChange={this.disInfoChange.bind(this, 'FPAGE')}
                        style={{width: disInfoSelectWidth}}
                        placeholder="请选择"
                        value={disInfo.FPAGE}>
                        <Option value={1}>分页</Option>
                        <Option value={0}>不分页</Option>
                    </Select>
                </FormItem>
                <FormItem className="dis-actions">
                    <Button onClick={this.freshList} className="ant-btn-gray">预览</Button>
                    <Button type="primary" onClick={this.saveDis.bind(this)}>保存</Button>
                    <Button type="primary" onClick={disLib.freshCache.bind(this, disInfo.FID)}>发布</Button>
                </FormItem>
            </Form>
        </div>;
    }
}
const mapState = function(state){
    const props = state.disManage;
    props.page = state.table.page;
    props.pageSize = state.table.pageSize;
    return state.disManage;
}
const mapDispatch = function(dispatch){
    return {
        setDisManage(key, value){
            dispatch({type: 'disManage.setValue', key, value});
        },
        dispatch
    }
}
const container:any = connect(mapState, mapDispatch)(DisFilter);
export default container;