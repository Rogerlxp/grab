module.exports = {
FCPID: {
    name:'FCPID',
    index:1,
    type:'smallint(4) unsigned',
    isNotEmpty: true,
    isAutoIncrease:	false,
    key: 'PRI',
    defaultValue:null,
    description:'内容同步来源CP'
},
FCP_ENTITYID: {
    name: 'FCP_ENTITYID',
    index:2,
    type: 'varchar(32)',
    isNotEmpty:	true,
    isAutoIncrease:	false,
    key: 'PRI',
    defaultValue:null,
    description:'CP的内容ID'
},
FCONTENT_ID: {
    name: 'FCONTENT_ID'	,
    index:3	,
    type: 'bigint(10)',
    isNotEmpty:	true,
    isAutoIncrease:	false,
    key: 'UNI',
    defaultValue:null,
    description:'魅族内容ID'
},
FTYPE: {
    name: 'FTYPE'	,
    index:4	,
    type: 'tinyint(4)',
    isNotEmpty:	true,
    isAutoIncrease:	false,
    key: '',
    defaultValue:null,
    description:'内容类型'
},
FTITLE: {
    name: 'FTITLE'	,
    index:5	,
    type: 'varchar(512)',
    isNotEmpty:	true,
    isAutoIncrease:	false,
    key: '',
    defaultValue:null,
    description:'标题'
},
FSUB_TITLE: {
    name: 'FSUB_TITLE'	,
    index:6	,
    type: 'varchar(512)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key: '',
    defaultValue:null,
    description:'副标题'
},
FKEYWORDS: {
    name: 'FKEYWORDS'	,
    index:7	,
    type: 'varchar(512)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key: '',
    defaultValue: null,
    description:'文章关键字列表'
},
FKEYWORDS_FREQ: {
    name: 'FKEYWORDS_FREQ'	,
    index:8	,
    type: 'varchar(512)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'文章关键字词频列表'
},
FVIDEO_DURATION: {
    name: 'FVIDEO_DURATION'	,
    index:9	,
    type: 'tinyint(4)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'视频时长'
},
FIMG: {
    name: 'FIMG'	,
    index:10	,
    type: 'varchar(1024)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'封面列表'
},
FDES: {
    name: 'FDES'	,
    index:11	,
    type: 'varchar(1024)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'简介'
},
FCATEGORY: {
    name: 'FCATEGORY'	,
    index:12	,
    type: 'varchar(512)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'类别'
},
FTAG: {
    name: 'FTAG'	,
    index:13	,
    type: 'varchar(512)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'标签'
},
FSOURCE: {
    name: 'FSOURCE'	,
    index:14	,
    type: 'varchar(128)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'内容创作来源'
},
FJSON_URL: {
    name: 'FJSON_URL'	,
    index:15	,
    type: 'varchar(256)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'json的打开地址'
},
FH5_URL: {
    name: 'FH5_URL'	,
    index:16	,
    type: 'varchar(256)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'详情URL'
},
FOPEN_TYPE: {
    name: 'FOPEN_TYPE'	,
    index:17	,
    type: 'smallint(8)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:1,
    description:'1：Json解析，2：H5'
},
FSHARE_URL: {
    name: 'FSHARE_URL'	,
    index:18	,
    type: 'varchar(256)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'分享URL'
},
FSTATUS: {
    name: 'FSTATUS'	,
    index:19	,
    type: 'tinyint(4)',
    isNotEmpty:	true,
    isAutoIncrease:	false,
    key:'',
    defaultValue:1,
    description:'状态'
},
FAUTHOR: {
    name: 'FAUTHOR'	,
    index:20	,
    type: 'varchar(128)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'作者'
},
FAUTHOR_ID: {
    name: 'FAUTHOR_ID'	,
    index:21	,
    type: 'int(10)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key: '',
    defaultValue:null,
    description:'作者ID'
},
FRULEID: {
    name: 'FRULEID'	,
    index:22	,
    type: 'int(10)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description: '文章解析规则ID'
},
FRULE_SIGN: {
    name: 'FRULE_SIGN'	,
    index:23	,
    type: 'varchar(64)',
    isNotEmpty:	false,
    isAutoIncrease:	false,
    key:'',
    defaultValue:null,
    description:'文章解析规则签名'
},
FPV: {
    name:'FPV',
    index:24,
    type: 'int(10) unsigned',
    isNotEmpty: true,
    isAutoIncrease:	true,
    key:'',
    defaultValue: 0,
    description: 'PV数'
},
FCOMMENT_COUNT: {
    name: 'FCOMMENT_COUNT'	,
    index:25	,
    type: 'int(10)',
    isNotEmpty: unsigned,
    isAutoIncrease:	true,
    key:''[
        NULL,null,alue
        :]		评论数,descripti
        on:},
FSHARE_COUNT: {
    name: 'FSHARE_COUNT'	,
    index:26	,
    type: 'int(10)',
    isNotEmpty: unsigned,
    isAutoIncrease:	true,
    key:''[
        NULL,null,alue
        :]		分享数,descripti
        on:},
FCOLLECT_COUNT: {
    name: 'FCOLLECT_COUNT'	,
    index:27	,
    type: 'int(10)',
    isNotEmpty: unsigned,
    isAutoIncrease:	true,
    key:''[
        NULL,null,alue
        :]		收藏数量,descripti
        on:},
DIGG_COUNT: {
    name: 'DIGG_COUNT'	,
    index:28	,
    type: 'int(10)',
    isNotEmpty: unsigned,
    isAutoIncrease:	true,
    key:''[
        NULL,null,alue
        :]		顶的数量,descripti
        on:}
,BURY_COUNT: {name: BURY_COUNT	,index:29	,type: int(10),isNotEmpty: unsigned,isAutoIncrease:	true,	key: false	[NULL,defaultValue:]	0		踩的数量,description:}
,FPUBLISH_TIME: {name: FPUBLISH_TIME	,index:30	,type: datetime	false	false	[,isNotEmpty:NULL,isAutoIncrease:],	key: [NULL],defaultValue:		发布时间}
,,description:FCREATE_TIME: {name: FCREATE_TIME	,index:31	,type: datetime	false	false	[,isNotEmpty:NULL,isAutoIncrease:],	key: [NULL],defaultValue:		入库时间}
,,description:FRELEASE_TIME: {name: FRELEASE_TIME	,index:32	,type: datetime	false	false	[,isNotEmpty:NULL,isAutoIncrease:],	key: [NULL],defaultValue:		上架时间}
,,description:FUPDATE_TIME: {name: FUPDATE_TIME	,index:33	,type: datetime	false	false	[,isNotEmpty:NULL,isAutoIncrease:],	key: [NULL],defaultValue:		更新时间}
,,description:FEXTEND: {name: FEXTEND	,index:34	,type: text	false	false	[,isNotEmpty:NULL,isAutoIncrease:],	key: [NULL],defaultValue:		扩展字段}
,description:

}