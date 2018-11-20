const contentsConnection = require('./connection');
const routerConnection = require('./routerConnection');
const STRUCTURE = [{
    name: 'MEIZU_CONTENTS',
    isSharding: false,
    connection: contentsConnection,
    tables: [{
        name: 'T_AUTHOR'
    },{
        name: 'T_AUTHOR_CP_MAPPING'
    },{
        name: 'T_AUTHOR_FEATURE'
    },{
        name: 'T_CONTENT_CATEGORY'
    },{
        name: 'T_CONTENT_CHECK_RECORD'
    },{
        name: 'T_CONTENT_DIS'
    },{
        name: 'T_CONTENT_DIS_CONDITION'
    },{
        name: 'T_CONTENT_DIS_DISPLAY'
    },{
        name: 'T_CONTENT_DIS_FLITER'
    },{
        name: 'T_CONTENT_DUPLICATE'
    },{
        name: 'T_CONTENT_FEATURE'
    },{
        name: 'T_CONTENT_FEATURE_DETIAL'
    },{
        name: 'T_CONTENT_FEATURE_DETIAL_DAILY'
    },{
        name: 'T_CONTENT_FEATURE_STATUS'
    },{
        name: 'T_CP'
    }]
}, {
    name: 'MEIZU_CONTENTS_ROUTER',
    isSharding: true,
    shardingTableName: 'T_ROUTER_DATABASE',
    shardingKeyName: 'FNAME',
    connection: routerConnection,
    tables: [{
        name: 'T_AUTHOR_CONTENTS_MAPPING'
    },{
        name: 'T_CONTENTS'
    },{
        name: 'T_CONTENTS_DES'
    }]
}];
module.exports = STRUCTURE;