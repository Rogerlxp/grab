import * as React from 'react';
import Loadable from 'react-loadable';
import {
    Table,
    Spin
} from 'antd';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import miscellaneousActions from '../../action/miscellaneous';
import buttonActions from '../../action/buttonActions';
import fieldRender from '../../lib/fieldRender';
import pageLib from '../../lib/page';
const URI = require('urijs');
const EditFormModal = Loadable({
    loader: ()=>import('../Modal/EditFormModal'),
    loading(){
        return <div>loading...</div>
    }
});
class ContentList extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.freshList = props.freshList;
        pageLib.onPageFinished = async () => {
            console.log('list page finished.');
            this.freshList && this.freshList();
            this.primaryField = this.props.fields.find(each=>!!each.isPrimaryKey);
            this.listConfig = this.primaryField.listConfig || {};
            if(!this.primaryField){
                throw new Error('Must provide primary key definition.');
            }
        };
    }
    freshList:any;
    showList = [];
    primaryField:any = {};
    listConfig: {[key:string]:any};
    shouldComponentUpdate(nextProps){
        // console.log(nextProps.isLoading);
        if(this.props.isLoading !== nextProps.isLoading){
            // console.log('switch loading');
            return true;
        }
        if(pageLib.isSwitching === false){
            if(nextProps.isLoading === false){
                // console.log('update component');
                return true;
            }
        }
        return false;
    }
    async componentDidMount(){
        const uri = new URI();
        const query = uri.query(true);
        // set default pagination
        await this.props.setValue('pageSize', (+query.pageSize) || 10);
        await this.props.setValue('page', (+query.page) || 1);
        const originPathname = window.location.pathname;
        // let originHref = window.location.href;
        const unListen = this.props.history.listen(async ()=>{
            if(originPathname !== window.location.pathname){
                unListen();
                console.log('path name has been change. no freshing list follow.');
                return;
            }
            // if(originHref === window.location.href){
            //     console.log('page not chang.');
            //     return;
            // }
            const uri = new URI();
            const query = uri.query(true);
            // console.log(query);
            if(query.page && query.pageSize){
                // pass url query page value to redux state when page freshing.
                if(this.props.page !== (+query.page)){
                    // console.log('props page: ', this.props.page);
                    // console.log('new query page: ', +query.page);
                    await this.props.setValue('page', (+query.page));
                }
                if(this.props.pageSize !== (+query.pageSize)){
                    await this.props.setValue('pageSize', (+query.pageSize));
                }
            }
            // console.log('url change, fresh list.');
            this.freshList();
        });
    }
    pageChange=(page)=>{
        const uri = new URI();
        uri.setQuery('page', page);
        this.props.history.push(uri.pathname() + '?' + uri.query());
    }
    pageSizeChange=(current, size)=>{
        const uri = new URI();
        uri.setQuery('pageSize', size);
        uri.setQuery('page', 1);
        this.props.history.push(uri.pathname() + '?' + uri.query());
    }
    fieldChange(field, event){
        this.props.setFieldsValue(field.keyName, event.target.value);
    }
    async sort(field){
        const originSortBy = this.props.sortBy;
        const originSortOrder = this.props.sortOrder;
        const newSortBy = field.keyName;
        if(originSortBy){
            if(originSortBy === newSortBy){
                const contractSortOrder = originSortOrder ? (originSortOrder === 'DESC' ? 'ASC':'DESC') : 'ASC';
                await this.props.setValue('sortOrder', contractSortOrder);
            }else{
                await this.props.setValue('sortOrder', 'DESC');
                await this.props.setValue('sortBy', newSortBy);
            }
        }else{
            await this.props.setValue('sortOrder', 'DESC');
            await this.props.setValue('sortBy', newSortBy);
        }
        this.freshList();
    }
    historyPush(uri){
        this.props.history.push(uri.pathname() + '?' + uri.query());
    }
    overlayClick(record, event){
        const keys = event.key.split('-');
        const actionName = keys[0];
        const index = +keys[1];
        const actionDef = buttonActions.find(def=>def.name === actionName);
        // console.log(actionDef, record);
        actionDef.action.call(this, record);
    }
    tableChange = async (pagination, filters, sorter)=>{
        if(this.listConfig.pager === 'fake'){
            this.props.setValue('pageSize', pagination.pageSize);
            this.props.setValue('page', pagination.current);
            return;
        }
        // console.log('page query type: ', this.props.queryType);
        const uri = new URI();
        const query = uri.query(true);
        const pageSize = (+query.pageSize) || 10;
        if(pageSize !== pagination.pageSize){
            // page size change
            // console.log('change page size: ', pagination.pageSize);
            await this.props.setValue('pageSize', pagination.pageSize);
            await this.props.setValue('page', pagination.current);
            if(this.props.queryType === 'redux'){
                return this.freshList();
            }
            uri.setQuery('page', 1);
            uri.setQuery('pageSize', pagination.pageSize);
            this.historyPush(uri);
            return;
        }
        const page = this.props.page || (+query.page) || 1;
        if(page !== pagination.current){
            // page change
            // console.log('change page: ', pagination.current);
            await this.props.setValue('page', pagination.current);
            if(this.props.queryType === 'redux'){
                return this.freshList();
            }
            uri.setQuery('page', pagination.current);
            this.historyPush(uri);
            return;
        }
        const sortBy = query.sortBy;
        const sortOrder = query.sortOrder;
        if(sortBy !== sorter.field || sortOrder !== sorter.order){
            if(!sorter.field){
                uri.removeQuery(['sortBy', 'sortOrder']);
                this.historyPush(uri);
                return;
            }
            uri.setQuery('sortBy', sorter.field);
            let order = '';
            if(sorter.order === 'descend'){
                order = 'DESC';
            }
            if(sorter.order === 'ascend'){
                order = 'ASC';
            }
            uri.setQuery('sortOrder', order);
            this.historyPush(uri);
            return;
        }
    }
    render(){
        if(pageLib.isSwitching){
            return '';
        }
        const uri = new URI();
        const query = uri.query(true);
        const fields = this.props.fields;
        // const list = this.props.list;
        const tableProps:any = {};
        // console.log('fields: ', fields);
        // console.log('list: ',list);
        const showFields = fields.filter(item=>{
            return item.unlistable !== true;
        });
        // console.log('show fields: ', showFields);
        const columns = showFields.map(field=>{
            let dataIndex = field.keyName || field.name;
            const render = (val, record, index)=>{
                return fieldRender.call(this, val, record, index, field);
            };
            const row:any = {
                title: field.name,
                dataIndex,
                render,
                key: field.name || field.keyName
            };
            if(field.sortable){
                row.sorter = true
            }
            if(query.sortBy === field.keyName){
                if(query.sortOrder === 'ASC'){
                    row.sortOrder = 'ascend';
                }else if(query.sortOrder === 'DESC'){
                    row.sortOrder = 'descend';
                }else{
                    row.sortOrder = false;
                }
            }
            if(field.width){
                row.width = field.width;
            }
            return row;
        });
        // console.log('columns: ', JSON.stringify(columns));
        // console.log('list: ', JSON.stringify(this.props.list));
        const dataSource = this.props.list.slice();
        // console.log('data source: ', JSON.stringify(dataSource));
        let pagination;
        // console.log('is pager: ', this.props.isPager);
        if(this.listConfig.pager === false){
            pagination = false;
        }else if(this.listConfig.pager === 'more'){
            pagination = false;
        }else if(['fake', undefined].includes(this.listConfig.pager)){
            pagination = {
                total: this.props.total,
                pageSize: this.props.pageSize,
                showQuickJumper: true,
                current: this.props.page,
                showSizeChanger:true
            };
        }
        const sumFields = fields.filter(field=>!!field.isSum);
        // console.log('before: ', JSON.stringify(dataSource));
        if(sumFields.length){
            const sumRow = {
                key: 'sum'
            };
            const firstListField = fields.find(field=>field.unlistable === undefined);
            sumRow[firstListField.keyName] = '汇总';
            for(const row of dataSource){
                for(const field of sumFields){
                    if(sumRow[field.keyName] === undefined){
                        sumRow[field.keyName] = 0;
                    }
                    sumRow[field.keyName] += (row[field.keyName] || 0);
                }
            }
            dataSource.push(sumRow);
            // console.log(JSON.stringify(dataSource));
        }
        tableProps.pagination = pagination;
        tableProps.columns = columns;
        tableProps.dataSource = dataSource;
        tableProps.size = 'middle';
        tableProps.className = 'table-list';
        tableProps.loading = this.props.isLoading;
        tableProps.onChange = this.tableChange;
        tableProps.rowKey = this.primaryField.keyName;
        // console.log('row key: ', tableProps.rowKey);
        tableProps.rowClassName = (this.primaryField && this.primaryField.rowClassName) ? (record, index) => {
            const actionDef = miscellaneousActions.find(acDef => acDef.name === this.primaryField.rowClassName.action);
            return actionDef.action.call(this, record);
        } : '';
        tableProps.bordered = true;
        // console.log('is loading: ', this.props.isLoading);
        if(this.listConfig.pager === 'more' && dataSource.length){
            if(this.props.noMore !== true){
                tableProps.footer = ()=>{
                    let text:any = '更多';
                    if(tableProps.loading){
                        text = <Spin />;
                    }
                    // props
                    const props:any = {};
                    props.className = 'more';
                    props.onClick = async () => {
                        await this.props.setValue('page', this.props.page + 1);
                        this.freshList.call(this);
                    };
                    return <div {...props}>{text}</div>;
                }
            }
        }
        return <div className="content-list">
            <Table {...tableProps} />
            <EditFormModal freshList={this.freshList} />
        </div>;
    }
}

const mapStateToProps = (state) => {
    let props:any = state.table;
    props.formFields = state.fields;
    return props;
};
const mapDispatchToProps = dispatch => {
    return {
        setValue: (key, value)=>dispatch({type: 'table.setValue', value, key}),
        setEditFormValue: (key, value)=>dispatch({type: 'editForm.setValue', value, key}),
        dispatch
    };
};
const component:any = connect(mapStateToProps,mapDispatchToProps)(ContentList);
const container:any = withRouter(component);
export default container;