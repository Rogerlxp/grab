const contentDbName = 'MEIZU_CONTENTS';
const categoryTableName = 'T_CONTENT_CATEGORY';
import {message} from 'antd';
import API from '../const/API';
import ajax from './ajax';
import handy from './handy';
const ALGORITHM = require('../../common/enum/ALGORITHM.js');
const URI = require('urijs');
const shortid = require('shortid');
const distributionLib =  {
    async getDefaultCondition(disInfo){
        let conditions = [];
        const conditionRes = await ajax.get(API.getByKeyName.url, {
            dbName: 'MEIZU_CONTENTS',
            tableName: 'T_CONTENT_DIS_CONDITION',
            keyValue: disInfo.FID,
            keyName: 'FDISID'
        });
        if(Array.isArray(conditionRes.value)){
            // sub category is very special, here is transfer for rendering
            // when submit, you should transfer it to original structure
            conditions = conditionRes.value.map(condition=>{
                if(condition.FCPID === 0){
                    condition.FCPID = null;
                }
                // sub category
                const subCategory = condition.FSUB_CATEGORY;
                condition.FSUB_CATEGORY = {
                    value: subCategory,
                    options: []
                }
                // normalize field
                condition._action = 'set';
                condition._key = shortid.generate();
                return condition;
            });
            // console.log(conditions);
            for(let condition of conditions){
                if(condition.FCATEGORY){
                    condition.FSUB_CATEGORY.options = await this.getSubCategory(condition.FCATEGORY);
                    // console.log(condition)
                }
            }
        }
        return conditions;
    },
    async getFirstCategory(){
        let category = [];
        const res = await ajax.get(API.tableDistinctQuery.url, {
            dbName: contentDbName,
            tableName: categoryTableName,
            keyName: 'FCATEGORY'
        });
        if(res.code === 200){
            if(Array.isArray(res.value)){
                category = res.value.map(item=>{
                    return {name: item.FCATEGORY, value: item.FCATEGORY};
                });
                category.push({name: '无', value: null});
            }
        }
        return category;
    },
    async getSubCategory(categoryName){
        const subCategoryRes = await ajax.get(API.getByKeyName.url, {
            dbName: contentDbName,
            tableName: categoryTableName,
            keyName: 'FCATEGORY',
            keyValue: categoryName
        });
        // console.log(subCategoryRes);
        if(subCategoryRes.code !== 200){
            message.error(subCategoryRes.message);
            return;
        }
        if(Array.isArray(subCategoryRes.value)){
            const sub = subCategoryRes.value.map(s=>{
                return {name: s.FSUB_CATEGORY, value: s.FSUB_CATEGORY};
            });
            sub.push({name: '无',value: null});
            return sub;
        }
        return [];
    },
    async getConditions(algorithm?){
        algorithm = algorithm || this.props.selectedAlgorithm;
        // detect if conditions has been loaded.
        const uri = new URI();
        const query = uri.query(true);
        const disId = query['disId'];
        const conditionRes = await ajax.get(API.getByKeyName.url, {
            dbName: 'MEIZU_CONTENTS',
            tableName: 'T_CONTENT_DIS_CONDITION',
            keyValue: disId,
            keyName: 'FDISID'
        });
        if(conditionRes.code !== 200){
            message.error('获取当前过滤条件错误：' + conditionRes.message);
            return;
        }
        if(Array.isArray(conditionRes.value)){
            const noAlgorithmConditions = conditionRes.value.filter(each=>!each.FALGOVER).map(each=>{
                return {
                    category: each.FCATEGORY || null,
                    cpId: each.FCPID === 0 ? null : each.FCPID,
                    subCategory: each.FSUB_CATEGORY||null,
                    type: each.FTYPE === undefined?null:each.FTYPE,
                    id: each.FID
                }
            });
            const otherConditions = conditionRes.value.filter(each=>!!each.FALGOVER);
            const cpConditions = {};
            // set default category value
            const conditionTable = {
                tableName: 'T_CONTENT_DIS_CONDITION',
                rows: []
            };
            for(const eachAlgorithm of ALGORITHM){
                const algorithmName = eachAlgorithm.value;
                if(!algorithmName){
                    // this is "no algorithm".
                    continue;
                }
                const foundCondition = otherConditions.find(each=>each.FALGOVER === algorithmName);
                if(!foundCondition || [null, undefined, ''].includes(foundCondition.FCATEGORYID)){
                    // set CATEGORYID default value to "recommendation"
                    const categories = await distributionLib.getCategory.call(this, algorithmName);
                    if(Array.isArray(categories) === false){
                        throw new Error('Can not find categories, can not set default category id.');
                    }
                    const recommendationCategory = categories.find(each=>each.name === '推荐');
                    let recommendationValue = null;
                    let recommendationName = '';
                    if(recommendationCategory){
                        recommendationValue = recommendationCategory.id;
                        recommendationName = recommendationCategory.name;
                    }
                    const row:any = {
                        _action: 'set',
                        FCATEGORYID: recommendationValue,
                        FDISID: disId,
                        FCATEGORY: recommendationName,
                        FSUB_CATEGORY: '',
                        FALGOVER: algorithmName,
                        FCPID: eachAlgorithm.cpId
                    };
                    if(foundCondition){
                        row.FID = foundCondition.FID;
                    }
                    conditionTable.rows.push(row);
                }
            }
            if(conditionTable.rows.length){
                const tables = [conditionTable];
                const res = await ajax.post(API.multiTableSave.url, {tables});
                if(res.code !== 200){
                    message.error('设置默认分类失败:' + res.message);
                    return;
                }
                console.log('refresh conditions value after setting default category value.');
                // return distributionLib.getConditions.call(this, algorithm);
                return await distributionLib.getConditions.call(this, algorithm);
            }
            for(const eachAlgorithm of ALGORITHM){
                const algorithmName = eachAlgorithm.value;
                if(!algorithmName){
                    // this is "no algorithm".
                    continue;
                }
                const foundCondition = otherConditions.find(each=>each.FALGOVER === algorithmName);
                cpConditions[algorithmName] = {
                    category: foundCondition.FCATEGORYID || null,
                    type: foundCondition.FTYPE === undefined ? null : foundCondition.FTYPE,
                    id: foundCondition.FID,
                }
            }
            console.log('cpConditions: ', cpConditions);
            await this.props.dispatch({type: 'contentAlgorithm.setValue', value: {
                serverConditions: conditionRes.value,
                conditions: noAlgorithmConditions,
                cpConditions
            }});
        }
    },
    async getCategory(selectedAlgorithm){
        const categoryName = selectedAlgorithm?selectedAlgorithm:'noAlgorithm';
        if(this.props.category[categoryName]){
            return this.props.category[categoryName];
        }
        let value;
        if(categoryName === 'noAlgorithm'){
            const res = await ajax.post(API.queryTable.url, {
                tableName: 'T_CONTENT_CATEGORY'
            });
            if(res.code !== 200){
                message.error('获取无算法的分类失败：' + res.message);
                return;
            }
            const first = new Set();
            for(const each of res.value.list){
                first.add(each.FCATEGORY);
            }
            this.props.dispatch({type: 'contentAlgorithm.setValue',key:'firstCategory', value:[...first]});
            value = res.value.list;
        }else{
            const uri = new URI('http://om.iflow.meizu.com/service/dis/condition');
            uri.setQuery('algover', selectedAlgorithm);
            const res = await ajax.get(API.serverRequest.url, {url: uri.toString()})
            if(res.code !== 200){
                message.error('获取分类列表失败：'+res.message);
                return;
            }
            value = res.value.categories.map(each=>{
                each.id = (each.id || '') + '';
                return each;
            });
        }
        const category = handy.copyObj(this.props.category);
        category[categoryName] = value;
        await this.props.dispatch({type: 'contentAlgorithm.setValue',key:'category', value:category});
        return category[categoryName];
    },
    async freshCache(disId){
        // console.log('fresh distribution: ' + disId);
        let freshRes = await ajax.post(API.freshDistributionCache.url, {disId});
        if(freshRes.code === 200){
            message.success('刷新成功');
        }else{
            message.error(freshRes.message);
        }
    }
};
export default distributionLib;