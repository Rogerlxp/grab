import * as React from 'react';
import Component from '../lib/Component';
import ajax from '../lib/ajax';
import SITE_INFO from '../const/SITE_INFO';
import API from '../const/API';
import '../sass/page/BaiduContentInput';
import {
    Form,
    Input,
    Select,
    DatePicker,
    message,
    Table,
    Button
} from 'antd';
import handy from '../lib/handy';
const URI = require('urijs');
const Moment = require('moment');
const CP_SOURCES = require('../../common/enum/CP_SOURCES');
class BaiduContentInput extends Component{
    constructor(props){
        super(props);
        document.title = '百度搜索入库' + SITE_INFO.tabNameDivider + SITE_INFO.name;
        this.state = {
            keyword: '',
            contentType: null,
            timeRange: [],
            categoryList: [],
            category: null,
            list: [],
            count: 0,
            lastId: undefined,
            isLoading: false,
            pagination: {
                pageSize: 10,
                current: 0
            }
        };
        this.getCategory();
        // make a start and a end time Moment.
        this.dayStartTime = handy.makeDayStartTime();
        this.dayEndTime = handy.makeDayEndTime();
    }
    dayStartTime;
    dayEndTime;
    columns = [{
        title: 'CP文章ID',
        dataIndex: 'cpEntityId'
    },{
        title: '标题',
        dataIndex: 'title',
        render(data, row){
            return <a href={row.h5Url} target="blank" className="title-link">{data}</a>
        }
    },{
        title: '作者',
        dataIndex: 'author'
    },{
        title: '分类',
        dataIndex: 'category'
    },{
        title: '内容CP',
        dataIndex: 'cpName'
    },{
        title: '内容类型',
        dataIndex: 'contentTypeName'
    }, {
        title: '发布时间',
        dataIndex: 'publishTime',
        render(data){
            const time = new Moment(data);
            return time.format('YYYY-MM-DD HH:mm:ss');
        }
    }];
    fieldChange(keyName, event){
        let value;
        if(event){
            value = event.target ? event.target.value : event;
        }else{
            value = event;
        }
        this.setState({
            [keyName]: value
        });
    }
    async getCategory(){
        const uri = new URI(SITE_INFO.domain + '/service/biz/contents/category/baidu');
        const res = await ajax.get(API.serverRequest.url, {url: uri.toString()});
        if(res.code !== 200){
            message.error('获取分类列表失败：' + res.message);
            return;
        }
        const value = res.value;
        if(!Array.isArray(value)){
            message.error('返回的分类列表不是数组类型：' + typeof value);
            return;
        }
        this.setState({categoryList: value});
    }
    startLoading(){
        this.setState({
            isLoading: true,
        });
    }
    stopLoading(){
        this.setState({
            isLoading: false
        });
    }
    onTableChange(pagination, filters, sorter){
        this.setState({pagination});
    }
    pageChange(page, pageSize = 10){
        const pagination = JSON.parse(JSON.stringify(this.state.pagination));
        pagination.current = 1;
        this.setState({pagination});
    }
    search(){
        this.pageChange(1);
        this.getList();
    }
    async getList(){
        const uri = new URI(SITE_INFO.domain + '/service/biz/contents/sync/baidu');
        uri.setQuery('keyword', this.state.keyword);
        if(Array.isArray(this.state.category)){
            uri.setQuery('category', this.state.category.filter(each=>each!==null).join(','));
        }else{
            uri.setQuery('category', this.state.category);
        }
        uri.setQuery('contentType', this.state.contentType);
        if(this.state.timeRange.length){
            uri.setQuery('beginTime', this.state.timeRange[0].unix());
            uri.setQuery('endTime', this.state.timeRange[1].unix());
        }
        this.startLoading();
        const res = await ajax.get(API.serverRequest.url, {url: uri.toString()});
        this.stopLoading();
        if(res.code !== 200){
            message.error('获取列表失败：' + res.message);
            return;
        }
        const list = res.value || [];
        for(const each of list){
            each.cpName = '';
            const foundCp = CP_SOURCES.find(cp=>cp.value === each.cpId);
            if(foundCp){
                each.cpName = foundCp.name;
            }
            each.contentTypeName = '';
            if(each.type === 0){
                each.contentTypeName = '新闻';
            }
            if(each.type === 11){
                each.contentTypeName = '视频';
            }
        }
        this.setState({list});
    }
    render(){
        const categoryOptions = this.state.categoryList.map(each=>{
            return <Select.Option value={each.cpCategoryId} key={each.cpCategoryId}>{each.cpCategoryName}</Select.Option>;
        });
        categoryOptions.push(<Select.Option value={null} key={null}>全部</Select.Option>);
        return (
            <div id="baidu-content-input">
                <Form layout="inline">
                    <Form.Item label="关键字">
                        <Input value={this.state.keyword}
                            onPressEnter={this.search.bind(this)}
                            onChange={this.fieldChange.bind(this, 'keyword')} placeholder="请填写"></Input>
                    </Form.Item>
                    <Form.Item label="百度内容类型">
                        <Select onChange={this.fieldChange.bind(this, 'contentType')} placeholder="请选择" value={this.state.contentType}>
                            <Select.Option value={0}>新闻</Select.Option>
                            <Select.Option value={2}>视频</Select.Option>
                            <Select.Option value={null}>全部</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
                <Form layout="inline">
                    <Form.Item label="时间范围">
                        <DatePicker.RangePicker showTime={{defaultValue: [this.dayStartTime, this.dayEndTime]}}
                            value={this.state.timeRange} onChange={this.fieldChange.bind(this, 'timeRange')} />
                    </Form.Item>
                    <Form.Item label="百度内容类目">
                        <Select onChange={this.fieldChange.bind(this, 'category')}
                            placeholder="请选择"
                            value={this.state.category}>
                            {categoryOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button.Group>
                            <Button onClick={this.search.bind(this)} loading={this.state.isLoading}>搜索及入库</Button>
                        </Button.Group>
                    </Form.Item>
                </Form>
                <Table dataSource={this.state.list}
                    loading={this.state.isLoading}
                    rowKey="cpEntityId"
                    onChange={this.onTableChange.bind(this)}
                    pagination={this.state.pagination}
                    columns={this.columns}></Table>
            </div>
        )
    }
}
export default BaiduContentInput;