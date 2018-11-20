var enums = {
    /**
     * 根据值获取text
     * @param arrayName {!string} 枚举key
     * @param value {!number|string}
     * @returns {string}
     */
    getText: function (arrayName, value) {
        var array = enums[arrayName], text = '';

        if (!array) {
            console.error("名称为[" + arrayName + "]的数组不存在于枚举中");
        } else {
            if (_.isArray(array)) {
                $.each(array, function (i, n) {
                    if (n.value == value) {
                        text = n.text;
                    }
                }); 
            } else {
                for (var k in array) {
                    $.each(array[k], function (i, n) {
                        if (n.value == value) {
                            text = n.text;
                        }
                    });
                }   
            }
        }
        return text;
    },

    YES_NO: [
    	{value: false, text: '否'},
    	{value: true, text: '是'}
    ],
    RES_TYPE: [
    	{value: 1, text: 'LOFTER'},
    	{value: 2, text: 'UC'},
    	{value: 4, text: '魅族资讯'},
    	{value: 6, text: '魅族浏览器'},
    	/*{value: 8, text: 'SINA'},*/
    	{value: 16, text: '魅族视频'},
    	/*{value: 32, text: '魅族推荐'},*/
    	{value: 64, text: '腾讯新闻'},
    	{value: 65, text: '360视频'},
    	{value: 66, text: '腾讯浏览器'},
    	{value: 67, text: '橘子娱乐'},
    	{value: 68, text: '360搜索'},
    	{value: 69, text: '腾讯快报'},
    	{value: 70, text: '360文章'},
    	{value: 71, text: 'UC视频'},
    	{value: 72, text: '快手视频'},
    	{value: 73, text: '轻芒阅读'},
    	{value: 74, text: '优品'},
    	{value: 75, text: '英威诺'},
    	{value: 76, text: '百度'},
    	{value: 78, text: '凤凰网'},
    	{value: 79, text: '网易有料'},
    	{value: 80, text: '腾讯语音'},
    	{value: 81, text: '一点资讯'},
    	{value: 82, text: '唯彩看球'},
    	{value: 83, text: '唔哩头条'},
    	{value: 101, text: '里世界'},
    	{value: 102, text: '好兔视频'}
    ],
    RES_TYPE2: [
    	{value: 4, text: '魅族资讯'},
    	{value: 74, text: '优品'}
    ],
    /*CONTENT_CHANNEL: [
    	{value: 1, text: '推荐'},
    	{value: 2, text: '娱乐'},
    	{value: 3, text: '军事'},
    	{value: 4, text: '科技'}
    ],
    LIST_STYLE: [
    	{value: 1, text: '基本样式'},
    	{value: 2, text: '卡片'},
    	{value: 3, text: '专题卡片'},
    	{value: 4, text: '头图卡片'}
    ],*/
    CONTENT_TYPE: [
    	{value: 0, text: '图文'},
    	{value: 1, text: '文本'},
    	{value: 2, text: '图集'},
    	{value: 3, text: '视频'},
    	{value: 4, text: '多图'},
    	{value: 5, text: '专题'},
    	{value: 6, text: '推荐'},
    	{value: 7, text: '大图'},
    	{value: 8, text: '魅族大图'},
    	{value: 9, text: '搞笑'},
    	{value: 10, text: '段子'},
    	{value: 11, text: '短视频'}
    ],
    STATUS: [
//    	{value: 0, text: '未发布'},
    	{value: 0, text: '下架'},
    	{value: 1, text: '已发布'},
//    	{value: 2, text: '定时发布'},
    	{value: 3, text: '删除'},
//    	,
//    	{value: 4, text: '草稿'}
    	{value: 7, text: '敏感'}
    ],
    ORDER: [
    	{value: 'putdate', text: '上架时间'},
    	{value: 'viewCount', text: '浏览量'},
    	{value: 'conversionV1', text: '转化率'}
    ],
    CONTENT_SOURCE: [
    	{value: 1, text: '今日头条'},
    	{value: 2, text: '网易新闻'},
    	{value: 3, text: '凤凰新闻(爬)'},
    	{value: 4, text: '界面新闻'},
    	{value: 5, text: '搜狐新闻'}
    	//{value: 6, text: '网易有料'}
    ],
    TIME_SCOPE: [
    	{value: 1, text: '1日'},
    	{value: 3, text: '3日'},
    	{value: 7, text: '7日'},
    	{value: 15, text: '15日'},
    	{value: 30, text: '30日'},
    	{value: -1, text: '自定义'}
    ],
    CONTENT_AREA: [
    	{value: 1, text: '下发区'},
    	{value: 0, text: '置顶区'}
    ],
    GUID_CHANNEL: [
    	{value: 1, text: '魅族资讯'},
    	{value: 2, text: '魅族日历'},
    	{value: 3, text: '魅族浏览器'},
    	{value: 4, text: '魅族游戏中心'}
    ],
    APP_RESOURCE: [
    	{value: 1, text: '日历'},
    	{value: 2, text: '天气'},
    	{value: 3, text: '浏览器'},
    	{value: 4, text: '游戏中心'}
    ],
    COPY_URL: [
    	{value: 1, text: '资讯及其他'},
    	{value: 2, text: '浏览器'}
    ],
    COMMENT_SOURCE: [
    	{value: 1, text: '魅族资讯'},
    	{value: 2, text: '今日头条'},
    	{value: 3, text: '魅族资讯'},
    	{value: 4, text: '网易冷评论'},
    	{value: 5, text: '魅族资讯'},
    	{value: 6, text: 'UC冷评论'}
    ],
    SPAM_STATE: [
    	{value: 1, text: '举报'},
    	{value: 2, text: '算法'},
    	{value: 4, text: '重复'},
    	{value: 5, text: '网易盾'}
    ],
    COMMENT_FLAG: [
    	{value: 1, text: '正常'},
    	{value: 2, text: '已下架'}
    ],
    COMMENT_TIME_SCOE: [
    	{value: 1, text: '1日'},
    	{value: 3, text: '3日'},
    	{value: 7, text: '7日'},
    	{value: 15, text: '15日'},
    	{value: 30, text: '30日'},
    	{value: -1, text: '自定义'}
    ],
    RULE_STATUS: [
    	{value: 1, text: '未验证'},
    	{value: 2, text: '验证中'},
    	{value: 3, text: '验证成功'},
    	{value: 4, text: '验证失败'},
    ],
    SCRIPT_TYPE: [
    	{value: 1, text: '模板'},
    	{value: 2, text: '内置脚本'},
    	{value: 3, text: '外置脚本'},
    	{value: 4, text: '联接脚本'}
    ],
    BIZ: [
    	/*{value: 1, text: '魅族资讯'},*/
    	{value: 2, text: '魅族游戏'},
    	{value: 3, text: '魅族日历'},
    	{value: 4, text: '魅族闹钟'},
    	{value: 5, text: '魅族浏览器'}
    	/*{value: 6, text: '魅族评论'},
    	{value: 7, text: '魅族钱包'},*/
    ],
    FLOW_SOURCE: [
    	{value: 2, text: 'UC'},
    	{value: 32, text: '魅族推荐'},
    	{value: 64, text: '腾讯新闻'},
    	{value: 65, text: '360视频'}
    ]
};
