import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    message,
    Dropdown,
    Menu,
} from 'antd';
import store from '../../reducer';
import handy from '../../lib/handy';
import buttonActions from '../../action/buttonActions';
import VideoInputModal from '../modal/VideoInput';
import cleanFields from '../../lib/cleanFields';
import pageLib from '../../lib/page';
const Moment = require('moment');
const URI = require('urijs');
const Option = Select.Option;
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
class QueryFilter extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.freshList = this.props.freshList;
    }
    freshList;
    changeField = (keyName, value) => {
        // console.log('value: ', value);
        const fields = JSON.parse(JSON.stringify(this.props.queryFields));
        // console.log(fields);
        const foundField = fields.find(each => each.keyName === keyName);
        let val;
        if (value && value.target) {
            val = value.target.value;
        } else if (foundField.type === 'dateRange') {
            const format = foundField.format || TIME_FORMAT;
            val = value.map(moment => {
                return moment.format(format);
            });
        } else {
            if (Array.isArray(value)) {
                if (value.includes(null) && Array.isArray(foundField.value) && foundField.value.includes(null) === false) {
                    val = [null];
                } else if (value.length === 0) {
                    val = [null];
                } else {
                    val = value.filter(v => v !== null);
                }
            } else {
                val = value;
            }
        }
        foundField.value = val;
        store.dispatch({
            type: 'table.setValue',
            key: 'queryFields',
            value: fields
        });
    }
    addItem = () => {
        const editingFields = this.props.editingFields;
        if(editingFields.id){
            cleanFields.call(this, true);
        }else{
            cleanFields.call(this, false);
        }
        store.dispatch({
            type: 'modal.toggle',
            modalName: 'contentEditModal',
            options: {
                modalTitle: '新建',
                isEditing: false
            }
        });
    }
    search = async () => {
        const uri = new URI();
        const query = uri.query(true);
        if(this.props.queryType === 'redux'){
            await store.dispatch({
                type: 'table.setValue',
                key: 'page',
                value: 1
            });
            return this.freshList();
        }
        for (const field of this.props.queryFields) {
            if (field.isShow && field.isShow.keyName) {
                const foundField = this.props.queryFields.find(each => each.keyName === field.isShow.keyName);
                if (!foundField) {
                    throw new Error('You write a wrong field name: ' + field.isShow.keyName);
                }
                if (foundField.value === field.isShow.value) {
                    if (field.isShow.isRequired) {
                        if (field.keyNames) {
                            if (Array.isArray(field.value)) {
                                for (let i = 0; i < field.keyNames.length; i++) {
                                    if (!field.value[i]) {
                                        message.error(`已填“${foundField.name}”，但没填写“${field.name}”`);
                                        return;
                                    }
                                };
                            } else {
                                message.error(`已填“${foundField.name}”，但没填写“${field.name}”`);
                                return;
                            }
                        } else {
                            if (!field.value) {
                                message.error(`已填“${foundField.name}”，但没填写“${field.name}”`);
                                return;
                            }
                        }
                    }
                } else {
                    let keys = [];
                    if (Array.isArray(field.keyNames)) {
                        keys = field.keyNames;
                    } else {
                        keys.push(field.keyName);
                    }
                    keys.forEach(key => {
                        uri.removeQuery(key);
                    });
                    continue;
                }
            }
            let keys = [];
            let values = [];
            if (Array.isArray(field.keyNames)) {
                keys = field.keyNames;
                values = field.value;
            } else {
                keys.push(field.keyName);
                values.push(field.value);
            }
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const val = values[i];
                if (Array.isArray(val)) {
                    if (val.length) {
                        if (val.includes(null)) {
                            uri.removeQuery(key);
                        } else {
                            uri.setQuery(key, val.join(','));
                        }
                    } else {
                        uri.removeQuery(key);
                    }
                } else if (['', null, undefined].includes(val)) {
                    uri.removeQuery(key);
                } else if (val !== null) {
                    if (['date', 'dateRange'].includes(field.type)) {
                        uri.setQuery(key, val);
                    } else {
                        uri.setQuery(key, val);
                    }
                }
            }
        }
        const url = uri.pathname() + '?' + uri.query();
        this.props.history.push(url);
    }

    menuClick = (item) => {
        const keyName = item.key;
        const field = this.props.queryFields.find(field => field.keyName === keyName);
        if (field) {
            const actionName = field.actionName;
            const actionDef = buttonActions.find(action => action.name === actionName);
            if (actionDef) {
                actionDef.action.call(this, item.domEvent);
            }
        }
    }
    render() {
        if(pageLib.isSwitching){
            return '';
        }
        const formItems = this.props.queryFields.map(each => {
            if (each.isShow === false) {
                return;
            }
            // fields is below types would not show
            if (['button', 'buttons'].includes(each.type)) {
                return;
            }
            if (each.isShow) {
                if (typeof each.isShow === 'object') {
                    const field = this.props.queryFields.find(queryField => queryField.keyName === each.isShow.keyName);
                    // hide if there is no such field.
                    if (!field) {
                        return;
                    }
                    // hide if field value is empty
                    if (!field.value) {
                        return;
                    }
                    if (Array.isArray(field.value)) {
                        if (field.value.includes(each.isShow.value) === false) {
                            return;
                        }
                    } else if (field.value !== each.isShow.value) {
                        return;
                    }
                } else if (typeof each.isShow === 'function') {
                    if (!each.isShow()) {
                        return;
                    }
                }
            }
            const itemProps = {
                label: each.name,
                key: each.keyName,
            };
            let el;
            const elProps: any = {};
            if (each.type === 'select') {
                const selectProps: any = {};
                const options = Array.isArray(each.options) ? each.options.map(option => {
                    return <Option value={option.value} key={option.value}>{option.name}</Option>
                }) : [];
                options.unshift(<Option key="all" value={null}>全部</Option>);
                if(each.mode === 'multiple' && !each.value){
                    selectProps.value = [];
                }else{
                    selectProps.value = each.value;
                }
                selectProps.onChange = this.changeField.bind(this, each.keyName);
                selectProps.style = { width: '100%', minWidth: 165 };
                if (each.mode) {
                    selectProps.mode = each.mode;
                }
                el = <Select {...selectProps}>{options}</Select>
            } else if (each.type === 'dateSelect') {
                console.error('not implement date picker yet.')
                el = <DatePicker onChange={this.changeField.bind(this, each.keyName)} />
            } else if (each.type === 'dateRange') {
                const format = each.format || TIME_FORMAT;
                each.value = each.value || [];
                const value = each.value.map((val) => {
                    // console.log(val);
                    return new Moment(val, format);
                });
                const isShowTime = each.isShowTime === undefined ? true : each.isShowTime;
                el = <DatePicker.RangePicker showTime={isShowTime} value={value} onChange={this.changeField.bind(this, each.keyName)} />
            } else {
                let val = each.value;
                el = <Input value={val} onChange={this.changeField.bind(this, each.keyName)} onPressEnter={this.search} />
            }
            return <Form.Item {...itemProps}>
                {el}
            </Form.Item>
        }).filter(each => !!each);
        const addItemOverlayButtons = this.props.queryFields.filter(field => field.type === 'add-item-overlay');
        let addItemButton = <Button onClick={this.addItem}>新建文章</Button>;
        if (addItemOverlayButtons.length) {
            const overlayButtons = addItemOverlayButtons.map(button => <Menu.Item key={button.keyName}>{button.name}</Menu.Item>);
            const overlay = <Menu onClick={this.menuClick}>{overlayButtons}</Menu>
            addItemButton = <Dropdown.Button trigger={['click']} overlay={overlay} onClick={this.addItem}>
                新建
            </Dropdown.Button>
        }
        const extraButtons = this.props.queryFields.filter(field => field.type === 'button').map(field => {
            const btnProps: any = {
                key: field.keyName
            };
            if(field.actionName){
                const actionDef = buttonActions.find(def => def.name === field.actionName);
                if (actionDef) {
                    btnProps.onClick = actionDef.action;
                }
            }
            if(field.link){
                btnProps.onClick = ()=>{
                    this.props.history.push(field.link.href);
                };
            }
            return <Button {...btnProps}>{field.name}</Button>
        });

        return (
            <div className="query-filter">
                <Form layout="inline">
                    {formItems}
                    <Form.Item>
                        <Button.Group>
                            <Button onClick={this.search}>查询</Button>
                            {addItemButton}
                            {extraButtons && extraButtons}
                        </Button.Group>
                    </Form.Item>
                </Form>
                <VideoInputModal />
            </div>

        );
    }
}
const mapState = function (state) {
    const props = state.table;
    props.editingFields = state.fields;
    return props;
}
const container: any = connect(mapState)(QueryFilter);
const cpt:any = withRouter(container);
export default cpt;