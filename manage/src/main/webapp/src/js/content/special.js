/**
 * config lib
 */
var clip;
window.TIME_START_TEXT = '开始时间';
window.TIME_END_TEXT = '结束时间';
var copyFunc = function(url,data,msg){
	clip && clip.destroy();
	clip = new Clipboard('.ac-sure', {
		text: function() {
          var result = $.ajax(url, {async: false, data: data, method: 'POST'}).responseJSON;
          $('#common-modal').modal('hide');
          return result.value;
		}
	});

	clip.on('success', function(e) {
		MU.alert(msg + '成功', true, function(){
			$('#common-modal').hide();
		});
	});

	clip.on('error', function(e) {
		MU.alert(msg + '失败', true, function(){
			$('#common-modal').hide();
		});
	});
}
var config = {
    fileds: [
        {
            name:'id',
            text:'文章ID',
            type:'number',
            actions:['list', 'search']
        },
        {
            name:'uniqueId',
            text:'CP文章ID',
            type:'text',
            width: '200px',
            actions:['list', 'search']
        },
        {
            name: 'title',
            text: '文章标题',
            type: 'text',
            width: '300px',
            showFn: function (val, rowData) {
            	if(val === undefined || val ==''){
            		val='_';
            	}
            	var link = rowData.link;
            	if(rowData.resourceType === 1){
            		link = rowData.imgUrl;
            	}else if(rowData.resourceType === 71){
            		link = link.replace('open.uczzd.cn','m.uczzd.cn');
            	}
            	return '<a href="' + link + '" target="_blank">'+ val +'</a>'
            },
            actions: ['list', 'search']
        },
        {
            name: 'author',
            text: '作者',
            type: 'text',
            actions: ['list','search']
        },
        {
            name: 'label',
            text: '标签',
            type: 'text',
            width: '180px',
            actions: ['list','search']
        },
        {
            name: 'keywords',
            text: '关键字',
            type: 'text',
            width: '180px',
            actions: ['list','search']
        },
/*        {
            name: 'contentSourceId',
            text: '文章源',
            type: 'select',
            enumName: '/T_CONTENT_SOURCE',
            enumId: 'id',
            enumText: 'name',
            actions: ['list', 'search']
        },*/
        {
            name: 'guidChannel',
            text: '渠道',
            type: 'select',
            enumName: 'GUID_CHANNEL',
            actions: ['batchAdd']
        },
        {
            name: 'resourceType',
            text: '内容CP',
            type: 'select',
            enumName: 'RES_TYPE',
            actions: ['list','search','batchAdd']
        },
/*        {
            name: 'cpChannelId',
            text: '频道',
            type: 'select',
            enumName: 'CONTENT_CHANNEL',
            actions: ['list','search','add','batchAdd']
        },*/
        {
            name: 'position',
            text: '位置',
            type: 'select',
            enumName: 'CONTENT_AREA',
            actions: ['batchAdd']
        },
/*        {
            name: 'listStyle',
            text: '列表样式',
            type: 'select',
            enumName: 'LIST_STYLE',
            actions: ['search']
        },*/
        {
            name: 'type',
            text: '内容类型',
            type: 'select',
            enumName: 'CONTENT_TYPE',
            actions: ['list','search']
        },
/*        {
            name: 'ctr',
            text: 'CTR',
            type: 'text',
            actions: ['list']
        },*/
        {
            name: 'commentCount',
            text: '评论量',
            type:'number',
            showFn: function (val, rowData) {
            	return '<a href="/page/comment/lib?articleId='+rowData.id+'")">'+ val +'</a>'
            },
            actions: ['list']
        },
        {
            name: 'putdate',
            text: '上架时间',
            type: 'time',
            actions: ['list']
        },
        {
            name: 'status',
            text: '状态',
            type: 'select',
            enumName: 'STATUS',
            value: '1',
            actions: ['list','search']
        },
        {
            name: 'scope',
            text: '范围',
            type: 'select',
            enumName: 'TIME_SCOPE',
            value: '1',
            onSelect: function(item){
            	var val = item.attr('value');
            	if(val != -1){
            		//显示自定义时间
            		$('input.form-control.hasDatepicker').parent().hide();
            	}else{
            		$('input.form-control.hasDatepicker').parent().show();
            	}
            },
            actions: ['search']
        },
        {
            name: 'link',
            text: '文章链接',
            type: 'text',
            actions: ['info']
        },
        {
        	name: 'appResource',
        	text: '请选择应用',
        	type: 'select',
        	enumName: 'APP_RESOURCE',
        	selectAll: false,
        	actions: ['copyScheme']
        },
        {
        	name: 'urlParam',
        	text: '请选择应用',
        	type: 'select',
        	enumName: 'COPY_URL',
        	actions: ['copyUrl']
        },
        {
        	name: 'customScope',
        	text: '',
        	type: 'time',
        	actions: ['search']
        }
    ],
    actions: [
        {action: 'search', text: '查询', clz: 'info', url: '/service/article/special/list'},
        {
            action: 'copyUrl',
            text: '复制URL',
            clz: 'info',
            single: true,
            isCopy: true,
            initFn: function($btn) {
            	$('#common-edit-form').find('ul[data-enum=COPY_URL]').find('a[value=1]').trigger('click');
            },
            callbackFn: function (data, $btn) {
            	copyFunc('/service/article/url',data,'URL复制');
            }
        },
        {
            action: 'copyScheme',
            text: '生成Scheme',
            clz: 'info',
            single: true,
            isCopy: true,
            initFn: function($btn) {
            	$('#common-edit-form').find('ul[data-enum=APP_RESOURCE]').find('a[value=1]').trigger('click');
            },
            callbackFn: function (data, $btn) {
            	copyFunc('/service/article/scheme',data,'Scheme复制');
            }
        },
        {action: 'del', text: '删除', clz: 'danger', url: '/service/article/special/del'}
    ],
    pageNumber: 10,
    positions: [
    	{text: '首页', url: '/page/content/article'},
    	{text: '内容管理'},
    	{text: '特色库'}
    ]
}

new BasePage().init(config);