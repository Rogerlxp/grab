package com.roger.grab.base.common.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.assertj.core.util.Collections;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSONPath;
import com.alibaba.simpleEL.dialect.tiny.TinyELEvalService;
import com.roger.grab.base.common.framework.ILog;
import com.roger.grab.base.common.framework.LogFactory;
import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabExtractElement;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabResult;
import com.roger.grab.base.domain.grab.GrabTriggerParam;
import com.roger.grab.base.domain.grab.NextUrlParamSchema;
import com.roger.grab.base.domain.grab.NextUrlSchema;
import com.roger.grab.base.domain.grab.Schema;
import com.roger.grab.base.enums.grab.ErrorTypeEnum;
import com.roger.grab.base.enums.grab.TextTypeEnum;
import com.roger.grab.base.common.util.ExpressionExecutionUtil.CacheSimpleElType;

import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.selector.Html;
import us.codecraft.webmagic.selector.Json;


public class GrabNextUrlUtil{
	private static final ILog LOGGER = LogFactory.getLog(GrabNextUrlUtil.class);

	/**
	 * 创建下一链
	 * @param grabService
	 * @param page
	 * @param grabParam
	 * @return
	 * @throws GrabException 
	 */
	public static List<Request> createNextRequest(Map<Integer, GrabParam> grabParamMap,final GrabResult grabResult,final GrabParam grabParam,final Page page) throws GrabException {
		if(grabParam == null || grabParam.getGrabExtractElement()==null || grabParamMap == null || grabParamMap.isEmpty()) {
			return null;
		}
		List<NextUrlSchema> grabUrls = grabParam.getGrabExtractElement().getNextUrls();
		if(Collections.isNullOrEmpty(grabUrls) ){
			return null;
		}

		List<Request> requests = new ArrayList<>();
		for (NextUrlSchema grabUrl : grabUrls) {
			if(grabUrl.getGrabId()==null) {
				continue;
			}
			GrabParam nextGrabParam = grabParamMap.get(grabUrl.getGrabId());
			boolean isNextPageUrl = grabParam.getId().equals(grabUrl.getGrabId()); 
			if(isNextPageUrl) {
				//同一个链接，则是翻页需要，可将参数自动带入
				nextGrabParam.setParamSchema(grabParam.getParamSchema());
			}
			if(nextGrabParam == null) {
				throw new GrabException(ErrorTypeEnum.CONFIG, null, "下一链GrabId未定义，无法生成 下一链", null, grabUrl.getGrabId());
			}
			if(grabResult ==null || (grabResult.getResult() == null && Collections.isNullOrEmpty(grabResult.getArrayResult()))) {
				throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, "无数据返回，无法提取参数", null, grabParam.getId());
			}
			//下一链基础参数生成
			Map<String, Object> baseNextUrlParams = null;
			Map<String, Object> nextUrlParams = new HashMap<>();
			if(ListUtils.isNotEmpty(grabUrl.getSchemas())) {
				//从返回中提取下一链接基础参数
				nextUrlParams.putAll(_nextUrlParam(page,grabParam.getGrabExtractElement(),grabUrl.getSchemas()));
			}
			if(ListUtils.isNotEmpty(grabUrl.getParamSchemas())) {
				//从参数中提取下一链接基础参数
				nextUrlParams.putAll(_nextUrlParam_byParam(page.getUrl().get(),grabParam,grabUrl.getParamSchemas()));
			}
			if(nextUrlParams!=null && !nextUrlParams.isEmpty()) {
				Map<String, Object> params = null;
				try {
					//检查参数是否满足全部参数需求
					params = RequestParamHandleUtil.createParamMap(nextGrabParam, nextUrlParams);
				}catch (GrabException e) {
					//参数不全
					baseNextUrlParams = nextUrlParams;
					params = null;
				}
				if(params != null) {
					//直接生成下一链
					GrabTriggerParam param = new GrabTriggerParam();
					param.setId(grabUrl.getGrabId());
					param.setPriority(grabUrl.getPriority());
					param.setParamMap(params);
					Request request = GrabConfigUtil.createRequest(nextGrabParam, param);
					if(request!=null) {
						requests.add(request);
						continue;
					}
				}
			}

			//翻页下一链接，避免死循环
			if(isNextPageUrl) {
				continue;
			}

			//从返回结果列表中获取下一链参数
			GrabTriggerParam param = createGrabTrigger(grabUrl, nextGrabParam, grabResult,baseNextUrlParams);
			if(param!=null) {
				Request request = GrabConfigUtil.createRequest(nextGrabParam, param);
				if(request!=null) {
					requests.add(request);
				}
			}
			if(!Collections.isNullOrEmpty(grabResult.getArrayResult())) {
				for (GrabResult result : grabResult.getArrayResult()) {
					param = createGrabTrigger(grabUrl, nextGrabParam, result,baseNextUrlParams);
					if(param!=null) {
						//避免循环引用相同对象导致参数覆盖
						GrabParam tempGrabParam = nextGrabParam.clone();
						Request request = GrabConfigUtil.createRequest(tempGrabParam, param);
						if(request!=null) {
							requests.add(request);
						}
					}
				}
			}
		}
		return requests;
	}
	
	private static Map<String, Object> _nextUrlParam_byParam(final String url,final GrabParam grabParam,List<NextUrlParamSchema> schemas) throws GrabException {
		try {
			Map<String, Object> map = new HashMap<>();
			Map<String, Object> values = grabParam.getParamSchema().getParamMap();
			for (NextUrlParamSchema schema : schemas) {
				if( StringUtil.isNotEmpty(schema.getExpression())) {
					Object param = JSONPath.eval(values, schema.getExpression());
					map.put(schema.getName(), param);
				}else if( StringUtil.isNotEmpty(schema.getElRule())) {
					Object param = null;
					String serviceId = ExpressionExecutionUtil.CacheSimpleElType.NEXTURLPARAM.getName(grabParam.getId());
					TinyELEvalService service = ExpressionExecutionUtil.getSimpleElService(serviceId);
					if(service == null && values!= null &&(!values.isEmpty())) {
						synchronized (CacheSimpleElType.PARAMRULE){
							service = ExpressionExecutionUtil.getSimpleElService(serviceId);
							if(service == null) {
								service = new TinyELEvalService();
								service.setAllowMultiStatement(true); 
								Set<Entry<String, Object>> setDataTypes = values.entrySet();
								for (Entry<String, Object> entry : setDataTypes) {
									if(entry.getValue() == null) {
										service.regsiterVariant(Object.class, entry.getKey());
									}else {
										service.regsiterVariant(entry.getValue().getClass(), entry.getKey());
									}
								}
								ExpressionExecutionUtil.putSimpleElService(ExpressionExecutionUtil.CacheSimpleElType.NEXTURLPARAM,grabParam.getId(),service);
							}
						}
					}
					param = ExpressionExecutionUtil.execution_simpleEl(serviceId,service, schema.getElRule(), values);
					map.put(schema.getName(), param);
				}
			}
			return map;
		}catch (Exception e) {
			String message = String.format("处理爬抓结果失败，URL:[%s]", url);
			throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, message, e, null);
		}
	}
	
    private static Map<String, Object> _nextUrlParam(final Page page,final GrabExtractElement extractElement,List<Schema> schemas) throws GrabException {
    	switch (extractElement.getType()) {
		case HTML:
			return _nextUrlParam(schemas,page.getUrl().get(),page.getHtml());
		case JSONP:
		case JSON:
			Object object = null;
			try {
	    		String temp = page.getRawText();
	    		if(extractElement.getType().equals(TextTypeEnum.JSONP)) {
	    			Json json = new Json(temp).removePadding(extractElement.getJsonpMethod());
	    			temp = json.get();
	    		}
	    		object = (JSON)JSONObject.parse(temp);
	    	}catch (Exception e) {
	    		String message = String.format("返回json或jsonp格式不正确，或指定jsonp名称不正确，URL:[%s]", page.getUrl());
	    		throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, message, e, null);
	    	}
			return _nextUrlParam_fastJson(schemas,page.getUrl().get(),object);
		default:
			break;
		}
    	return null;
    }

	/**
	 * 生成下一链触发器
	 * @param nextUrlSchema
	 * @param nextgrabParam
	 * @param grabResult
	 * @return
	 * @throws GrabException 
	 */
	private static GrabTriggerParam createGrabTrigger(NextUrlSchema nextUrlSchema, GrabParam nextgrabParam,GrabResult grabResult,Map<String, Object>baseNextUrlParams) throws GrabException {
		if(grabResult.getResult()!=null) {
			Map<String, Object> params = grabResult.getResult();
			if(baseNextUrlParams!=null && !baseNextUrlParams.isEmpty()) {
				params = new HashMap<>();
				params.putAll(baseNextUrlParams);
				params.putAll(grabResult.getResult());
			}
			GrabTriggerParam param = new GrabTriggerParam();
			param.setId(nextUrlSchema.getGrabId());
			param.setPriority(nextUrlSchema.getPriority());
			param.setParamMap(RequestParamHandleUtil.createParamMap(nextgrabParam, params));
			return param;
		}
		return null;
	}
	
	/**
	 * 提取下一链参数
	 * @param status
	 * @param json
	 * @throws GrabException 
	 */
	private static Map<String, Object> _nextUrlParam(List<Schema> schemas,String url, Html html) throws GrabException {
		if(ListUtils.isEmpty(schemas) || html == null) {
			return null;
		}
		try {
			Map<String, Object> map = new HashMap<>();
			for (Schema schema : schemas) {
				Object param = html.xpath(schema.getExpression()).get();
				map.put(schema.getName(), param);
			}
			return map;
		}catch (Exception e) {
			String message = String.format("处理爬抓结果失败，URL:[%s]", url);
			throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, message, e, null);
		}
	}

	/**
	 * 提取下一链参数
	 * @param status
	 * @param json
	 * @throws GrabException 
	 */
	private static Map<String, Object> _nextUrlParam_fastJson(List<Schema> schemas, String url,Object json) throws GrabException {
		if(ListUtils.isEmpty(schemas) || json == null) {
			return null;
		}
		try {
			Map<String, Object> map = new HashMap<>();
			for (Schema schema : schemas) {
				Object param = JSONPath.eval(json, schema.getExpression());
				map.put(schema.getName(), param);
			}
			return map;
		}catch (Exception e) {
			String message = String.format("处理爬抓结果失败，URL:[%s]", url);
			throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, message, e, null);
		}
	}
	
}
