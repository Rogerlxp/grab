package com.roger.grab.manage.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.roger.grab.base.common.httpClient.GrabHttpClient;
import com.roger.grab.base.common.util.GrabRuleUtil;
import com.roger.grab.base.common.util.RequestParamHandleUtil;
import com.roger.grab.base.common.util.SignUtil;
import com.roger.grab.base.common.util.StringUtil;
import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabExtractElement;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabParamString;
import com.roger.grab.base.domain.grab.GrabResult;
import com.roger.grab.base.domain.grab.GrabSite;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.GrabTriggerParam;
import com.roger.grab.base.domain.grab.ParamSchema;
import com.roger.grab.base.domain.grab.SchemaTree;
import com.roger.grab.base.domain.grab.SignSchema;
import com.roger.grab.base.domain.grab.SignSchemaString;
import com.roger.grab.base.enums.grab.ErrorTypeEnum;
import com.roger.grab.base.service.grab.IGrabService;

@Service
public class GrabTrialService {
	
	@Autowired
	private IGrabService grabService;
	
	/**
	 * 测试获取内容
	 * @param signSchemaString
	 * @param grabParamString
	 * @param grabSite
	 * @return
	 * @throws GrabException
	 */
	public GrabResult getEntity( SignSchemaString signSchemaString,GrabParamString grabParamString,GrabSite grabSite ) throws GrabException {
		if(grabParamString == null) {
			throw new GrabException(ErrorTypeEnum.CONFIG,null, "grabParam 参数为null", null, null);
		}
		if(grabSite == null) {
			grabSite = new GrabSite();
			grabSite.setCharset("UTF-8");
		}
		createExtract(grabParamString);
		GrabParam grabParam = new GrabParam(grabParamString);
		grabParam.setId(Integer.MAX_VALUE);
		GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
		GrabToken grabToken = null;
		grabTriggerParam.setId(grabParam.getId());
		if(grabParam.getParamSchema()!=null) {
			grabTriggerParam.setParamMap(grabParam.getParamSchema().getParamMap());
		}
		if(grabParam.getTokenSchema()!=null) {
			grabToken = grabService.getGrabToken(grabParam.getTokenSchema(),grabTriggerParam.getParamMap());
		}
		if(signSchemaString != null) {
			grabParam.setSignSchema(new SignSchema(signSchemaString));
			Integer signId = signSchemaString.getId()==null?grabParam.getSignId():signSchemaString.getId();
			if(signId == null) {
				signId = Integer.MAX_VALUE;
			}
			grabParam.setSignId(signId);
			signSchemaString.setId(signId);
		}
		try {
			return GrabHttpClient.doHttp(grabTriggerParam,grabParam,grabSite,grabToken);
		}catch (GrabException e) {
			String params = getParams(grabParam);
			ParamSchema paramSchema = grabParam.getParamSchema();
			Map<String, String> map = new HashMap<String, String>();
			if(paramSchema!=null && paramSchema.getParamMap()!=null) {
				for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {
					Object object = entry.getValue();
					map.put(entry.getKey(), object == null ? "":object.toString());
				}
			}
			//获取URL中参数
			RequestParamHandleUtil.getRequestParamToMap(map,grabParam.getUrl());
			String signkey = null;
			String sign = null;
			if(paramSchema !=null) {
				signkey = SignUtil.createSignedString(grabParam.getSignSchema(), map,paramSchema.getParamMap());
				sign = SignUtil.getSign(grabParam.getSignSchema(), map,paramSchema.getParamMap());
			}
			String message = String.format("访问异常，url:%s,参数：%s,签名前拼接串：%s,签名后生成值：%s，message:%s,errorType:%s",
					grabParam.getUrl(),params, signkey,sign,e.getMessage(),e.getErrorTypeEnum().getName());
			e.setMessage(message);
			throw e;
		}
	}
	
	
	public String getEntityOriginal( SignSchemaString signSchemaString,GrabParamString grabParamString,GrabSite grabSite ) throws GrabException {
		if(grabParamString == null) {
			throw new GrabException(ErrorTypeEnum.CONFIG,null, "grabParam 参数为null", null, null);
		}
		if(grabSite == null) {
			grabSite = new GrabSite();
			grabSite.setCharset("UTF-8");
		}
		createExtract(grabParamString);
		GrabParam grabParam = new GrabParam(grabParamString);
		grabParam.setId(Integer.MAX_VALUE);
		GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
		GrabToken grabToken = null;
		grabTriggerParam.setId(grabParam.getId());
		if(grabParam.getParamSchema()!=null) {
			grabTriggerParam.setParamMap(grabParam.getParamSchema().getParamMap());
		}
		if(grabParam.getTokenSchema()!=null) {
			grabToken = grabService.getGrabToken(grabParam.getTokenSchema(),grabTriggerParam.getParamMap());
		}
		if(signSchemaString != null) {
			grabParam.setSignSchema(new SignSchema(signSchemaString));
			Integer signId = signSchemaString.getId()==null?grabParam.getSignId():signSchemaString.getId();
			if(signId == null) {
				signId = Integer.MAX_VALUE;
			}
			grabParam.setSignId(signId);
			signSchemaString.setId(signId);
		}
		try {
			return GrabHttpClient.doHttpOriginal(grabTriggerParam,grabParam,grabSite,grabToken);
		}catch (GrabException e) {
			String params = getParams(grabParam);
			ParamSchema paramSchema = grabParam.getParamSchema();
			Map<String, String> map = new HashMap<String, String>();
			if(paramSchema!=null && paramSchema.getParamMap()!=null) {
				for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {
					Object object = entry.getValue();
					map.put(entry.getKey(), object == null ? "":object.toString());
				}
			}
			//获取URL中参数
			RequestParamHandleUtil.getRequestParamToMap(map,grabParam.getUrl());
			String signkey = null;
			String sign = null;
			if(paramSchema !=null) {
				signkey = SignUtil.createSignedString(grabParam.getSignSchema(), map,paramSchema.getParamMap());
				sign = SignUtil.getSign(grabParam.getSignSchema(), map,paramSchema.getParamMap());
			}
			String message = String.format("访问异常，url:%s,参数：%s,签名前拼接串：%s,签名后生成值：%s，message:%s,errorType:%s",
					grabParam.getUrl(),params, signkey,sign,e.getMessage(),e.getErrorTypeEnum().getName());
			e.setMessage(message);
			throw e;
		}
	}
	
	/**
	 * 获取参数
	 * @param grabParam
	 * @return
	 */
	private String getParams(GrabParam grabParam) {
		String params = null;
		ParamSchema paramSchema = grabParam.getParamSchema();
		if(paramSchema!=null && paramSchema.getParamMap()!=null && !paramSchema.getParamMap().isEmpty()) {
			switch (grabParam.getMethodType()) {
			case POST_JSON_PARAM:
				//json形式提交
				params = JSON.toJSONString(paramSchema.getParamMap());
				break;
			case POST_MAP_PARA:
				//map形式提交
				StringBuffer stringBuffer = new StringBuffer();
				for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {
					Object object = entry.getValue();
					String value = object ==null ? "":object.toString();
					if(StringUtil.isNotEmpty(entry.getKey()) && object!=null) {
						stringBuffer.append(entry.getKey()).append("=").append(value).append("&"); 
					}
				}
				if(stringBuffer.length()>0) {
					params = stringBuffer.substring(0, stringBuffer.length()-1);
				}
				break;
			default:
				break;
			}
		}
		return params;
	}

	/**
	 * 根据配置生成提取规则
	 * @param grabParamString
	 * @throws GrabException
	 */
	public void createExtract(GrabParamString grabParamString) throws GrabException {
		if(grabParamString.getOriginalParam()!=null) {
			SchemaTree schemaTree;
			try {
				schemaTree = GrabRuleUtil.createJsonSchemaTree(grabParamString.getOriginalParam().getParams(), grabParamString.getOriginalParam().getBaseRule(),grabParamString.getOriginalParam().getAttributes());
			} catch (Exception e) {
				throw new GrabException(ErrorTypeEnum.CONFIG,null, "提取规则配置错误，message:"+e.getMessage(), null, null);
			}
			GrabExtractElement element = grabParamString.getExtractElement();
			if(element == null) {
				element = new GrabExtractElement();
			}
			element.setResultSchemaTree(schemaTree);
			grabParamString.setExtractElement(element);
		}
	}
}
