import store from '../reducer';
import miscellaneousActions from '../action/miscellaneous';
const FILTER_DEF = require('../../common/filter');
const shortId = require('shortid');
const URI = require('urijs');
interface PAGE_CONFIG {
    tableName?: string;
    dbName?: string;
    fields?: any[];
    isAbleAddItem?: boolean;
    listUrl?: string;
    queryFields?: any[];
    editModalWidth?: number;
    getOneContentUrl?: string;
    getOneContentFields?: string[];
    getOneContentIsRedirect?: boolean;
    updateConfig?: any;
    queryType?: string;
    pager?: any;
    init?:string[];
}

// this function is used for setting page individual configuration
const pageLib = {
    isSwitching: false,
    initFieldOptions(fields){
        for(const field of fields){
            if(typeof field.options === 'string'){
                const action = miscellaneousActions.find(each=>each.name === field.options);
                field.options = action.action();
            }
        }
    },
    // page init config
    setPageConfig: async function(config:PAGE_CONFIG){
        this.isSwitching = true;
        // console.log('page config: ', config);
        await store.dispatch({type: 'table.setValue', value: {
            isLoading: true
        }});
        if(config.init){
            for(const actionName of config.init){
                const miscellaneousInitDef = miscellaneousActions.find(acDef => acDef.name === actionName);
                await miscellaneousInitDef.action();
            }
        }
        // console.log(miscellaneousActions);
        const uri = new URI();
        const query = uri.query(true);
        const dbName = config.dbName || 'MEIZU_CONTENTS';
        const tableName = config.tableName || '';
        const fields = config.fields || [];
        const isAbleAddItem = config.isAbleAddItem || false;
        const listUrl = config.listUrl || '';
        const editModalWidth = config.editModalWidth || 720;
        const queryType = config.queryType || 'url';
        // const pager = config.pager === undefined ? true : config.pager;
        let queryFields = config.queryFields;
        // console.log('set fields: ', fields);
        // console.log('set page config:',config);
        this.initFieldOptions(fields);
        // console.log('table name: ' + tableName);
        await store.dispatch({type: 'table.setValue', value: {
            dbName,
            tableName,
            fields: fields,
            isAbleAddItem,
            list: [],
            listUrl
        }});
        let filter = query.filter;
        if(typeof filter === 'string'){
            // console.log('filter: ', filter);
            filter = JSON.parse(decodeURIComponent(filter));
        }else if(!filter){
            filter = {};
        }
        if(!queryFields){
            // get query fields by table name
            if(tableName){
                queryFields = FILTER_DEF[tableName];
            }else{
                console.log('no filter defined.');
            }
        }
        // console.log('filter value: ', filter);
        if(queryFields){
            // set query default value or url query value.
            queryFields = JSON.parse(JSON.stringify(queryFields));
            this.initFieldOptions(queryFields);
            const filterKeys = Object.keys(filter);
            // console.log('filter keys: ', filterKeys);
            for(const filterField of queryFields){
                const keyName = filterField.keyName;
                // not a search field.
                if(!keyName){
                    continue;
                }
                // set url query into query fields
                if(filterKeys.includes(keyName)){
                    filterField.value = filter[keyName];
                    continue;
                }
                if(filterField.defaultValue !== undefined){
                    filterField.value = filterField.defaultValue;
                    if(filterField.type === 'select'){
                        const opDef = filterField.options.find(op=>op.value === filterField.defaultValue);
                        if(opDef){
                            // already set default value
                            // filterField.value = filterField.defaultValue;
                        }else if(typeof filterField.defaultValue === 'number'){
                            // default value is an order of options
                            filterField.value = filterField.options[filterField.defaultValue].value;
                        }else if(Array.isArray(filterField.defaultValue) === true){
                            // multi selection
                        }else if(filterField.defaultValue === null){
                            // null mean all selected.
                        }else{
                            console.log('filter field: ', filterField);
                            throw new Error('can not recognize this default value.');
                        }
                    }
                }
            }
        }else{
            queryFields = [];
        }
        // console.log('final query: ', queryFields);
        await store.dispatch({type: 'table.setValue', value:{
            queryType,
            queryFields,
            editModalWidth,
        }});
        // const event = new Event('pageConfigFinished');
        // window.dispatchEvent(event);
        // console.log('exec page load finished.');
        pageLib.onPageFinished();
        this.isSwitching = false;
    },
    onPageFinished: function(){
        console.log('page finished.');
    }
}
export default pageLib;