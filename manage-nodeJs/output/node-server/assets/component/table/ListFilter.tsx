import * as React from 'react';
import {connect} from 'react-redux';
const FILTERS_DEFINED = require('../../../common/filter/index.js');
import freshTableList from '../../action/freshTableList';
import {Link, withRouter} from 'react-router-dom';
import {
    Input,
    Button,
    Select,
    Form,
    Rate,
    Tooltip,
    DatePicker
} from 'antd';
import buttonActions from '../../action/buttonActions';
import {TIME_FORMAT} from '../../const/MISC';
const Moment = require('moment');
const URI = require('urijs');
const Option = Select.Option;
const FormItem = Form.Item;
class ListFilter extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.freshList = props.freshList;
    }
    freshList:any;
    shouldComponentUpdate(nextProps){
        return !nextProps.isLoading;
    }
    changeField(filter, value){
        // console.log('field: ', filter);
        // console.log('value: ', value);
        let val;
        if(value && value.target){
            val = value.target.value;
        }else{
            val = value;
        }
        const queryFields = JSON.parse(JSON.stringify(this.props.queryFields));
        const foundFilter = queryFields.find(each=>each.keyName === filter.keyName);
        if(foundFilter.type === 'select' && foundFilter.mode === 'multiple'){
            if(foundFilter.value.includes(null)){
                const index = val.indexOf(null);
                val.splice(index, 1);
            }else if(val.includes(null)){
                val = [null];
            }
        }
        foundFilter.value = val;
        this.props.setTableValue('queryFields', queryFields);
    }
    search=()=>{
        if(this.freshList){
            this.freshList.call(this);
            return;
        }
        const url = new URI();
        let filterQuery = {};
        this.props.queryFields.forEach(filter=>{
            filterQuery[filter.keyName] = filter.value;
        });
        url.setSearch('filter', encodeURIComponent(JSON.stringify(filterQuery)));
        // set page
        url.setSearch('page', 1);
        this.props.dispatch({
            type: 'table.setValue',
            value: {
                page: 1
            }
        });
        let submitUrl = url.path() + url.search();
        this.props.history.push(submitUrl);
    }
    render(){
        const queryFields = this.props.queryFields;
        // console.log('query fields: ', queryFields);
        if(!queryFields || queryFields.length === 0){
            // console.log('no filter field defined.');
            return '';
        }
        // if(!this.props.tableName || !this.props.dbName){
        //     // console.log('no table name or db name, no filter form shown.');
        //     return '';
        // }
        // console.log('filter list: ', queryFields);
        const fields = this.props.fields;
        const list = queryFields
            .filter(each=>{
                if(each.type === 'button'){
                    return false;
                }
                if(each.isShow === false){
                    return false;
                }
                if(each.isShow){
                    if(each.isShow.keyName){
                        const foundFilter = queryFields.find(e=>e.keyName === each.isShow.keyName);
                        if(foundFilter){
                            return foundFilter.value === each.isShow.keyValue
                        }
                    }
                }
                return true;
            })
            .map(filter=>{
                if(filter.status === 'hide'){
                    return '';
                }
                let field = fields.find(each=>each.keyName === filter.keyName);
                let value = filter.value;
                let type = filter.type || (field && field.type) || 'text';
                let el;
                const elProps:any = {};
                elProps.value = filter.value;
                if(filter.placeholder){
                    elProps.placeholder = filter.placeholder;
                }
                if(type === 'text'){
                    elProps.onPressEnter = this.search;
                    elProps.onChange = this.changeField.bind(this, filter);
                    el = <Input {...elProps} />;
                }else if(type === 'select'){
                    // console.log('filter: ', filter);
                    // console.log('field: ', field);
                    // console.log('select value: ', value);
                    let options = [];
                    if(filter && filter.options){
                        options = filter.options;
                    }else if(field && field.options){
                        options = field.options;
                    }else{
                        console.log(filter);
                        throw new Error('Can not find options with select type field.');
                    }
                    // console.log('options: ', options);
                    let children = options.map(option=><Option key={option.value} value={option.value}>{option.name}</Option>);
                    children.unshift(<Option key="all" value={null}>全部</Option>);
                    const val = value === undefined ? null : value;
                    elProps.value = val;
                    if(filter.mode){
                        elProps.mode = filter.mode;
                        if(filter.mode === 'multiple'){
                            if(!val){
                                elProps.value = [];
                            }else if(Array.isArray(val) === false){
                                elProps.value = [val];
                            }
                        }
                    }
                    elProps.onChange = this.changeField.bind(this, filter);
                    elProps.style = {minWidth: '165px'};
                    el = <Select {...elProps}>{children}</Select>;
                }else if(type === 'rate'){
                    const starts = [{
                            value: 0, name: '零星'
                        },{
                            value: 1, name: '一星'
                        },{
                            value: 2, name: '二星'
                        },{
                            value: 3, name: '三星'
                        },{
                            value: 4, name: '四星'
                        },{
                            value: 5, name: '五星'
                        }];
                    let children = starts.map(option=><Option key={option.value} value={option.value}>{option.name}</Option>);
                    children.unshift(<Option key="all" value={null}>全部</Option>);
                    const val = value === undefined ? null : value;
                    el = <Select value={val}
                            style={{ width: '200px' }}
                            onChange={this.changeField.bind(this, filter)}>{children}</Select>;
                }else if(type === 'month-select'){
                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const options = [];
                    const duration = filter.duration;
                    const min = duration.min + '';
                    if(duration.end < 0){
                        throw new Error('duration-end property must be bigger than zero');
                    }
                    if(duration.start > 0){
                        throw new Error('duration-start property must be smaller than zero');
                    }
                    for(let i = 0; i < duration.end; i++){
                        const eachTime = new Date();
                        eachTime.setMonth(currentMonth + i);
                        const year = eachTime.getFullYear() + '';
                        const month = eachTime.getMonth() + 1;
                        const timeStr = year + (month < 10 ? '0' + month : month);
                        options.unshift(<Option key={timeStr} value={timeStr}>{timeStr}</Option>);
                    }
                    for(let i = 0; i > duration.start; i--){
                        const eachTime = new Date();
                        eachTime.setMonth(currentMonth + i);
                        const year = eachTime.getFullYear() + '';
                        const month = eachTime.getMonth() + 1;
                        const timeStr = year + (month < 10 ? '0' + month : month);
                        options.push(<Option key={timeStr} value={timeStr}>{timeStr}</Option>);
                        if(timeStr === min){
                            break;
                        }
                    }
                    options.push(<Option key="all" value={null}>全部</Option>);
                    el = <Select value={value}
                    style={{ width: '200px' }}
                    onChange={this.changeField.bind(this, filter)}>{options}</Select>;
                }else if(type === 'dateRange'){
                    const format = filter.format || TIME_FORMAT;
                    filter.value = filter.value || [];
                    const value = filter.value.map((val) => {
                        // console.log(val);
                        return new Moment(val, format);
                    });
                    // const isShowTime = filter.isShowTime === undefined ? true : filter.isShowTime;
                    el = <DatePicker.RangePicker showTime={false} value={value} onChange={this.changeField.bind(this, filter)} />
                }else if(type === 'date'){
                    const format = filter.format || TIME_FORMAT;
                    if(filter.value){
                        filter.value = new Moment(filter.value, format);
                    }
                    const pickerProps:any = {};
                    pickerProps.onChange = this.changeField.bind(this, filter);
                    pickerProps.value = filter.value;
                    if(filter.placeholder){
                        pickerProps.placeholder = filter.placeholder;
                    }
                    el = <DatePicker {...pickerProps} />;
                }
                if(filter.tooltip){
                    el = <Tooltip title={filter.tooltip}>{el}</Tooltip>
                }
                return (
                    <FormItem label={filter.name} key={filter.keyName}>
                        {el}
                    </FormItem>
                );
        });
        if(list.length === 0){
            return '';
        }
        let buttons = [];
        buttons.push({
            name: '查询',
            action: this.search,
            type: 'button',
            icon: 'search'
        });
        if(this.props.isAbleAddItem){
            buttons.push({
                name: '新建',
                actionName: 'toggleContentEditModal',
                type: 'button',
                icon: 'file-add'
            });
        }
        const extraButton = queryFields.filter(each=>each.type === 'button');
        buttons = buttons.concat(extraButton);
        const buttonsEl = buttons.filter(button=>{
            if(button.isShow === undefined){
                return true;
            }
            let isShow = true;
            if(typeof button.isShow === 'function'){
                isShow = button.isShow.bind(this)();
            }else{
                isShow = !!button.isShow;
            }
            return isShow;
        }).map(button=>{
            const elProps:any = {};
            let name = button.name;
            if(button.icon){
                elProps.icon = button.icon;
            }
            let action = button.action;
            if(button.actionName){
                const foundAction = buttonActions.find(eachAction=>eachAction.name === button.actionName);
                if(foundAction){
                    action = foundAction.action;
                }
            }
            if(action){
                const args = {};
                if(button.args){
                    Object.keys(button.args).forEach(key=>{
                        args[key] = button.args[key];
                    });
                }
                elProps.onClick = action.bind(this, args);
            }
            if(button.link){
                const url = new URI(button.link.href);
                if(button.link.args){
                    Object.keys(button.link.args).forEach(key=>{
                        const fieldName = button.link.args[key];
                        const value = this.props.formFields[fieldName];
                        url.setQuery(key, value);
                    });
                }
                name = <a href={url.toString()}>{name}</a>
            }
            // button must have one action at least
            if(!action && !button.link){
                console.error('Can not find this button action: ' + name);
                return '';
            }
            if(typeof name === 'string'){
                elProps.key = name;
            }else{
                elProps.key = button.keyName;
            }
            return <Button {...elProps}>{name}</Button>;
        });
        return (
            <Form layout="inline" className="list-filter">
                {list}
                <FormItem>
                    <Button.Group>
                        {buttonsEl}
                    </Button.Group>
                </FormItem>
            </Form>
        )
    }
}
const mapStateToProps = function(state){
    let props:any = state.table;
    props.formFields = state.fields;
    return props;
}
const mapDispatchToProps = function(dispatch){
    return {
        setTableValue: (key, value)=>dispatch({type: 'table.setValue', key, value}),
        setFieldsValue: (key, value)=>{dispatch({type: 'fields.setValue', key, value})},
        dispatch
    }
}
const component:any = connect(mapStateToProps, mapDispatchToProps)(ListFilter);
const cpt:any = withRouter(component);
export default cpt;