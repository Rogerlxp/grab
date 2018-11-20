import * as React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import ajax from '../../lib/ajax';
import handy from '../../lib/handy';
import API from '../../const/API';
import {
    Form,
    message,
    Modal,
    Input,
    Select,
    DatePicker,
    Rate,
    Upload,
    Icon,
    Button
} from 'antd';
import cache from '../../lib/cache';
import FileUploader from '../../widget/FileUploader';
import freshTableList from '../../action/freshTableList';
import BraftEditor, { EditorState } from 'braft-editor';
import CrawlInput from '../form/CrawlInput';
import buttonActions from '../../action/buttonActions';
import miscellaneousActions from '../../action/miscellaneous';
import submitForm from '../../action/submitForm';
const shortId = require('shortid');
const URI = require('urijs');
const Moment = require('moment');
const SYSTEM = require('../../../common/SYSTEM.js');
const defaultPNG = require('../../img/default.jpg');
const URL_DEF = require('../../../common/URL.js');
const urlPrefix = '/' + SYSTEM.urlVersion.value;
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const Option = Select.Option;
interface STATE {
    confirmLoading: boolean
}
class EditFormModal extends React.Component<any, STATE>{
    constructor(props: any) {
        super(props);
        this.state = {
            confirmLoading: false
        };
    }
    freshList: any = this.props.freshList || freshTableList.bind(this);
    toggleModal() {
        if (this.state.confirmLoading) {
            message.info('正在上传数据，请稍候...');
            return;
        }
        this.props.dispatch({
            type: 'modal.toggle',
            modalName: 'contentEditModal'
        });
    }
    async fieldChange(field, event) {
        // console.log('event: ', event);
        // console.log('field: ', field);
        if(!this.props.isEdited){
            this.props.dispatch({
                type: 'table.setValue',
                value: {
                    isEdited: true
                }
            });
        }
        let val = event;
        const keyName = field.keyName;
        if (!keyName) {
            return;
        }
        if (event) {
            if (event.target && event.target.value !== undefined) {
                val = event.target.value;
            }
        }
        if (field.type === 'wysiwyg') {
            // console.log(val);
            // console.log(val.toHTML());
            this.props.setFieldsValue(keyName, val);
        } else if (val instanceof Moment) {
            // 2018-04-22 00:00:00
            val = val.format(TIME_FORMAT);
        } else if (val && val.fileList) {
            val = {};
            val.fileList = event.fileList.map(file => {
                const each: any = {};
                each.name = file.name;
                each.uid = shortId.generate();
                each.status = file.status;
                each.percent = file.percent;
                each.type = file.type;
                each.size = file.size;
                if (file.response) {
                    each.url = file.response.value;
                }
                return each;
            });
        }
        // if some field options has filter with this value, set that field value to empty
        for(const each of this.props.fields){
            if(each.optionFilter){
                if(each.optionFilter === keyName){
                    this.props.setFieldsValue(each.keyName, undefined);
                    break;
                }
            }
        }
        this.props.setFieldsValue(keyName, val);
    }
    async validate() {
        const primaryField = this.props.fields.find(field => field.isPrimaryKey === true);
        const primaryValue = this.props.formFields[primaryField.keyName];
        for (const field of this.props.fields) {
            let value = this.props.formFields[field.keyName];
            const valueType = typeof value;
            // console.log('name: ', field.name);
            // console.log('value: ', value);
            if (field.uneditable) {
                continue;
            }
            if (field.isRequired) {
                if (['', [], null, undefined].includes(value)) {
                    message.error(field.name + ' 不能为空');
                    return false;
                }
                if (['file', 'image', 'images'].includes(field.type)) {
                    if (!value || value.length === 0) {
                        console.log('upload files: ', value);
                        message.error(field.name + ' 至少要上传一个文件');
                        return false;
                    }
                }
            }
            if (field.valueType === 'number' && handy.isEmpty(value) === false) {
                value = +value;
                if (isNaN(value)) {
                    message.error(field.name + ' 为数字类型');
                    return false;
                }
            } else if (valueType === 'string') {
                value = value.trim();
            }
            if (field.isUnique) {
                const keyName = field.keyName;
                const keyValue = value;
                const res = await ajax.get(API.getByKeyName.url, {
                    dbName: this.props.dbName,
                    tableName: this.props.tableName,
                    keyName,
                    keyValue
                });
                if (res.value && res.value.length) {
                    const duplicate = res.value.filter(each => each[primaryField.keyName] !== primaryValue);
                    if (duplicate.length) {
                        message.error(field.name + ' 必须唯一');
                        return false;
                    }
                    console.log(duplicate);
                }
            }
        }
        return true;
    }
    async submit() {
        // execute function before submit
        const primaryField = this.props.fields.find(each => each.isPrimaryKey);
        if (primaryField.beforeSubmit) {
            const actionDef = miscellaneousActions.find(each => each.name === primaryField.beforeSubmit);
            if (actionDef) {
                await actionDef.action.call(this);
            }
        }
        // submit
        submitForm.call(this);
    }
    render() {
        const fields = this.props.fields;
        const primaryField = fields.find(field => field.isPrimaryKey);
        // console.log(fields);
        // editing mean editing individual row, not adding a new row
        const isEditing = this.props.contentEditModal.options.isEditing; // this value can not be empty
        // console.log('is editing: ', isEditing);
        const editingContent = this.props.formFields;
        let showFields = fields.filter(each => {
            // not show
            if (['update-time',
                'create-time',
                'dropdown-button',
                'button'
            ].includes(each.type)) {
                return false;
            }
            // not show
            if (isEditing) {
                if (each.notShowWhenUpdate) {
                    return false;
                }
            } else {
                if (each.notShowWhenNew) {
                    return false;
                }
            }
            if (each.uneditable === true) {
                return false;
            }
            if (isEditing) {
                if (each.hideWhenEdit) {
                    return false;
                }
            } else {
                if (each.isAutoGen) {
                    return false;
                }
            }
            if (each.isShow) {
                if(typeof each.isShow === 'boolean'){
                    return each.isShow;
                }
                const val = this.props.formFields[each.isShow.keyName];
                // console.log('is show: ', val);
                // console.log('key : ' + each.isShow.keyName);
                if (each.isShow.value === val) {
                    return true;
                } else if (each.isShow.value === 'empty') {
                    return !val;
                } else {
                    return false;
                }
            }
            return true;
        });
        showFields = showFields.sort((a, b) => {
            if (b.formOrder === undefined) {
                return -1;
            }
            if (a.formOrder === undefined) {
                return 1;
            }
            return a.formOrder - b.formOrder;
        });
        // console.log('show fields: ', JSON.stringify(showFields));

        const formFields = showFields.map((field, index) => {
            // don't puluted 
            field = JSON.parse(JSON.stringify(field));
            const formItemProps: any = {};
            const keyName = field.keyName;
            let value = editingContent[keyName];
            // value = editingContent[keyName];
            let el;
            let elProps: any = {};
            if (field.readonly || (isEditing && field.readonlyWhenEdit)) {
                elProps.disabled = true;
            }
            field.placeholder && (elProps.placeholder = field.placeholder);
            if (field.type === 'textarea') {
                const { TextArea } = Input;
                el = <TextArea {...elProps} row={4} value={value} onChange={this.fieldChange.bind(this, field)} />;
            } else if (field.type === 'select') {
                if(field.optionFilter){
                    // console.log('options: ' + JSON.stringify(field.options));
                    const OFKeyName = field.optionFilter;
                    const OFValue = editingContent[OFKeyName];
                    // console.log(OFKeyName);
                    // console.log(OFValue);
                    if(OFValue === undefined){
                        field.options = [];
                    }else{
                        field.options = field.options.filter(eachOption=>{
                            // console.log('each option: ',eachOption);
                            return eachOption.row[OFKeyName] === OFValue;
                        });
                        // console.log(field.options);
                    }
                }
                if (field.valueType === 'bit') {
                    if(Array.isArray(value) === false){
                        value = handy.transferIntToBitIndex(value);
                    }
                }
                if (field.mode === 'multiple') {
                    elProps.mode = 'multiple';
                } else {
                    const foundOption = field.options.find(option => option.value === value);
                    if (!foundOption) {
                        value = undefined;
                    }
                }
                let options = field.options.filter(option => {
                    if (field.mode === 'multiple') {
                        if (value.includes(option.value)) {
                            return true;
                        }
                    }
                    if (option.value === value) {
                        return true;
                    }
                    return !option.hideWhenEdit
                }).map(option => <Option key={option.value} value={option.value}>{option.name}</Option>);
                !elProps.placeholder && (elProps.placeholder = '请选择');
                el = <Select {...elProps} onChange={this.fieldChange.bind(this, field)} value={value}>{options}</Select>;
            } else if (['image', 'images', 'file'].includes(field.type)) {
                // console.log('image value: ', value);
                if (field.readonly === true) {
                    const imgProp: any = {
                        style: { width: 100, height: 100 }
                    };
                    if (Array.isArray(value) && value.length) {
                        imgProp.src = value[0].url;
                    } else {
                        imgProp.src = defaultPNG;
                    }
                    el = <img {...imgProp} />;
                } else {
                    el = <FileUploader field={field} value={value} />
                }
            } else if (field.type === 'wysiwyg') {
                const beProps = {
                    onChange: this.fieldChange.bind(this, field),
                    height: 300,
                    value: value,
                    media: {
                        allowPasteImage: true,
                        image: true
                    },
                };
                el = <BraftEditor {...beProps} {...elProps} />
            } else if (field.type === 'field-button') {
                if (field.inputName === 'CrawlInput') {
                    el = <CrawlInput />
                } else {
                    throw new Error('Have not implement this input type: ' + field.type);
                }
            } else if (field.type === 'date') {
                if (value) {
                    if (field.timeType === 'unix-time') {
                        value = new Moment(value);
                    } else {
                        value = new Moment(value, TIME_FORMAT);
                    }
                }
                const timeProp: any = {};
                timeProp.showTime = true;
                timeProp.format = TIME_FORMAT;
                timeProp.placeholder = '点击选择时间';
                timeProp.onChange = this.fieldChange.bind(this, field);
                timeProp.style = { width: 280 };
                timeProp.value = value;
                if (field.readonly === true) {
                    timeProp.disabled = true;
                }
                el = <DatePicker {...timeProp}></DatePicker>;
            } else if (field.type === 'rate') {
                const rateProps: any = {};
                if (field.allowHalf) {
                    rateProps.allowHalf = true;
                }
                rateProps.value = value;
                rateProps.onChange = this.fieldChange.bind(this, field);
                el = <Rate {...rateProps}></Rate>;
            } else {
                // default behavior
                el = <Input onChange={this.fieldChange.bind(this, field)} {...elProps} value={value} />;
            }
            formItemProps.label = field.name;
            formItemProps.key = field._key || keyName;
            // it is ugly
            // if(field.isRequired){
            //     formItemProps.required = true;
            // }
            let extraButtons = '';
            if (Array.isArray(field.buttons)) {
                extraButtons = field.buttons.map(buttonDef => {
                    const buttonProp: any = {
                        key: buttonDef.actionName
                    };
                    // console.log('button def: ', buttonDef);
                    const actionDef = buttonActions.find(each => each.name === buttonDef.actionName);
                    // console.log('actionDef: ', actionDef);
                    if (actionDef) {
                        buttonProp.onClick = actionDef.action.bind(this, field);
                    }
                    if (buttonDef.isLoading) {
                        buttonProp.loading = true;
                        buttonProp.disabled = true;
                    }
                    const name = buttonDef.tempName || buttonDef.name;
                    if (!name) {
                        buttonProp.icon = buttonDef.icon;
                        return <Button {...buttonProp} />
                    }
                    return <Button {...buttonProp}>{name}</Button>
                });
            }
            return (
                <FormItem {...formItemProps}>
                    {el}{extraButtons}
                </FormItem>
            );
        });
        const contentEditModal = this.props.contentEditModal;
        const editModalWidth = this.props.editModalWidth || 720;
        // console.log('is open: ', contentEditModal.isOpen);
        // console.log('width: ', editModalWidth);
        let footerButtons: any = [{
            name: '保存',
            action: this.submit.bind(this, isEditing),
            isLoading: this.state.confirmLoading,
            order: 1,
            disabledIfNotEdited: true
        }, {
            name: '取消',
            action: this.toggleModal.bind(this),
            order: 2
        }];
        if (primaryField && primaryField.extraEditButtons) {
            footerButtons = footerButtons.concat(primaryField.extraEditButtons);
        }
        footerButtons.sort((a, b) => {
            if (a.order === undefined) {
                a.order = 0;
            }
            if (b.order === undefined) {
                b.order = 0;
            }
            return a.order - b.order;
        });
        const footer = footerButtons.map(def => {
            const props: any = {};
            if (def.action) {
                props.onClick = def.action;
            } else {
                const actionDef = buttonActions.find(each => each.name === def.actionName);
                props.onClick = actionDef.action.bind(this);
            }
            if (def.isLoading) {
                props.loading = true;
            }
            props.key = def.name;
            if (def.disabledIfNotEdited) {
                props.disabled = !this.props.isEdited;
            }
            return <Button {...props}>{def.name}</Button>
        });
        return (
            <Modal title={(contentEditModal && contentEditModal.options && contentEditModal.options.modalTitle) || '-'}
                className="edit-form-modal"
                width={editModalWidth}
                visible={contentEditModal && contentEditModal.isOpen}
                maskClosable={false}
                footer={footer}
                onCancel={this.toggleModal.bind(this)}
                confirmLoading={this.state.confirmLoading}>
                <Form layout="vertical">{formFields}</Form>
            </Modal>
        )
    }
}
const mapStateToProps = function (state) {
    let props: any = { ...state.table };
    props.contentEditModal = state.modal.contentEditModal;
    props.formFields = state.fields;
    return props;
};
const mapDispatchToProps = function (dispatch) {
    return {
        setTableValue: (key, value) => { dispatch({ type: 'table.setValue', key, value }) },
        setFieldsValue: (key, value) => { dispatch({ type: 'fields.setValue', key, value }) },
        dispatch
    }
};
const container: any = connect(mapStateToProps, mapDispatchToProps)(EditFormModal);
export default container;