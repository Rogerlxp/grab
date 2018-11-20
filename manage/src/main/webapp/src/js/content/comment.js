/**
* config comment
*/
window.TIME_START_TEXT = '开始时间';
window.TIME_END_TEXT = '结束时间';
var delCommentId;
var revertCommentId;
var config= {
	fileds:[
		{
			name: 'articleId',
			text: '文章ID',
			type: 'text',
			actions: ['list', 'search', 'del']
		},
		{
			name: 'cpId',
			text: 'CP文章ID',
			type: 'text',
			width: '130px',
			actions: ['list', 'search']
		},
		{
			name: 'title',
			text: '文章标题',
			type: 'text',
			width: '200px',
			actions: ['list']
		},
		{
			name: 'userId',
			text: '用户ID',
			width: '100px',
			checkType: 'number',
			actions: ['list', 'search']
		},
		{
			name: 'userName',
			text: '用户名称',
			type: 'text',
			actions: ['list', 'search']
		},
		{
			name: 'content',
			text: '评论关键字',
			type: 'text',
			actions: ['search']
		},
		{
			name: 'id',
			text: '评论ID',
			type: 'number',
			actions: ['del']
		},
		{
			name: 'content',
			text: '评论详情',
			type: 'text',
			width: '290px',
			actions: ['list']
		},
		{
			name: 'from',
			text: '评论来源',
			type: 'select',
			enumName: 'COMMENT_SOURCE',
			actions: ['list', 'search']
		},
		{
			name: 'praise',
			text: '点赞数',
			checkType: 'number',
			actions: ['list']
		},
		{
			name: 'posttime',
			text: '发表时间',
			type: 'time',
			actions: ['list']
		},
		{
			name: 'flag',
			text: '状态',
			type: 'select',
			enumName: 'COMMENT_FLAG',
			actions: ['list', 'search']
		},
		{
			name: 'spamState',
			text: '下架原因',
			type: 'select',
			enumName: 'SPAM_STATE',
			actions: ['list', 'search']
		},
		{
			name: 'lmodifyUserName',
			text: '最后操作人',
			type: 'text',
			actions: ['list']
		},
        {
            name: 'scope',
            text: '范围',
            type: 'select',
            enumName: 'COMMENT_TIME_SCOE',
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
        	name: 'customScope',
        	text: '',
        	type: 'time',
        	actions: ['search']
        }
		],
	actions:[
		{action: 'search', text: '查询', url: '/service/comment/list', clz: 'info'},
		{
			action: 'revert', 
			text: function(rowData) {
				if(rowData.flag == 2){
					return '恢复';
				}else{
					return null;
				}
			}, 
			url: '/service/comment/revert', 
			clz: 'info',
			single: true,
			relativeFileds: ['articleId', 'userId', 'posttime'],
			callbackFn: function (data, $btn) {
				var id = data.attr('data-id');
				var articleId = data.attr('data-articleId');
				var userId = data.attr('data-userId');
				var posttime = data.attr('data-posttime');
				var comment = new Object();
				comment.id = id != undefined ? id : '';
				comment.articleId = articleId != undefined ? articleId : '';
				comment.userId = userId != undefined ? userId : '';
				comment.posttime = posttime != undefined ? posttime : '';
				$.ajax({
					url: '/service/comment/revert',
					type: 'POST',
					contentType: 'application/json;charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(comment),
					success: function(result){
						if(result.code == 200){
							MU.alert('恢复成功.', true);
						}else{
							MU.alert('恢复失败:\n' + result.message);
						}
					},
					error: function(){
						MU.alert('恢复失败:\n' + result.message);
					}
				});
			}
		},
		{
			action: 'customDel', 
			text: '删除', 
			url: '/service/comment/del', 
			clz: 'info', 
			single: true,
			relativeFileds: ['articleId', 'userId', 'flag'],
			callbackFn: function(data, $btn){
				var id = data.attr('data-id');
				var articleId = data.attr('data-articleid');
				var userId = data.attr('data-userid');
				var flag = data.attr('data-flag');
				var comment = new Object();
				comment.id = id != undefined ? id : '';
				comment.articleId = articleId != undefined ? articleId : '';
				comment.userId = userId != undefined ? userId : '';
				comment.flag = flag != undefined ? flag : '';
				$.ajax({
					url: '/service/comment/del',
					type: 'POST',
					contentType: 'application/json;charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(comment),
					success: function(result){
						console.log(result);
						if(result.code == 200){
							MU.alert('删除成功.', true);
							$('.ac-search').click();
						}else{
							MU.alert('删除失败:\n' + result.message);
						}
					},
					error: function(){
						MU.alert('删除失败:\n' + result.message);
					}
				});
			}
		},
		{
			action: 'batchRevert', 
			text: '批量恢复', 
			clz: 'info', 
			isBatch: true, 
			resetCheck: true,
			callbackFn: function (data, $btn) {
				$.ajax({
					url: '/service/comment/batchRevert',
					type: 'POST',
					contentType: 'application/json;charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(data),
					success: function(result){
						if(result.code == 200){
							MU.alert('批量恢复成功.', true);
						}else{
							MU.alert('批量恢复失败:\n' + result.message);
						}
					},
					error: function(){
						MU.alert('批量恢复失败:\n' + result.message);
					}
				});
			}
		},
		{
			action: 'batchDel', 
			text: '批量删除', 
			clz: 'info', 
			isBatch: true, 
			resetCheck: true,
			callbackFn: function (data, $btn) {
				$.ajax({
					url: '/service/comment/batchDel',
					type: 'POST',
					contentType: 'application/json;charset=utf-8',
					dataType: 'json',
					data: JSON.stringify(data),
					success: function(result){
						if(result.code == 200){
							MU.alert('批量恢复成功.', true);
						}else{
							MU.alert('批量恢复失败:\n' + result.message);
						}
					},
					error: function(){
						MU.alert('批量恢复失败:\n' + result.message);
					}
				});
			}
		}
	],
	pageNumber: 10,
    positions: [
    	{text: '首页', url: '/page/content/comment'},
    	{text: '内容管理'},
    	{text: '评论库'}
    ],
    isBatch: true,
    batchFields: ['articleId', 'id', 'flag', 'posttime', 'userId'],
    onPageFinished: function(){
    	$('.panel.manage-bottom').before('<div class="panel panel-default panel-body" style="color: red;font-size: 14px;line-height: 1.42857143;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;">说明：因冷评论数据量日均百万，所以此页面只展示Flyme用户自撰评论，CP具体冷评论数据请通过“文章ID”、“CP文章ID”先定位到具体文章，再筛选查找</div>');
    }
}

var page =new BasePage();
page.init(config);