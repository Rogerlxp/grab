import * as React from 'react';
import {connect} from 'react-redux';
import {
    Input,
    Icon,
    Button,
    Row,
    Col,
    message
} from 'antd';
import store from '../../reducer';
import ajax from '../../lib/ajax';
import API from '../../const/API';
const shortId = require('shortid');
const Search = Input.Search;
class CrawlInput extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state = {
            url: '',
            isLoading: false,
            loadingTime: 0
        }
    }
    setFieldValue(keyName, value){
        store.dispatch({
            type: 'fields.setValue',
            key: keyName,
            value
        });
    }
    stopLoading(intervalIndex){
        clearInterval(intervalIndex);
        this.setState({
            isLoading: false
        });
    }
    crawl = async () => {
        this.setState({
            isLoading: true,
            loadingTime: 60
        });
        const intervalIndex = setInterval(() => {
            if(this.state.isLoading){
                if(this.state.loadingTime){
                    this.setState({
                        loadingTime: (this.state.loadingTime - 1)
                    });
                }else{
                    this.stopLoading(intervalIndex);
                }
            }else{
                this.stopLoading(intervalIndex);
            }
        }, 1000);
        const res = await ajax.post(API.crawlUrl.url, {
            url: this.state.url
        });
        if(res.code === 200){
            // set field value
            const info = res.value;
            this.setFieldValue('author', info.author);
            this.setFieldValue('content', info.content);
            // change _key, so wysiwyg can update content
            const fields = JSON.parse(JSON.stringify(this.props.tableFields));
            const contentField = fields.find(field=>field.keyName === 'content');
            contentField._key = shortId.generate();
            store.dispatch({
                type: 'table.setValue',
                key: 'fields',
                value: fields
            });
            this.setFieldValue('title', info.title);
            this.setFieldValue('contentTitle', info.title);
            this.setFieldValue('cpSource', info.source);
            this.setFieldValue('imgUrls', info.imgMap.map(img=>{
                img.uid = shortId.generate();
                img.name = img.id;
                img.status = 'done';
                img.thumbUrl = img.url;
                return img;
            }));
            this.setFieldValue('keywords', info.keywords.join(','));
            message.success('抓取成功');
        }else{
            message.error(res.message);
        }
        this.setState({
            isLoading: false
        });
    }
    onChange = (event) => {
        this.setState({
            url: event.target.value
        });
    }
    render(){
        const inputProps:any = {};
        inputProps.onPressEnter = this.crawl;
        inputProps.onChange = this.onChange;
        inputProps.style = {marginRight: '8px'};
        const btnProps:any = {};
        btnProps.style = {float: 'right'};
        btnProps.onClick = this.crawl;
        btnProps.loading = this.state.isLoading;
        btnProps.type = 'primary';
        return (
            <div style={{display: 'flex'}}>
                <Input {...inputProps} />
                <Button {...btnProps}>{this.state.isLoading ? ` ${this.state.loadingTime} ` : '抓取'}</Button>
            </div>
        )
    }
};
const mapState = function(state){
    const props = {
        formFields: state.fields,
        tableFields: state.table.fields
    };
    return props;
}
export default connect(mapState)(CrawlInput);