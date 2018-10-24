package com.roger.grab.base.common.util;


import com.roger.grab.base.common.framework.ILog;
import com.roger.grab.base.common.framework.LogFactory;
import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabTriggerParam;
import com.roger.grab.base.domain.grab.ParamSchema;
import com.roger.grab.base.enums.grab.ErrorTypeEnum;
import com.roger.grab.base.enums.grab.FieldConstant;

import us.codecraft.webmagic.Request;


public class GrabConfigUtil{
	private static final ILog LOGGER = LogFactory.getLog(GrabConfigUtil.class);
	
	/**
	 * 提取配置
	 * @param request
	 * @return
	 */
	public static GrabParam getGrabParam(Request request) { 
		Object object = request.getExtra(FieldConstant.GRAB_CONFIG);
		if(object != null && object instanceof GrabParam) {
			return (GrabParam) object;
		}
		return null;
	}
	
	/**
	 * 添加配置
	 * @param request
	 * @return
	 */
	public static Request addGrabParam(Request request,GrabParam grabParam) {
		if(grabParam == null || request == null || StringUtil.isEmpty(grabParam.getUrl())) {
			return null;
		}
		request.setUrl(grabParam.getUrl());
		request.putExtra(FieldConstant.GRAB_CONFIG,grabParam);
		if(grabParam.getMethodType() == null) {
			request.setMethod("GET");
		}else {
			switch (grabParam.getMethodType()) {
			case GET:
				request.setMethod("GET");
				break;
			default:
				request.setMethod("POST");
				break;
			}
		}
		return request;
	}
	
	/**
	 * 生成request请求
	 * @param grabService
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public static Request createRequest(GrabParam grabParam,GrabTriggerParam param) throws GrabException {  
		if(grabParam == null) {
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "未配置grab", null, null);
		}
		if( grabParam.getParamSchema() == null) {
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "未配置paramSchema", null, grabParam.getId());
		}
		if(param == null ||param.getId() == null) {
			throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR, null, "用于生成request的参数不符合预期", null, grabParam.getId());
		}
		grabParam.getParamSchema().setParamMap(RequestParamHandleUtil.createParamMap(grabParam, param.getParamMap()));
		Request request = addGrabParam(new Request(), grabParam);
		return request;
	}
	
	/**
	 * 生成request请求
	 * @param grabService
	 * @param param
	 * @return
	 */
	public static GrabTriggerParam createGrabTrigger(Request request) {  
		if(request == null) {
			return null;
		}
		GrabParam grabParam = getGrabParam(request);
		if(grabParam == null || grabParam.getId() == null) {
			return null;
		}
		GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
		grabTriggerParam.setId(grabParam.getId());
		ParamSchema paramSchema = grabParam.getParamSchema();
		grabTriggerParam.setParamMap(paramSchema == null ? null:paramSchema.getParamMap());
		return grabTriggerParam;
	}
}
