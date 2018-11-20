/**
 * @author Stone (shiquan@meizu.com)
 * @date 2015-5-23
 * @desc 可重用代码提取，包括插件、逻辑、业务三块
 */

// 插件相关
var pluginUtil = {

    /**
     * 初始化时间控件，包括日期和时间；根据元素data-type属性值来判定
     * @param $first {jquery object} 需要初始化的元素
     * @param type {string} minDate或maxDate
     * @param $compare {jquery object} 进行比较的元素
     */
    datePicker: function($first, type, $compare, conf) {
        if ( $first.attr('data-type') == 'time' ) {
            $first.datetimepicker({
                closeText: '清除',
                currentText:"现在",
                dateFormat: "yy-mm-dd",
                timeFormat: conf && conf.timeFormat || "HH:mm:ss",
                showSecond: !(conf && conf.showSecond === false),
                onSelect: function (dateText, inst) {
                    var date = $.datepicker.parseDateTime('yy-mm-dd', 'HH:mm:ss', dateText);
                    if ( $compare ) {
                        var dateCompare = $compare.val()
                            && $.datepicker.parseDateTime('yy-mm-dd', 'HH:mm:ss', $compare.val());

                        if ( (type.indexOf('min') != -1 && dateCompare && date.getTime() > dateCompare.getTime())
                                || (type.indexOf('max') != -1 && dateCompare && date.getTime() < dateCompare.getTime()) ) {
                            $.datepicker._setDateDatepicker($first[0], $compare.val());
                        }
//                        $compare.datetimepicker('option', type, date);
                    }
                },
                beforeShow: function(input, inst) {
                    pluginUtil.dpCurrentInput = input;
                }
            });
        } else {
            $($first).datepicker({
                dateFormat: 'yy-mm-dd',
                currentText:"今天",
                closeText: '清除',
                prevText: '前一月',
                nextText: '后一月',
                maxDate: conf && conf.maxDate || '',
                minDate: conf && conf.minDate || '',
                changeYear: true,
                yearRange:'2009:+10',
                changeMonth: true,
                monthNamesShort: [ '1', '2', '3',
                    '4', '5', '6', '7', '8', '9', '10', '11', '12' ],
                dayNamesMin: [ '日', '一', '二', '三', '四', '五', '六' ],
                changeselect: true,
                showButtonPanel:true,
                onSelect: function (dateText) {
                    $compare && $compare.datepicker('option'
                        , type, $.datepicker.parseDate('yy-mm-dd', dateText));
                },
                beforeShow: function(input, inst) {
                    pluginUtil.dpCurrentInput = input;
                }
            });
        }

        $("#ui-datepicker-div").on("click", ".ui-datepicker-close", function(){
            pluginUtil.dpCurrentInput.value = '';
        });
    },

    /**
     * 开始和结束日期时间初始化
     * @param $start 开始时间
     * @param $end 结束时间
     */
    normalDatePicker: function($start, $end){
        pluginUtil.datePicker($start, 'minDate', $end);
        pluginUtil.datePicker($end, 'maxDate', $start);
    },

    /**
     * 取色器初始化
     * @param $color {!jquery object}
     */
    colorPicker: function ($color) {
        $color.click(function (evt) {
            if ( evt.target !== this ) return;
            $color.colpick({
                onSubmit: function(hsb, hex, rgb){
                    var color = '#' + hex;
                    $color.css("background-color", color)
                        .data('colpickId','')
                        .next().val(color).trigger('blur');
                    $(".colpick.colpick_full").remove();
                }
            }).colpickSetColor($color.next().val());
        });
    },

    /**
     * 初始化上传控件，优先使用h5方式上传
     * @param $icon {jquery object} 需要初始化的元素
     * @param config {object} 参数控制：{type: ['.jpg','.png'], cb: function, size: '2MB'}
     */
    upload: function($icon, config){
        if (window.FormData) {
            $icon.html5uploader({
                auto: true,
                multi: true,
                removeTimeout: 9999999,
                url: config.url || '/service/common/upload',
                fileTypeExts: config.type.join(','),
                onUploadStart: function () {
                    $('.filelist').hide();
                },
                onInit: function () {},
                onUploadError: function () {},
                onUploadComplete: function (file, data) {
                    config.cb && config.cb(data);
                }
            });
        } else {
            $icon.uploadify({
                // flash文件的相对路径
                'swf': "../../plugin/uploadify/uploadify.swf",
                // 后台处理程序的相对路径
                'uploader': "/service/common/upload",
                'width': '86',
                'height': '86',
                // 设置上传文件名称,默认为Filedata
                'fileObjName': '图标',
                // 文件大小限制
                'fileSizeLimit': config.size,
                // 文件队列的ID，该ID与存放文件队列的div的ID一致
                'queueID': "icon_progress",
                // 用来设置选择文件对话框中的提示文本
                'fileTypeDesc': config.type.join('文件,') + '文件',
                // 设置可以选择的文件的类型
                'fileTypeExts': '*' + config.type.join(','),
                // 设置为true当选择文件后就直接上传了，为false需要点击上传按钮才上传
                'auto': true,
                // 设置为true时可以上传多个文件
                'multi': false,
                'queueSizeLimit': 1,
                'buttonImage': '../../image/quick-icon.jpg',
                // 浏览按钮的文本，默认值：BROWSE
                'buttonText': '',
                // 上传队列显示的数据类型，percentage是百分比，speed是上传速度
                'progressData': 'percentage',
                // 回调函数
                'onUploadError': function (file, errorCode, errorMsg) {
                    if (errorMsg.indexOf("500") >= 0) {
                        manageUtil.alert("上传服务器出错");
                    }
                },
                'onSelectError': function (file, errorCode, errorMsg) {
                    if (errorMsg.indexOf("size") >= 0) {
                        manageUtil.alert("上传的文件大小超过限制，不得超过" + config.size);
                    } else if (errorMsg.indexOf("type") >= 0) {
                        manageUtil.alert("上传的文件类型不正确");
                    }
                    return false;
                },
                'onUploadSuccess': function (file, data) {
                    config.cb && config.cb(data);
                }
            });
        }
    },

    uploadFile: function($icon, cb) {
        if ($icon.hasClass('img')) {
            pluginUtil.uploadImg($icon, cb)
        } else {
            pluginUtil.upload($icon, {
                cb: cb,
                type: []
            })
        }
    },

    uploadImg: function($icon, cb){
        pluginUtil.upload($icon, {
            type: ['.jpg', '.png'],
            cb: cb,
            size: '1MB'
        });
    },

    uploadExcel: function($icon, cb){
        pluginUtil.upload($icon, {
            type: ['.xls'],
            cb: cb,
            size: '1MB'
        });
    },

    uploadApk: function($icon, cb){
        pluginUtil.upload($icon, {
            type: ['.apk', '.APK'],
            cb: cb,
            size: '500MB',
            url:'/apps/upload'
        });
    },



    /**
     * 初始化datatable
     * @param settings {object} datatable 参数设置
     *      tableId {string} 表格id
     *      ajaxUrl {url} 加载数据接口
     *      pageCount {number} 每页显示数量
     *      refresh {boolean} 是否重新加载，即返回到第一页
     *      cb {function} 完成加载数据后的回调，一般为填充表格数据
     *      commonPage {CommonPage} 通用页面对象
     *      argument {array} 查询参数
     */
    dataTable: function(settings) {
        //manageUtil.requestStart();

        var _table = settings.tableId || "data-table",
            _count = settings.pageCount,
            callback = settings.cb || $.noop,
            cols = settings.cols,
            order = settings.order;

        if (pluginUtil.ooTable && settings.refresh !== true) {
            pluginUtil.ooTable.draw(false);
            return;
        }

        pluginUtil.ooTable && pluginUtil.ooTable.destroy();
        pluginUtil.ooTable = $('#' + _table).DataTable({
            lengthChange: true,
            searching: false,
            autoWidth: false,
            order: order.order,
            ordering: order.ordering,
            pageLength: _count,
            language: {
                "decimal":        "",
                "emptyTable":     "未查询到符合条件的数据。",
                "info":           "显示 _START_ 到 _END_ 条记录，共_TOTAL_条。",
                "infoEmpty":      "显示 0 到 0 条记录，共 0 条。",
                "infoFiltered":   "",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "每页显示 _MENU_ 条",
                "loadingRecords": "正在加载...",
                "processing":     "正在呈现...",
                "search":         "查询:",
                "zeroRecords":    "未查询到符合条件的数据。",
                "paginate": {
                    "first":      "首页",
                    "last":       "尾页",
                    "next":       "下一页",
                    "previous":   "上一页"
                },
                "aria": {
                    "sortAscending":  ": 升序排列",
                    "sortDescending": ": 降序排列"
                }
            },
            serverSide: true,
            ajax: {
                url: settings.ajaxUrl,
                data: function (data) {
                    return $.extend(data, settings.argument);
                },
                dataSrc: function (json) {
                    return callback(json, settings.commonPage);
                }
            },
            columns: cols
        });
    }
}
var PU = pluginUtil;

// 逻辑相关工具类方法，要求0耦合，可100%移植到任何项目
var commonUtil = {

    /**
     * 除去参数中值为空的参数
     * @param params {array} [{name: '', value: ''}]
     * @returns {object} 除去了为空参数的数组
     */
    removeEmptyParam: function (params) {
        var data = {};
        $.each(params, function(idx, item){
            if (item.value) {
                data[item.name] = item.value;
            }
        });

        return data;
    },

    getCookie: function (name) {
        var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)")
        if(arr = document.cookie.match(reg))
        return decodeURIComponent(arr[2])
        else return null
    },

    /**
     * 从url中获取参数值
     * @param key {string} 需要获取值的名称
     * @returns {*} 未取到值返回null
     */
    getUrlParam: function(key, url) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i"),
            r = (url && url.split('?')[1] || window.location.search.substr(1)).match(reg);

        if (r != null) return decodeURI(r[2]);

        return null;
    },

    /**
     * 限制输入数字
     * @param contain {selector} 需要进行限制输入元素的父容器
     * @param sel {selector} 需要进行限制输入元素
     */
    numCheck: function(contain, sel){
        $(contain).on("keyup  paste", sel, function(){
            $(this).val($(this).val().replace(/[^0-9]/g,''));
        });
    },

    /**
     * 将字符串进行html编码
     * @param str {string} 编码前
     * @returns {*} 编码后
     */
    encodeScript: function(str){
        return $('<div></div>').text(str)[0].innerHTML;
    },

    // base64转换工具
    base64Tool: {
        base64encodechars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        base64decodechars: new Array(
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
            -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1),
        base64encode: function (str) {
            var out, i, len;
            var c1, c2, c3;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += Base64Tool.base64encodechars.charAt(c1 >> 2);
                    out += Base64Tool.base64encodechars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += Base64Tool.base64encodechars.charAt(c1 >> 2);
                    out += Base64Tool.base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                    out += Base64Tool.base64encodechars.charAt((c2 & 0xf) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += Base64Tool.base64encodechars.charAt(c1 >> 2);
                out += Base64Tool.base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                out += Base64Tool.base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
                out += Base64Tool.base64encodechars.charAt(c3 & 0x3f);
            }
            return out;
        },
        base64decode: function (str) {
            var c1, c2, c3, c4;
            var i, len, out;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {

                do {
                    c1 = Base64Tool.base64decodechars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c1 == -1);
                if (c1 == -1)
                    break;

                do {
                    c2 = Base64Tool.base64decodechars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c2 == -1);
                if (c2 == -1)
                    break;
                out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61)
                        return out;
                    c3 = Base64Tool.base64decodechars[c3];
                } while (i < len && c3 == -1);
                if (c3 == -1)
                    break;
                out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));

                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61)
                        return out;
                    c4 = Base64Tool.base64decodechars[c4];
                } while (i < len && c4 == -1);
                if (c4 == -1)
                    break;
                out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            return out;
        },
        utf16to8: function (str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007f)) {
                    out += str.charAt(i);
                } else if (c > 0x07ff) {
                    out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
                } else {
                    out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
                }
            }
            return out;
        },
        utf8to16: function (str) {
            var out, i, len, c;
            var char2, char3;
            out = "";
            len = str.length;
            i = 0;
            while (i < len) {
                c = str.charCodeAt(i++);
                switch (c >> 4) {
                    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += str.charAt(i - 1);
                    break;
                    case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                    break;
                    case 14:
                        // 1110 xxxx  10xx xxxx  10xx xxxx
                        char2 = str.charCodeAt(i++);
                        char3 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x0f) << 12) |
                            ((char2 & 0x3f) << 6) |
                            ((char3 & 0x3f) << 0));
                        break;
                }
            }
            return out;
        }
    },

    /**
     * 获取脚本资源
     * @param urls {!array} 需加载的url列表
     * @param cb {?fn} 加载完成后的回调
     * @param idx {?number} 加载资源在列表中的索引
     */
    getResources: function(urls, cb, idx){
        if (!urls || !urls.length) {
            _.isFunction(cb) && cb();
            return;
        }

        idx = idx || 0;
        if (idx >= urls.length) {
            _.isFunction(cb) && cb();
        } else {
            var url = urls[idx];
            if (/.*\.css$/.test(url)) {
                $('head').append('<link rel="stylesheet" href="' + url + '"></link>');
                commonUtil.getResources(urls, cb, ++idx);
            } else {
                $.getScript(urls[idx], function(){
                    commonUtil.getResources(urls, cb, ++idx);
                });
            }
        }
    }
}
var CU = commonUtil;

// 业务相关，可高度重用的业务代码
var manageUtil = {

    /**
     * underscore template
     * @param templateId {!string} 模板id
     * @param data {?object} data
     * @param settings {?object}
     */
    tpl: function (templateId, data, settings) {
        return _.template($('#' + templateId).html(), settings || {variable: 'data'})(data || {});
    },

    /**
     * bs modal alert
     * @param msg {*} 提示消息
     * @param autoOut {?boolean} 是否自动隐藏
     * @param callback {?fn} 点击确定后的回调
     * @param title {?string} 提示框title，默认为‘提示’
     */
    alert: function (msg, autoOut, callback, title) {
        if ( _.isFunction(autoOut) ) {
            title = callback;
            callback = autoOut;
        }

        var commonShow = $('#common-modal').is(':visible');
        if ( commonShow ) {
            $('#common-modal').hide();
            $('.modal-backdrop.in:first').hide();
        }
        $('#alert-modal').modal('show');

        $('.alert-cancel').hide();
        title && $('#alert-label').text(title);
        $('#alert-body').html(msg);

        $('.alert-sure').off('click').on('click', function(){
            $('#alert-modal').modal('hide');
            if ( commonShow ) {
                $('#common-modal').show();
                $('.modal-backdrop.in:first').show();
            }
            _.isFunction(callback) && callback();
        });

        autoOut === true && setTimeout(function(){
            $('#alert-modal').modal('hide');
        }, 1000);
    },

    /**
     * bs modal confirm
     * @param msg {*} 提示消息
     * @param callback {?fn} 点击确定后的回调
     * @param title {?string} 提示框title，默认为‘提示’
     */
    confirm: function(msg, callback, title){
        var commonShow = $('#common-modal').is(':visible');
        if ( commonShow ) {
            $('#common-modal').hide();
            $('.modal-backdrop.in:first').hide();
        }
        $('#alert-modal').modal('show');

        $('.alert-cancel').show();
        title && $('#alert-label').text(title);
        $('#alert-body').html(msg);

        $('.alert-sure').off('click').on('click', function(){
            $('#alert-modal').modal('hide');
            if ( commonShow ) {
                $('#common-modal').show();
                $('.modal-backdrop.in:first').show();
            }
//            setTimeout(function(){
                _.isFunction(callback) && callback();
//            }, 0);
        });
    },

    /**
     * 初始化下拉选择框，包括设置选项和选择事件绑定
     * @param $sel {jquery object} 需要初始化的元素
     * @param data {array} 可选项 [{value: xx, text: 'xx'}]
     * @param selected {*} 初始化完成后需要选中的值
     * @param container {jquery object} 下拉框所在容器
     * @param onSelect {function} 下来选择后的回调
     */
    initSelect: function($sel, data, selected, container, onSelect) {
        var opts = [],
            _clone = $.extend(true, [], data),
            attr = ($sel.attr('data-enum-attr') || '').split(',');

        $sel.attr('data-sel-all') !== 'false' && _clone.unshift({value: '', text: '全部'});
        $.each(_clone, function (idx, item) {
            var attrHtml = [];
            $.each(attr, function () {
                if (!this) return;
                attrHtml.push('data-' + this + '="' + item[this] + '"');
            });
            opts.push([
                '<li role="presentation">',
                    '<a role="menuitem" tabindex="-1" href="javascript:void(0);" ',
                        attrHtml.join(''), ' value="',
                        item.value, '">', item.text, '</a>',
                '</li>'].join(''));
        });
        $sel.empty().append(opts.join(''));

        $sel.off('click').on('click', 'a[role="menuitem"]', function () {
            onSelect && onSelect($(this));
            $(this).parents('.btn-group').find('.dropdown-text').text($(this).text());
            $(this).parents('.btn-group').siblings('input:hidden').val($(this).attr('value')).trigger('value-change').trigger('blur');
        });

        selected !== undefined && $('a[role="menuitem"][value="' + selected + '"]', $sel).trigger('click');

        if (selected === null) { //清空下级
            var cleanAll = function ($ul) {
                var inpVal = $ul.parent().siblings('input:hidden').val();
                if (!$ul.length/* || _.find(_clone, function (item) {
                    return item.value == inpVal;
                })*/) return;

                $ul.siblings(':first').find('.dropdown-text').text('请选择');
                var name = $ul.parent().siblings('input:hidden').val('').attr('name');
                container && cleanAll(container.find('[data-enum-parent="' + name + '"]').empty());
            }

            cleanAll($sel);
        }
    },

    /**
     * 枚举类型下拉框初始化，枚举key值以data-enum属性获取
     * @param $sel {jquery object} 需要初始化的元素
     * @param selected {*} 初始化完成后需要选中的值
     * @param onSelect {function} 下来选择后的回调
     * @param parentValue {?string} 父级值
     */
    initEnumSelect: function($sel, selected, onSelect, parentValue){
        var _enums = enums[$sel.attr('data-enum')];

        if (!_.isArray(_enums)) {
            var _values = [];
            for (var k in _enums) {
                if (parentValue !== undefined) {
                    if (parentValue == k) {
                        _values = _enums[k];
                    }
                } else {
                    _values = _values.concat(_enums[k]);    
                }
            }
            _enums = _values;
        }

        if ( !_enums ) {
            console.error('未找到枚举：' + $sel.attr('data-enum'));
            return;
        }

        manageUtil.initSelect($sel, _enums, selected, null, onSelect);
    },

    /**
     * ajax类型下拉框初始化
     * @param $sel {jquery object} 需要初始化的元素
     * @param conf.url {url} 获取选项值接口的url
     * @param selected {*} 初始化完成后需要选中的值
     * @param conf.id {?string} 对应枚举value中的字段名称
     * @param conf.name {?string} 对应枚举text中的字段名称
     * @param conf.param {?object} 请求枚举附加参数
     * @param conf.parentValue {?string} 父级值
     */
    initAjaxSelect: function($sel, conf, selected){
        var data = conf.param || {};
        if (conf.parentValue) {
            data[$sel.attr('data-enum-parent')] = conf.parentValue;
        }
        $.ajax(conf.url, {
            data: data,
            async: false,
            success: function(bd){
                if ( bd.code != 200 ) return;

                if(!!bd.value['data']){
                    bd.value = bd.value['data']
                }
                $.each(bd.value, function () {
                    conf.id && (this.value = this[conf.id]);
                    conf.name && (this.text = this[conf.name]);
                });
                conf.selMap && (conf.selMap[conf.filedName] = $.extend(true, {}, bd.value));
                manageUtil.initSelect($sel, bd.value, selected, conf.container, conf.onSelect);
            }
        });
    },

    /**
     * 级联下拉框初始化
     * @param $sel {jquery object} 需要初始化的元素
     * @param $parent {jquery object} 父节点
     * @param conf.url {url} 获取选项值url
     */
    initParentSelect: function ($sel, $parent, conf) {
        $parent.off('value-change').on('value-change', function () {
            if (enums[conf.enumName]) {
                manageUtil.initSelect($sel, 
                    enums[conf.enumName][$parent.val()] || [], null, null, conf.onSelect);
            } else {
                var param = {};
                param[$parent.attr('name')] = $parent.val();
                manageUtil.initAjaxSelect($sel, {
                    url: conf.enumName,
                    param: $.extend(param, conf.paramFn && conf.paramFn() || {}),
                    id: conf.id,
                    name: conf.name,
                    filedName: conf.filedName,
                    container: conf.container,
                    onSelect: conf.onSelect
                }, null);
            }
        });
    },

    /**
     * checkbox多选初始化
     * @param $check {jquery object} 初始化的checkbox容器
     * @param enumDatas {array} 枚举数据
     */
    initCheckbox: function ($check, enumDatas) {
        var _html = [],
            data = $check.data(),
            value = data.enumId || 'value',
            text = data.enumText || 'text',
            name = data.name,
            selAllId,
            $value = $check.find('[name='+name+'_check]'),
            values = ($value.val() || '').split(CONSTANTS.CHECKBOX_SPLIT),
            isSearch = $check.parent().hasClass('input-group')

        for (var i = 0; i < enumDatas.length; i++) {
            var d = enumDatas[i]
            var id = name + '_' + d[value]
            _html.push('<div><input type="checkbox" id="' + id + '" name="' + name + '" value="' + d[value] + '" ')
            _html.push($.inArray(d[value]+'', values) != -1 ? 'checked ' : '')
            _html.push('/><label for="' + id + '" title="' + d[text] + '">' + d[text] + '</label></div>')
        }

        if (data.selAll) {
            selAllId = 'selAll_' + name + (isSearch ? '_search' : '')
            _html.unshift('<div class="sel-all"><input type="checkbox" id="' 
                + selAllId + '" /><label for="' + selAllId + '">全选</label></div>')
        }

        $check.append(_html.join(''))
        
        if (isSearch) {
            $check.parent().append('<div class="select-check"><span class="select-vals"></span><span class="caret"></span></div>')
            $check.next().off('click').click(function() {
                $(this).prev().toggleClass('show')
            })
        }

        var $items = $check.find('input[type=checkbox]:not(#' + selAllId + ')')
        $check.find(':checkbox').off('click').click(function(){
            setTimeout(function(){
                var vs = []
                var ts = []
                $items.filter(':checked').each(function(){
                    vs.push($(this).val())
                    ts.push($(this).next().html())
                })
                $value.val(vs.join(CONSTANTS.CHECKBOX_SPLIT))
                if ($check.next().hasClass('select-check')) {
                    $check.next().find('.select-vals').text(ts.join(','))
                }
            }, 0)
        })

        if (selAllId) {
            $('#' + selAllId).click(function(){
                var _checked = $(this).is(':checked')
                $items.prop('checked', _checked)
            })
        }
    },

    /**
     * 图片上传完成后的回调
     * @param $icon {jquery object} 上传按钮
     * @param url {url} 上传图片返回的url
     */
    fileUploaded: function($icon, url){
        var tpl = $icon.hasClass('img') ? 'img-upd-tpl' : 'file-upd-tpl'
        var type = $icon.hasClass('img') ? 'img' : 'file'
        $icon.hide().after(MU.tpl(tpl, {url: url, type: type}));
        $icon.siblings('.url-hide').val(url);

        $('.J-del-img', $icon.siblings('.modify-icon')).click(function(){
            $(this).parent().siblings('.browse-file').show();
            $(this).parent().remove();
        });
    },

    editorInit: function (_html, config, disable) {
        var E = window.wangEditor
        // set it global, somewhere need to manipulate this variable.
        window.now_editor = new E('#editor')
        window.now_editor.customConfig.onchange = function (html) {
            // html 即编辑器中的内容
            $('.editorval').val(html)
        }
        window.now_editor.customConfig.onfocus = function (html) {
            // html 即编辑器中的内容
            $('.w-e-text-container').css({border:'1px solid #428bca'})
        }
        window.now_editor.customConfig.onblur = function (html) {
            // html 即编辑器中的内容
            $('.w-e-text-container').css({border:'1px solid #3c763d'})
        }

        window.now_editor.customConfig.zIndex = 10
        window.now_editor.customConfig.uploadImgServer = config.url || '/service/common/upload'  // 上传图片到服务器        
        window.now_editor.customConfig.uploadImgHooks = {
            // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
            // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
            customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                if (result.code !== 200) return alert('图片上传失败！')
                var url = result.value
                insertImg(url)
                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        }
        window.now_editor.create({})
        window.now_editor.txt.html(_html)
        if(disable) window.now_editor.$textElem.attr('contenteditable', false)
    },  

    buildNav: function (data, divider) {
        var nav = [];
        $.each(data, function (idx, item) {
            var link = [];
            if (item.children) {
                link.push('<li class="dropdown">');
                link.push('<a href="javascript:" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"')
                link.push(' aria-expanded="false">' + item.name + '<span class="caret"></span></a>');
                link.push('<ul class="dropdown-menu">');
                link.push(manageUtil.buildNav(item.children, true));
                link.push('</ul></li>');
            } else {
                link.push('<li data-page="' + MU.getPage(item.location) + '"><a href="' + (item.location || 'javascript:') + '">' + item.name + '</a></li>');
                divider && idx != data.length - 1 && link.push('<li role="separator" class="divider"></li>');
            }
            nav.push(link.join(''));
        });

        return nav.join('');
    },

    getPage: function (url) {
        if (!url) {
            url = window.location.pathname
        }

        return url.replace(/^(\/v2)?\/page/, '')
    }
};
var MU = manageUtil;

var CONSTANTS = {
    DEFAULT_HREF: 'javascript:void(0);',
    SEARCH_TIME_START: '_start',
    SEARCH_TIME_END: '_end',
    TIME_START_HOLDER: '-开始',
    TIME_END_HOLDER: '-结束',
    TIME_START_TEXT: '(>=)',
    TIME_END_TEXT: '(<=)',
    CHECKBOX_SPLIT: ',,,,,',
    VALID_TIP: '请按照规则填写表单信息.'
}

Date.prototype.format = function (format) {
    /*
     * format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

$(function () {
    var page = MU.getPage();
    page && $.getScript('/src/js' + page + '.js');

    // 回车搜索
    $('form[role="search"]').on('keydown', ':text', function(evt){
        if ( evt.which == 13 ) {
            // 防止弹出新增界面
            $(this).blur();
            $(".opt-search").trigger("click");
        }
    });

    $(document).ajaxComplete(function (event, xhr, settings) {
        var result = {}
        try {
            result = JSON.parse(xhr.responseText)
        } catch(e) {}
        if (result.code == 401) {
            var l = encodeURIComponent(window.location.href)
            window.location = 
                'https://login.flyme.cn/login/login.html?service=NEWS&appuri=' 
                + l + '&useruri=' + l + '&sid=unionlogin';
        } else if (result.code == 403) {
            MU.alert('无操作权限', true)
        }
    })

    $.getJSON('/src/menu.json', function (json) {
        $('#nav-menu').append(MU.buildNav(json));
        var pageMenu = $('li[data-page="' + page + '"]');
        var addSelect = function ($select) {
            $select.addClass('selected').siblings().removeClass('selected');
            if ($select.parent().parent().hasClass('dropdown')) {
                addSelect($select.parent().parent());
            }
        }
        addSelect(pageMenu);

        $('a.dropdown-toggle', '#nav-menu').click(function (e) {
            if ($(this).parent().parent().hasClass('dropdown-menu')) {
                e.preventDefault();
                e.stopPropagation();

                $(this).parent().toggleClass('open');
            }
        })

        // auth control
        var removeAuth = function ($auth) {
            var $parent = $auth.parent();
            var $prev = $auth.prev();
            var $next = $auth.next();
            
            $auth.remove();
            $prev.hasClass('divider') && $prev.remove();
            $next.hasClass('divider') && $next.remove();

            if (($parent.hasClass('dropdown-menu') && !$parent.find('li[data-page]').length)
                    || $parent.hasClass('dropdown')) {
                removeAuth($parent)
            }
        };
        $.get('/service/user/auth/list', function (result) {
            var auths = result.value
            $('[data-page]').each(function () {
                var $li = $(this)
                if (!_.contains(auths, '/page' + $li.data('page')) && !_.contains(auths, '/v2/page' + $li.data('page'))) {
                    removeAuth($li)
                }
            })
        });
    });

    $('#adminName').text(CU.getCookie('uname') || '');
});
