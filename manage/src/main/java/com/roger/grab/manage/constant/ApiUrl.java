package com.roger.grab.manage.constant;

/**
 * 接口请求路径
 * @author anyuan
 * @date 2017-06-21 16:42:11
 */
public class ApiUrl {

	// ====================================公共接口==================================================================
	public static final String COMMON_UPLOAD = "/service/common/upload";
	
	public static final String COMMON_CHANNALS = "/service/common/channals";

	// ====================================用户权限基础接口=============================================================
	public static final String AUTH_RES_INFO = "/service/res/info";

	public static final String AUTH_RES_LIST = "/service/res/list";

	public static final String AUTH_RES_COUNT = "/service/res/count";

	public static final String AUTH_RES_ADD = "/service/res/add";

	public static final String AUTH_RES_UPD = "/service/res/upd";

	public static final String AUTH_RES_DEL = "/service/res/del";

	public static final String AUTH_ROLE_INFO = "/service/role/info";

	public static final String AUTH_ROLE_LIST = "/service/role/list";

	public static final String AUTH_ROLE_COUNT = "/service/role/count";

	public static final String AUTH_ROLE_ADD = "/service/role/add";

	public static final String AUTH_ROLE_UPD = "/service/role/upd";

	public static final String AUTH_ROLE_DEL = "/service/role/del";

	public static final String AUTH_ROLE_RES_LIST = "/service/role/res/list";

	public static final String AUTH_ROLE_RES_ADD = "/service/role/res/add";

	public static final String AUTH_USER_LIST = "/service/user/list";

	public static final String AUTH_USER_COUNT = "/service/user/count";

	public static final String AUTH_USER_ADD = "/service/user/add";

	public static final String AUTH_USER_UPD = "/service/user/upd";

	public static final String AUTH_USER_DEL = "/service/user/del";

	public static final String AUTH_USER_INFO = "/service/user/info";

	public static final String AUTH_USER_ROLE_LIST = "/service/user/role/list";

	public static final String AUTH_USER_AUTH_LIST = "/service/user/auth/list";

	public static final String AUTH_USER_ROLE_ADD = "/service/user/role/add";

	public static final String BSDATA_INFO = "/service/bsdata/info";

	public static final String BSDATA_LIST = "/service/bsdata/list";

	public static final String BSDATA_COUNT = "/service/bsdata/count";

	public static final String BSDATA_ADD = "/service/bsdata/add";

	public static final String BSDATA_UPD = "/service/bsdata/upd";

	public static final String BSDATA_DEL = "/service/bsdata/del";

	public static final String BSDATA_TYPE_LIST = "/service/bsdata/type/list";

	public static final String BSDATA_TYPE_ADD = "/service/bsdata/type/add";

	public static final String PARAM_LIST = "/service/param/list";

	public static final String PARAM_INFO = "/service/param/info";

	public static final String PARAM_COUNT = "/service/param/count";

	public static final String PARAM_ADD = "/service/param/add";

	public static final String PARAM_UPD = "/service/param/upd";

	public static final String PARAM_DEL = "/service/param/del";

	// ====================================业务接口=============================================================
	public static final String ARTICLE_INFO = "/service/article/info";

	public static final String ARTICLE_LIST = "/service/article/list";

	public static final String ARTICLE_SCHEME = "/service/article/scheme";

	public static final String ARTICLE_URL = "/service/article/url";

	public static final String ARTICLE_RELEASE = "/service/article/release";

	public static final String ARTICLE_NOTRELEASE = "/service/article/notrelease";
	
	public static final String ARTICLE_EDITOR = "/service/article/editor";
	
	public static final String ARTICLE_ADD = "/service/article/add";
	
	public static final String VIDEO_PLAY_URL = "/service/article/playurl";
	
	public static final String SYNC_CONTENT = "/service/article/syncContent";
	
	public static final String SYNC_CONTENT_CP = "/service/article/syncContent/cp";
	
	public static final String COMMENT_LIST = "/service/comment/list";

	public static final String COMMENT_REVERT = "/service/comment/revert";

	public static final String COMMENT_DEL = "/service/comment/del";

	public static final String COMMENT_BATCHREVERT = "/service/comment/batchRevert";

	public static final String COMMENT_BATCHDEL = "/service/comment/batchDel";

	public static final String ARTICLE_SPECIAL_ADD = "/service/article/special/add";

	public static final String ARTICLE_SPECIAL_LIST = "/service/article/special/list";

	public static final String ARTICLE_SPECIAL_DEL = "/service/article/special/del";

	public static final String RULE_INFO = "/service/rule/info";

	public static final String RULE_LIST = "/service/rule/list";

	public static final String RULE_ADD = "/service/rule/add";

	public static final String RULE_UPD = "/service/rule/upd";

	public static final String RULE_DEL = "/service/rule/del";

	public static final String SCRIPT_INFO = "/service/script/info";

	public static final String SCRIPT_LIST = "/service/script/list";

	public static final String SCRIPT_ADD = "/service/script/add";

	public static final String SCRIPT_DEL = "/service/script/del";

	public static final String RULE_SCRIPT_LIST = "/service/rule/script/list";

	public static final String RULE_SCRIPT_UPD = "/service/rule/script/upd";
	
	public static final String BIZ_FLOW_INFO = "/service/biz/flow/info";
	
	public static final String BIZ_FLOW_LIST = "/service/biz/flow/list";
	
	public static final String BIZ_FLOW_ADD = "/service/biz/flow/add";
	
	public static final String BIZ_FLOW_UPD = "/service/biz/flow/upd";
	
	public static final String BIZ_FLOW_DEL = "/service/biz/flow/del";
	
	public static final String BIZ_CONTENTS_DEL = "/service/biz/contents/del";
	
	public static final String BIZ_CONTENTS_ADD = "/service/biz/contents/add";
	
	public static final String BIZ_CONTENTS_INFO = "/service/biz/contents/info";
	
	public static final String BIZ_CONTENTS_LIST = "/service/biz/contents/list";
	
	public static final String BIZ_CONTENTS_SEARCH = "/service/biz/contents/search";
	
	public static final String BIZ_CONTENTS_UPD = "/service/biz/contents/upd";
	
	public static final String BIZ_CONTENTS_STATUS= "/service/biz/contents/status";
	
	public static final String BIZ_CONTENTS_GRAB= "/service/biz/contents/grab";
	
	public static final String BIZ_CONTENTS_CACHE = "/service/biz/contents/cache";
	
	public static final String BIZ_CP_LIST = "/service/biz/cp/list";
	
	public static final String BIZ_CONTENTS_SYNC_BAIDU = "/service/biz/contents/sync/baidu";
	
	public static final String BIZ_CONTENTS_CATEGORY_BAIDU = "/service/biz/contents/category/baidu";

	public static final String BIZ_CP_DETAIL = "/service/biz/cp/detail";
	
	public static final String BIZ_CP_ADD = "/service/biz/cp/add";
	
	public static final String BIZ_CP_UPDATE = "/service/biz/cp/update";
	
	public static final String BIZ_CP_DEL = "/service/biz/cp/del";
	
	public static final String BIZ_GRAB_LIST= "/service/biz/grab/list";
	
	public static final String BIZ_GRAB_DETAIL= "/service/biz/grab/detail";
	
	public static final String BIZ_GRAB_ADD= "/service/biz/grab/add";
	
	public static final String BIZ_GRAB_UPDATE= "/service/biz/grab/update";
	
	public static final String BIZ_GRAB_DEL= "/service/biz/grab/del";
	
	public static final String BIZ_GRAB_TEST= "/service/biz/grab/test";
	
	public static final String BIZ_REDIS_DEL= "/service/biz/redis/del";
	
	public static final String BIZ_GRAB_RESULT_LIST= "/service/biz/grab/result/list";
	
	public static final String BIZ_GRAB_RESULT_DETAIL= "/service/biz/grab/result/detail";
	
	public static final String BIZ_GRAB_RESULT_ADD= "/service/biz/grab/result/add";
	
	public static final String BIZ_GRAB_RESULT_ADD_ALL= "/service/biz/grab/result/modifyAll";
	
	public static final String BIZ_GRAB_RESULT_MODEL= "/service/biz/grab/result/model";
	
	public static final String BIZ_GRAB_RESULT_MODEL_GET= "/service/biz/grab/result/getModel";
	
	public static final String BIZ_GRAB_RESULT_ERROR_GET= "/service/biz/grab/result/getErrorCode";
	
	public static final String BIZ_GRAB_RESULT_UPDATE= "/service/biz/grab/result/update";
	
	public static final String BIZ_GRAB_RESULT_DEL= "/service/biz/grab/result/del";
	
	public static final String BIZ_GRAB_RESULT_TEST= "/service/biz/grab/result/test";
	
	public static final String BIZ_GRAB_SIGN_LIST= "/service/biz/grab/sign/list";
	
	public static final String BIZ_GRAB_SIGN_DETAIL= "/service/biz/grab/sign/detail";
	
	public static final String BIZ_GRAB_SIGN_ADD= "/service/biz/grab/sign/add";
	
	public static final String BIZ_GRAB_SIGN_UPDATE= "/service/biz/grab/sign/update";
	
	public static final String BIZ_GRAB_SIGN_DEL= "/service/biz/grab/sign/del";
	
	public static final String BIZ_PARAM_CONFIG_LIST= "/service/biz/param/config/list";
	
	public static final String BIZ_PARAM_CONFIG_DETAIL= "/service/biz/param/config/detail";
	
	public static final String BIZ_PARAM_CONFIG_ADD= "/service/biz/param/config/add";
	
	public static final String BIZ_PARAM_CONFIG_UPDATE= "/service/biz/param/config/update";
	
	public static final String BIZ_PARAM_CONFIG_DEL= "/service/biz/param/config/del";
	
	public static final String BIZ_PARAM_CONFIG_TEST= "/service/biz/param/config/test";
	
	public static final String BIZ_PARAM_MAPPING_LIST= "/service/biz/param/mapping/list";

	public static final String BIZ_PARAM_MAPPING_DETAIL= "/service/biz/param/mapping/detail";
	
	public static final String BIZ_PARAM_MAPPING_ADD= "/service/biz/param/mapping/add";
	
	public static final String BIZ_PARAM_MAPPING_UPDATE= "/service/biz/param/mapping/update";
	
	public static final String BIZ_PARAM_MAPPING_DEL= "/service/biz/param/mapping/del";
	
	public static final String BIZ_PARAM_CONFIG_GETINTEFACE= "/service/biz/param/config/getInteface";
	
	public static final String BIZ_PARAM_CONFIG_GETALLINTEFACE= "/service/biz/param/config/getAllInteface";
	
	
	
	// ====================================页面================================================================
	public static final String PAGE_CONTENT_ARTICLE = "/page/content/article";

	public static final String PAGE_CONTENT_COMMENT = "/page/content/comment";

	public static final String PAGE_CONTENT_SPECIAL = "/page/content/special";

	public static final String PAGE_SETTING_BSDATA = "/page/setting/bsdata";

	public static final String PAGE_SETTING_PARAM = "/page/setting/param";

	public static final String PAGE_AUTH_USER = "/page/auth/user";

	public static final String PAGE_AUTH_ROLE = "/page/auth/role";

	public static final String PAGE_AUTH_RES = "/page/auth/res";
	
	public static final String PAGE_BIZ_FLOW = "/page/biz/flow";
	
	/* ====================================作者相关====================================*/
	// 作者列表
	public static final String AUTHOR_LIST = "/service/author/list";
	// 作者信息
	public static final String AUTHOR_INFO = "/service/author/info";
	// 作者新增
	public static final String AUTHOR_ADD = "/service/author/add";
	// 作者修改
	public static final String AUTHOR_UPD = "/service/author/upd";
	// 作者文章
	public static final String AUTHOR_CONTENT = "/service/author/content";
	
	/* ====================================内容分发================================= */
	public static final String BIZ_CONTENTS_DIS_LIST = "/service/dis/list";

	public static final String BIZ_CONTENTS_DIS_CONDITION = "/service/dis/condition";

	public static final String BIZ_CONTENTS_DIS_REFRESH = "/service/dis/refreshCache";

	public static final String BIZ_CONTENTS_DIS_FLITER_ADD = "/service/dis/fliter/add";
	
	// ====================================新转码接口=============================================================
	public static final String FUNCITON_REFRESH = "/service/function/refreshCache";
	
	public static final String MOVE_RULE_FILE = "/service/function/moveRuleFile";
	
}
