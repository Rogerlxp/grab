import * as React from 'react';
import {connect} from 'react-redux';
import {Upload,
    Icon,
    Modal,
    Button,
    message
} from 'antd';
import handy from '../lib/handy';
import ajax from '../lib/ajax';
import API from '../const/API';
const shortid = require('shortid');
const URI = require('urijs');
class ImageUploader extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state = {
            previewVisible: false,
            loading: false
        };
    };
    handleChange = async (info) => {
        // console.log('info: ,', info);
        const fileList = [];
        const field = this.props.field;
        const keyName = field.keyName;
        for(let i = 0; i < info.fileList.length; i++){
            const file = info.fileList[i];
            if(file.status === 'done'){
                // make file url property is the real store value
                if(file.response){
                    if(file.response.code === 200){
                        file.url = file.response.value;
                    }else{
                        message.error('文件(' + file.name + ')保存失败：' + file.response.message);
                        throw new Error('upload file error: ' + JSON.stringify(file));
                    }
                }else{
                    message.error(`上传文件(${file.name})失败`);
                    throw new Error('can not upload file.');
                }
                if(field.reInvoke){
                    const invokeDef = field.reInvoke;
                    const apiUri = new URI(invokeDef.api);
                    invokeDef.argMap.forEach(map=>{
                        let val = '';
                        if(map.value){
                            val = map.value;
                        }else if(map.source){
                            val = file[map.source];
                        }
                        apiUri.setQuery(map.keyName, val);
                    });
                    const rdUri = new URI(API.serverRequest.url);
                    rdUri.setQuery('url', apiUri.toString());
                    const res = await ajax.get(rdUri);
                    if(res.code === 200){
                        file.url = res.value;
                    }else{
                        message.error('获取文件地址失败，java服务器返回信息：' + res.message);
                        return;
                    }
                }
            }
            fileList.push(Object.assign({}, file));
        }
        await this.props.setFieldsValue(keyName, fileList);
        this.props.setTableValue('isEdited', true);
    };
    handleCancel=()=>{
        this.setState({ previewVisible: false });
    }
    handlePreview=(file)=>{
        // console.log('file preview: ', file);
        let previewImage = file.url || file.thumbUrl;
        if(file.response && file.response.code === 200 && file.response.value){
            previewImage = file.response.value;
        }
        this.setState({
          previewImage,
          previewVisible: true,
        });
    }
    render(){
        const field = this.props.field;
        const keyName = field.keyName;
        const fieldType = field.type;
        const fileList = (this.props.formFields[keyName] || []).map(each=>{
            each.type = 'image';
            return each;
        });
        // console.log('render: ',fileList);
        let uploadButton:JSX.Element;
        if(fileList.length !== (field.quota || 1)){
            if(fieldType === 'file'){
                uploadButton = (
                    <Button><Icon type="upload" /> 上传文件</Button>
                );
            }else{
                uploadButton = (
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">上传</div>
                    </div>
                );
            }
        }
        let uploadType:'text'|'picture-card'|'picture' = 'text';
        let accept = field.accept || '';
        if(['image', 'images'].includes(fieldType)){
            uploadType = 'picture-card';
            accept = 'image/*';
        }
        // console.log('fileList: ', fileList);
        // console.log('listType: ', uploadType);
        return (
            <div className="clearfix image-uploader">
                <Upload
                    accept={accept}
                    action={API.reUploadImage.url}
                    listType={uploadType}
                    fileList={fileList}
                    multiple={false}
                    onPreview={this.handlePreview}
                    // onRemove={this.remove}
                    onChange={this.handleChange}>
                    {uploadButton}
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    {fieldType === 'file' ? this.state.previewImage : <img style={{ width: '100%' }} src={this.state.previewImage} />}
                </Modal>
            </div>
        );
    }
}
// export default ImageUploader;
const mapStateToProps = function(state){
    let props = state.table;
    props.formFields = state.fields;
    return props;
}
const mapDispatchToProps = function(dispatch){
    return {
        setTableValue: (key, value)=>{dispatch({type: 'table.setValue', key, value})},
        setFieldsValue: (key, value)=>{dispatch({type: 'fields.setValue', key, value})},
    }
}
const container:any = connect(mapStateToProps, mapDispatchToProps)(ImageUploader);
export default container;