/**
 * config article
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
            width: '100px',
            actions:['list', 'search']
        },
        {
            name: 'title',
            text: '文章标题',
            checkType: 'text',
            width: '200px',
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
            	return '<a href="' + link + '" target="_blank" title="' + val + '">'+ val +'</a>'
            },
            actions: ['list', 'search', 'upd', 'add']
        },
        {
        	name: 'contentTitle',
        	text: '详情标题',
        	checkType: 'text',
        	actions: ['add', 'upd']
        },
        {
            name: 'author',
            text: '作者',
            checkType: 'text',
            actions: ['list','search', 'upd', 'add']
        },
        {
        	name: 'category',
        	text: '类型',
        	type: 'text',
        	actions: ['list','search','upd', 'add']
        },
        {
            name: 'label',
            text: '标签',
            type: 'text',
            width: '180px',
            actions: ['list','search','upd', 'add']
        },
        {
            name: 'keywords',
            text: '关键字',
            type: 'text',
            width: '180px',
            actions: ['list','search','upd', 'add']
        },
        {
            name: 'guidChannel',
            text: '渠道',
            type: 'select',
            enumName: 'GUID_CHANNEL',
            actions: []
        },
        {
            name: 'resourceTypes',
            text: '内容CP',
            type: 'checkbox',
            enumName: 'RES_TYPE',
            actions: ['search'],
            selAll: true
        },
        {
            name: 'resourceType',
            text: '内容CP',
            type: 'select',
            enumName: 'RES_TYPE2',
            actions: ['list','add']
        },
        {
            name: 'contentSourceIdParam',
            text: '内容源',
            type: 'select',
            checkType: 'required',
            enumName: 'CONTENT_SOURCE',
            onSelect: function(item){
            	var val = item.attr('value');
            },
            actions: ['search']
        },
        {
            name: 'position',
            text: '位置',
            type: 'select',
            enumName: 'CONTENT_AREA',
            actions: ['']
        },
        {
            name: 'type',
            text: '内容类型',
            type: 'select',
            checkType: 'required',
            enumName: 'CONTENT_TYPE',
            actions: ['list','search','upd', 'add']
        },
        {
            name: 'viewCount',
            text: '浏览量',
            type:'number',
//            showFn: function (val, rowData) {
//            	return '<a href="/page/content/comment?articleId='+rowData.id+'")">'+ val +'</a>'
//            },
            actions: ['list']
        },
        {
            name: 'conversionV1',
            text: '转化率',
            type:'text',
//            showFn: function (val, rowData) {
//            	return '<a href="/page/content/comment?articleId='+rowData.id+'")">'+ val +'</a>'
//            },
            actions: ['list']
        },
        {
            name: 'commentCount',
            text: '评论量',
            type:'number',
            showFn: function (val, rowData) {
            	return '<a href="/page/content/comment?articleId='+rowData.id+'")">'+ val +'</a>'
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
            checkType: 'required',
            enumName: 'STATUS',
            value: '1',
            onSelect: function(item){
            	var val = item.attr('value');
            	if(val != 2){
            		$('form#common-edit-form input.form-control.hasDatepicker').parent().parent().parent().hide();
            	}else{
            		$('form#common-edit-form input.form-control.hasDatepicker').parent().parent().parent().show();
            	}
            },
            showFn: function (val, rowData) {
            	return '<a href="#" title=\''+(rowData.checkResult ==null?"":rowData.checkResult)+'\'>'+ enums.getText("STATUS",val) +'</a>'
            },
            actions: ['list', 'search']
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
            name: 'order',
            text: '排序',
            type: 'select',
            checkType: 'required',
            enumName: 'ORDER',
            onSelect: function(item){
            	var val = item.attr('value');
//            	if(val != 2){
//            		$('form#common-edit-form input.form-control.hasDatepicker').parent().parent().parent().hide();
//            	}else{
//            		$('form#common-edit-form input.form-control.hasDatepicker').parent().parent().parent().show();
//            	}
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
        },
        {
        	name: 'customTiming',
        	text: '定时时间',
        	type: 'time',
//        	checkType: 'required',
        	actions: ['add', 'upd']
        },
        {
        	name: 'imgUrls',
        	text: '列表图片',
        	type: 'img',
        	multi: true,
        	actions: ['info', 'upd', 'add']
        },
        {
        	name: 'description',
        	text: '简介',
        	type: 'textarea',
        	actions: ['add', 'upd']
        },
        {
        	name: 'content',
        	text: '详情',
        	type: 'editor',
        	actions: ['info', 'upd', 'add']
        }
    ],
    actions: [
        {action: 'search', text: '查询', clz: 'info', url: '/service/article/list'},
        {action: 'info', text: '详情', url: '/service/article/info', isHide: true},
        {
        	action: 'add', 
        	text: '新增', 
        	url: '/service/article/add', 
        	clz: 'info',
        	initFn: function($btn) {
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=0]').trigger('click');
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=2]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=3]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=5]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=6]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=9]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=10]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=11]').remove();
        		$('#common-edit-form').find('ul[data-enum=STATUS]').find('a[value=0]').trigger('click');
        		$('#common-edit-form').find('ul[data-enum=STATUS]').find('a[value=2]').remove();
        		$('#common-edit-form').find('ul[data-enum=STATUS]').find('a[value=3]').remove();
        		$('#common-edit-form').find('ul[data-enum=STATUS]').find('a[value=4]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=4]').trigger('click');
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=1]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=2]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=16]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=64]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=65]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=66]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=67]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=68]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=69]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=70]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=71]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=72]').remove();
        		$('#common-edit-form').find('ul[data-enum=RES_TYPE]').find('a[value=73]').remove();
        	}
        },
        {
        	action: 'upd', 
        	text: function(rowData) {
        		if(rowData.type == 0 || rowData.type == 1 || rowData.type == 4 || rowData.type == 7 || rowData.type == 8 ){
        			return '编辑';
        		}else{
        			return null;
        		}
        	}, 
        	url: '/service/article/editor', 
        	clz: 'info',
        	initFn: function($btn) {
        		$('#common-edit-form').find('ul[data-enum=STATUS]').find('a[value=3]').remove();
        		$('#common-edit-form').find('ul[data-enum=STATUS]').find('a[value=4]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=2]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=3]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=5]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=6]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=9]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=10]').remove();
        		$('#common-edit-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=11]').remove();
        	},
        	callbackFn: function (result) {
        		if(result.code == 200 && result.value != 'ok'){
        			$('#search-form input[name=id]').val(result.value);
        			$('#search-form').find('ul[data-enum=RES_TYPE]').find('a[value=""]').trigger('click');
        			$('#search-form').find('ul[data-enum=CONTENT_TYPE]').find('a[value=""]').trigger('click');
        			$('#search-form').find('ul[data-enum=STATUS]').find('a[value=""]').trigger('click');
        			$('#search-form').find('ul[data-enum=TIME_SCOPE]').find('a[value=""]').trigger('click');
        			$('.ac-search').click();
        		}
        	}
        },
        {
            action: 'copyUrl',
            text: 'URL',
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
            text: 'Scheme',
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
        {
        	action: 'sieve',
        	text: '筛选',
        	clz: 'info',
        	single: true,
        	isCopy: true,
        	callbackFn: function(data, $btn) {
        		var id = data.attr('data-id');
        		$.ajax({
					url: '/service/article/special/add',
					type: 'POST',
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
					dataType: 'json',
					data: { id:id },
					success: function(result){
						if(result.code == 200){
							MU.alert('筛选成功.', true);
						}else{
							MU.alert('筛选失败:\n' + result.message);
						}
					},
					error: function(){
						MU.alert('筛选失败:\n' + result.message);
					}
				});
        	}
        },
        {
        	action: 'release',
        	text: function(rowData) {
				if(rowData.status == 0){
					return '上架';
				}else{
					return null;
				}
			},
        	clz: 'info',
        	single: true,
        	callbackFn: function (data, $btn) {
        		var id = data.attr('data-id');
        		$.ajax({
					url: '/service/article/release',
					type: 'POST',
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
					dataType: 'json',
					data: { id:id },
					success: function(result){
						if(result.code == 200){
							MU.alert('上架成功.', true);
							$('.ac-search').click();
						}else{
							MU.alert('上架失败:\n' + result.message);
						}
					},
					error: function(){
						MU.alert('上架失败:\n' + result.message);
					}
				});
        	}
        },
        {
        	action: 'notrelease',
        	text: function(rowData) {
//        		if(rowData.status == 1 && (rowData.resourceType == 2 || rowData.resourceType == 71)){
        		if(rowData.status == 1){
					return '下架';
				}else{
					return null;
				}
        	},
        	clz: 'info',
        	single: true,
        	callbackFn: function (data, $btn) {
        		var id = data.attr('data-id');
        		$.ajax({
					url: '/service/article/notrelease',
					type: 'POST',
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
					dataType: 'json',
					data: { id:id },
					success: function(result){
						if(result.code == 200){
							MU.alert('下架成功.', true);
							$('.ac-search').click();
						}else{
							MU.alert('下架失败:\n' + result.message);
						}
					},
					error: function(){
						MU.alert('下架失败:\n' + result.message);
					}
				});
        	}
        },{
			action: 'distribute',
			text: '分发',
			isHide: false,
			isBatch: false,
			single: true,
			clz: 'info',
			callbackFn: function($btn){
				var id = $btn.attr('data-id');
				var $modal = $('#common-modal');
				var $modalBody = $modal.find('.modal-body');
				var $modalFooter = $modal.find('.modal-footer');
				var $acSure = $modal.find('.ac-sure');
				var $subSelect, $channelSelect;
				// make it small
				$modal.find('.modal-dialog').removeClass('large');
				// title
				$modal.find('.modal-title').text('添加到分发列表');
				// submit and cancel function
				var submit = function(){
					// console.log('submit');
					// var channelId = $channelSelect.val();
					var disId = $subSelect.val();
					var infoXhr = new XMLHttpRequest();
					infoXhr.open('GET', `/service/article/info?id=${id}`);
					infoXhr.addEventListener('load', function(){
						var articleRes = JSON.parse(infoXhr.responseText);
						if(articleRes.code === 200){
							var article = articleRes.value;
							var param = {
								disId: disId,
								contentId: id,
								cpId: article.resourceType,
								cpEntityId: article.uniqueId,
								publishTime: article.posttime
							};
							var addXhr = new XMLHttpRequest();
							addXhr.open('GET', `/service/dis/fliter/add?param=${encodeURIComponent(JSON.stringify(param))}`);
							addXhr.addEventListener('load', function(){
								var addRes = JSON.parse(addXhr.responseText);
								if(addRes.code === 200){
									alert('提交成功');
									$modal.modal('hide');
								}else{
									alert(addRes.message);
								}
							});
							addXhr.send();
						}
					});
					infoXhr.send();
				};
				var cancel = function(){
					// console.log('cancel');
					// clean event
					$acSure.off('click', submit);
					$modal.off('hide.bs.modal', cancel);
					// clean modal body
					$modalBody.html('');
				};
				// bind event
				$modal.on('hide.bs.modal', cancel);
				$acSure.on('click', submit);
				// show modal
				$modal.modal();
				// make options
				var channelOptions = [{
					name: '钱包',
					value: '1'
				}, {
					name: '日历',
					value: '2'
				}, {
					name: '天气',
					value: '3'
				}, {
					name: '手机管家',
					value: '10'
				}];
				var makeOptions = function(options){
					var els = [];
					for(var i = 0; i < options.length; i++){
						var item = options[i];
						 els.push(`<option value="${item.value}">${item.name}</option>`);
					}
					els.unshift(`<option value="" hidden disabled selected>请选择</option>`)
					return els.join('');
				}
				var channelOptionsEl = makeOptions(channelOptions);
				$modalBody.html(`<form>
					<div class="form-group">
						<label for="recipient-name" class="col-form-label">分发渠道</label>
						<select class="form-control channel-select" value="">${channelOptionsEl}</select>
					</div>
					<div class="form-group">
						<label for="message-text" class="col-form-label">分发ID</label>
						<select class="form-control sub-select" value=""></select>
					</div>
				</form>`);
				$subSelect = $modal.find('.sub-select');
				$channelSelect = $modal.find('.channel-select');
				$channelSelect.on('change', function(event){
					// console.log('select: ', event);
					var value = event.target.value;
					var xhr = new XMLHttpRequest();
					xhr.open('GET', `/v2/api/table/getByKeyName?dbName=MEIZU_CONTENTS&tableName=T_CONTENT_DIS&keyName=FCHANNEL_ID&keyValue=${value}`);
					xhr.addEventListener('load', function(){
						var res = JSON.parse(xhr.responseText);
						// console.log(res);
						if(res.code === 200){
							var options = [];
							for(var i = 0; i < res.value.length; i++){
								var item = res.value[i];
								options.push({
									name: item.FNAME,
									value: item.FID
								});
							}
							$subSelect.html(makeOptions(options));
						}else{
							alert(res.message);
						}
					})
					xhr.send();
				});
			}
		}
    ],
    pageNumber: 10,
    positions: [
    	{text: '首页', url: '/page/content/article'},
    	{text: '内容管理'},
    	{text: '内容库'}
    ]
}

new BasePage().init(config);