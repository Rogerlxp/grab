package com.roger.grab.base.domain.exception;

public interface ContentsExceptionCode{
	//通用异常
	public static final Integer BASE_ERROR = 400;
	//过载
	public static final Integer OVER_LOAD_ERROR = 504;
	//CP调用异常
	public static final Integer CP_ERROR = 10001;
	//CP Token异常
	public static final Integer CP_TOKEN_ERROR = 10002;
	//参数错误
	public static final Integer PARAM_ERROR = 10003;
	//访问过于频繁错误
	public static final Integer LIMIT_REQ_ERROR = 10004;
	
	
	//创建 cp request异常
	public static final Integer AGENT_CP_CREATE_REQUEST_ERROR = 50001;
	//cp 配置错误
	public static final Integer AGENT_CP_CONFIG_ERROR = 50002;
	//cp network层异常
	public static final Integer AGENT_CP_NETWORK_ERROR = 50003;
	//cp http层异常
	public static final Integer AGENT_CP_HTTP_ERROR =50004;
	//cp 返回数据不符合预期格式异常
	public static final Integer AGENT_CP_NO_EXPECTED_ERROR =50005;
	//cp MPPING异常
	public static final Integer AGENT_CP_MPPING_ERROR =50006;
	//cp 没有更多数据了
    public static final Integer AGENT_CP_NOMORE_DATA =50007;

}
