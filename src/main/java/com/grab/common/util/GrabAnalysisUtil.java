package com.grab.common.util;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.assertj.core.util.Collections;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSONPath;
import com.grab.common.framework.ILog;
import com.grab.common.framework.LogFactory;
import com.grab.domain.exception.GrabException;
import com.grab.domain.grab.GrabExtractElement;
import com.grab.domain.grab.GrabParam;
import com.grab.domain.grab.GrabResult;
import com.grab.domain.grab.GrabResultDataStatus;
import com.grab.domain.grab.Schema;
import com.grab.domain.grab.SchemaTree;
import com.grab.enums.grab.ErrorTypeEnum;
import com.grab.enums.grab.ObjectTypeEnum;
import com.grab.enums.grab.TextTypeEnum;

import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.selector.Html;
import us.codecraft.webmagic.selector.Json;


public class GrabAnalysisUtil {
    private static final ILog LOGGER = LogFactory.getLog(GrabAnalysisUtil.class);

    /**
     * 结果分析
     * @param page
     * @param grabParam
     * @return
     * @throws GrabException 
     */
    public static GrabResult doAnalysis(final Page page,final GrabParam grabParam) throws GrabException {
    	if(!_checkPage(page) || !_checkGrabParam(grabParam)) {
    		return null;
    	}
    	switch (grabParam.getGrabExtractElement().getType()) {
		case HTML:
			return _doAnalysis(page.getUrl().get(),page.getHtml(), grabParam);
		case JSON:
		case JSONP:
			return _doAnalysis(page.getUrl().get(),page.getRawText(), grabParam);
		default:
			break;
		}
    	return null;
    }
    
    /**
     * 结果分析
     * @param html
     * @param grabParam
     * @return
     * @throws GrabException 
     */
    public static GrabResult doAnalysis(final String url,final Html html,final GrabParam grabParam) throws GrabException {
    	if(!_checkHtml(html) || !_checkGrabParam(grabParam)) {
    		return null;
    	}
    	return _doAnalysis(url, html, grabParam);
    }
    /**
     * 结果分析
     * @param html
     * @param grabParam
     * @return
     * @throws GrabException 
     */
    private static GrabResult _doAnalysis(final String url,final Html html,final GrabParam grabParam) throws GrabException {
    	GrabResult grabResult =null;
    	
    	GrabResultDataStatus status = grabParam.getGrabExtractElement().getGrabResultDataStatus();
    	if(status != null && status.getCodeSchema()!=null) {
    		_checkResultCode(status, html);
    	}
    	
    	try {
    		grabResult = _handleHtmlType(new GrabResult(),grabParam.getGrabExtractElement().getResultSchemaTree(),html,false);
    		grabResult.setCpId(grabParam.getCpId());
		} catch (Exception e) {
			String message = String.format("处理爬抓结果失败，URL:[%s]", url);
			throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, message, e, grabParam.getId());
		}
    	return grabResult;
    }
    
    /**
     * 结果分析
     * @param json
     * @param grabParam
     * @return
     * @throws GrabException 
     */
    public static GrabResult doAnalysis(final String url,final String json,final GrabParam grabParam) throws GrabException {
    	if(!_checkGrabParam(grabParam) ||!_checkJsonString(json,grabParam)) {
    		return null;
    	}
    	return _doAnalysis(url, json, grabParam);
    }
    /**
     * 结果分析
     * @param json
     * @param grabParam
     * @return
     * @throws GrabException 
     */
    private static GrabResult _doAnalysis(final String url,final String rawText,final GrabParam grabParam) throws GrabException {
    	GrabResult grabResult =null;
    	Object object = null;
    	try {
    		String temp = rawText;
    		if(grabParam.getGrabExtractElement().getType().equals(TextTypeEnum.JSONP)) {
    			Json json = new Json(rawText).removePadding(grabParam.getGrabExtractElement().getJsonpMethod());
    			temp = json.get();
    		}
    		object = (JSON)JSONObject.parse(temp);
    	}catch (Exception e) {
    		String message = String.format("返回json或jsonp格式不正确，或指定jsonp名称不正确，URL:[%s]", url);
    		throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, message, e, grabParam.getId());
    	}
    	
    	GrabResultDataStatus status = grabParam.getGrabExtractElement().getGrabResultDataStatus();
    	if(status != null && status.getCodeSchema()!=null) {
    		_checkResultCode_fastJson(status, object);
    	}
    	
    	try {
    		grabResult = _handleJsonType_fastJson(new GrabResult(),grabParam.getGrabExtractElement().getResultSchemaTree(),object);
    		grabResult.setCpId(grabParam.getCpId());
    	} catch (Exception e) {
    		String message = String.format("处理爬抓结果失败，URL:[%s]", url);
    		throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, message, e, grabParam.getId());
    	}
    	return grabResult;
    }
    
    /**
     * 检查page
     * @param page
     * @return
     * @throws GrabException 
     */
    private static boolean _checkPage(final Page page) throws GrabException {
    	if(page == null || StringUtil.isEmpty(page.getRawText())) {
    		throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, "处理爬抓结果失败，page is null", null, null);
    	}
    	return true;
    }
    
    /**
     * 检查html
     * @param html
     * @return
     * @throws GrabException 
     */
    private static boolean _checkHtml(final Html html) throws GrabException {
    	if(html == null) {
    		throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, "处理爬抓结果失败，html is null", null, null);
    	}
    	return true;
    }
    
    /**
     * 检查json
     * @param json
     * @return
     * @throws GrabException 
     */
    private static boolean _checkJsonString(final String json,final GrabParam grabParam) throws GrabException {
    	if(StringUtil.isEmpty(json)) {
    		throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, "处理爬抓结果失败，json is null", null, null);
    	}
    	TextTypeEnum type = grabParam.getGrabExtractElement().getType();
    	if(type == null) {
    		throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, "处理爬抓结果失败，解析类型为null", null, null);
    	}
    	if(type.equals(TextTypeEnum.JSON) || type.equals(TextTypeEnum.JSONP)) {
    		return true;
    	}else {
    		throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, "处理爬抓结果失败，配置非json方式解析", null, null);
    	}
    }
    
    /**
     * 检查配置参数
     * @param grabParam
     * @return
     * @throws GrabException 
     */
    private static boolean _checkGrabParam(final GrabParam grabParam) throws GrabException {
    	if(grabParam == null) {
    		throw new GrabException(ErrorTypeEnum.CONFIG, null, "页面爬抓配置信息不存在", null, null);
    	}
    	GrabExtractElement grabExtractElement = grabParam.getGrabExtractElement();
    	if(grabExtractElement == null || grabExtractElement.getType()== null){
    		throw new GrabException(ErrorTypeEnum.CONFIG, null, "页面提取信息不存在", null, grabParam.getId());
    	}
    	if(grabExtractElement.getType().equals(TextTypeEnum.JSONP) && StringUtil.isEmpty(grabExtractElement.getJsonpMethod())){
			String message = String.format("页面提取规则错误,分析类型:jsonp,jsonpMethod:[%s]", grabExtractElement.getJsonpMethod());
			throw new GrabException(ErrorTypeEnum.CONFIG, null, message, null, grabParam.getId());
		}
    	if(grabParam.getCpId() == null || grabParam.getCpId() <0 ) {
    		throw new GrabException(ErrorTypeEnum.CONFIG, null, "爬抓内容CPID未定义", null, grabParam.getId());
    	}
    	SchemaTree resultValueParam = grabExtractElement.getResultSchemaTree();
    	if(resultValueParam == null || (Collections.isNullOrEmpty(resultValueParam.getParams()) && resultValueParam.getNextNode() == null)){
    		//无提取配置
    		throw new GrabException(ErrorTypeEnum.CONFIG, null, "爬抓提取内容未定义", null, grabParam.getId());
    	}
    	return true;
    }

	/**
	 * 检查返回状态码
	 * @param status
	 * @param json
	 * @throws GrabException 
	 */
	private static void _checkResultCode(GrabResultDataStatus status, Html html) throws GrabException {
		//存在状态配置
		if(status != null && status.getCodeSchema() != null && status.getSuccess() !=null) {
			Schema codeSchema = status.getCodeSchema();
			String code = html.xpath(codeSchema.getExpression()).get();
			//状态不正确
			if(code == null) {
				throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, "返回code为null", null, null);
			}
			if(!status.getSuccess().contains(code)) {
				Integer error_code = null;
				if(status.getErrorCodeMap()!=null) {
					error_code = status.getErrorCodeMap().get(code);
				}
				throw new GrabException(error_code, "返回code为非正常,code:"+code, null);
			}
		}
	}

	/**
	 * 检查返回状态码
	 * @param status
	 * @param json
	 * @throws GrabException 
	 */
	private static void _checkResultCode_fastJson(GrabResultDataStatus status, Object json) throws GrabException {
		if(status != null && status.getCodeSchema() != null && status.getSuccess() !=null) {
			Schema codeSchema = status.getCodeSchema();
			Object code = JSONPath.eval(json, codeSchema.getExpression());
			if(code!=null && code.getClass().isArray()) {
				code = Array.get(code, 0);
			}
			//状态不正确
			if(code == null) {
				throw new GrabException(ErrorTypeEnum.NO_EXPECTED, null, "返回code为null,data:"+json, null, null);
			}
			if(!status.getSuccess().contains(code.toString())) {
				Integer error_code = null;
				if(status.getErrorCodeMap()!=null) {
					error_code = status.getErrorCodeMap().get(code.toString());
				}
				throw new GrabException(error_code, "返回code为非正常,code:"+code+",data:"+json, null);
			}
		}
	}

	/**
	 * 根据提取规则，批量提取返回结果中的目标值，返回map
	 * @param xpathParams
	 * @param resultMap
	 * @param json
	 */
	private static GrabResult _handleJsonType(GrabResult result,SchemaTree schemaTree, Json json) {
		//已不存在下一级元素，或出现死循环
		if(schemaTree== null || json == null){
			return new GrabResult();
		}

		//需要展开，递归
		if(schemaTree.isSpread()) {
			//默认为当前节点
			String nextXpathParm = "@";
			if(schemaTree.getNextNode().getSchema()!=null) {
				//取到下一跳节点
				nextXpathParm = schemaTree.getNextNode().getSchema().getExpression();
			}
			List<String> list = json.jsonPath(nextXpathParm).all();
			if(!Collections.isNullOrEmpty(list)) {
				List<GrabResult> nextResult = new ArrayList<GrabResult>();
				for (String string : list) {
					Json s = new Json(string);
					//生成下一跳元素对象
					GrabResult r = _handleJsonType(result,schemaTree.getNextNode(), s);
					//下一层也是列表，刚将列表对象加入本层
					if(!Collections.isNullOrEmpty(r.getArrayResult())) {
						nextResult.addAll(r.getArrayResult());
					}else {
						nextResult.add(r);
					}
				}
				result.setArrayResult(nextResult);
			}
		}

		List<GrabResult> arrayResult = null;
		//需要展开时，直接使用下一跳列表作为对象元素列表
		if(schemaTree.isSpread()) {
			arrayResult = result.getArrayResult();
		}else {
			//不需要展开时，直接生成子节点对象
			arrayResult = new ArrayList<GrabResult>();
			arrayResult.add(new GrabResult());
		}
		//依次提取属性
		for (Schema x:schemaTree.getParams()) {
			if(StringUtil.isEmpty(x.getName()) || StringUtil.isEmpty(x.getExpression())){
				LOGGER.error(String.format("页面提取规则错误,paramName:[%s],xpathParm:[%s]", x.getName(),x.getExpression()));
				continue;
			}
			ObjectTypeEnum objectType = x.getObjectType();
			Object value = null;
			if(objectType!=null && objectType.getId()==ObjectTypeEnum.LIST.getId()){
				List<String> list = json.jsonPath(x.getExpression()).all(); 
				if(!Collections.isNullOrEmpty(list) ) {
					try {
						List<Object> objects = new ArrayList<Object>();
						value = objects;
						for (String string : list) {
							if(!string.startsWith("{")) {
								value = list;
								break;
							}
							objects.add(JSON.parse(string));
						}
					}catch (Exception e) {
						value = list;
					}
				}else {
					value = list;
				}
			}else {
				String string = json.jsonPath(x.getExpression()).get();
				if(StringUtil.isNotEmpty(string) && string.startsWith("{")) {
					try {
						value = JSON.parse(string);
					}catch (Exception e) {
						value = string;
					}
				}else {
					value = string;
				}
			}
			//提取的属于加入相应对象，并将下一层压平
			for (GrabResult grabResult : arrayResult) {
				if(grabResult.getResult() == null) {
					grabResult.setResult(new HashMap<String, Object>());
				}
				grabResult.getResult().put(x.getName(), value);
				grabResult.setArrayResult(null);
			}
		}
		//本层需要展开，则返回列表，否则返回单个新建对象
		if(schemaTree.isSpread()) {
			result.setArrayResult(arrayResult);
			result.setResult(null);
		}else {
			if(!Collections.isNullOrEmpty(arrayResult) && arrayResult.get(0)!=null) {
				result = arrayResult.get(0);
			}
			result.setArrayResult(null);
		}
		return result;
	}
	
	/**
	 * 根据提取规则，批量提取返回结果中的目标值，返回map
	 * @param xpathParams
	 * @param resultMap
	 * @param json
	 * @throws Exception 
	 */
	private static GrabResult _handleJsonType_fastJson(GrabResult result,SchemaTree schemaTree, Object json) throws Exception {
		//已不存在下一级元素，或出现死循环
		if(schemaTree== null || json == null){
			return new GrabResult();
		}

		//需要展开，递归
		if(schemaTree.isSpread()) {
			//默认为当前节点
			String nextXpathParm = "@";
			if(schemaTree.getNextNode().getSchema()!=null) {
				//取到下一跳节点
				nextXpathParm = schemaTree.getNextNode().getSchema().getExpression();
			}
			Object next_object = JSONPath.eval(json, nextXpathParm);
			List<JSONObject> list = null;
			if(next_object!=null) {
				if(next_object  instanceof  JSONArray || next_object.getClass().isArray() || next_object instanceof Collection) {
					list = new ArrayList<>((Collection<JSONObject>) next_object);
				}else if(next_object instanceof String){
					//JSON 格式已转String
					list = new ArrayList<>();
					list.add(JSONObject.parseObject(next_object.toString()));
				}else {
					throw new Exception("层级化处理出错，含有未知类型");
				}
			}
			if(!Collections.isNullOrEmpty(list)) {
				List<GrabResult> nextResult = new ArrayList<GrabResult>();
				for (JSONObject string : list) {
					//生成下一跳元素对象
					GrabResult r = _handleJsonType_fastJson(result,schemaTree.getNextNode(), string);
					//下一层也是列表，刚将列表对象加入本层
					if(!Collections.isNullOrEmpty(r.getArrayResult())) {
						nextResult.addAll(r.getArrayResult());
					}else {
						nextResult.add(r);
					}
				}
				result.setArrayResult(nextResult);
			}
		}

		List<GrabResult> arrayResult = null;
		//需要展开时，直接使用下一跳列表作为对象元素列表
		if(schemaTree.isSpread()) {
			arrayResult = result.getArrayResult();
		}else {
			//不需要展开时，直接生成子节点对象
			arrayResult = new ArrayList<GrabResult>();
			arrayResult.add(new GrabResult());
		}
		//依次提取属性
		for (Schema x:schemaTree.getParams()) {
			if(StringUtil.isEmpty(x.getName()) || StringUtil.isEmpty(x.getExpression())){
				LOGGER.error(String.format("页面提取规则错误,paramName:[%s],xpathParm:[%s]", x.getName(),x.getExpression()));
				continue;
			}
			ObjectTypeEnum objectType = x.getObjectType() == null ? ObjectTypeEnum.OBJECT:x.getObjectType();
			Object value = JSONPath.eval(json, x.getExpression());
			if(value != null) {
				if(objectType.equals(ObjectTypeEnum.LIST)) {
					if(!(value instanceof List) && !(value.getClass().isArray()) && !(value instanceof JSONArray)) {
						List<Object> list = new ArrayList<>();
						list.add(value);
						value = list;
					}
				}else{
					if(value.getClass().isArray()) {
						if(Array.getLength(value)>0) {
							value = Array.get(value, 0);
						}
					}else if(value instanceof JSONArray) {
						JSONArray jsonArray = (JSONArray) value;
						if(jsonArray.size()>0) {
							value = jsonArray.get(0);
						}
					}
				}
			}
			//提取的属于加入相应对象，并将下一层压平
			for (GrabResult grabResult : arrayResult) {
				if(grabResult.getResult() == null) {
					grabResult.setResult(new HashMap<String, Object>());
				}
				//不为空或者原来值为空（原来值为空）
				if(value != null || grabResult.getResult().get(x.getName()) == null) {
					grabResult.getResult().put(x.getName(), value);
				}
				grabResult.setArrayResult(null);
			}
		}
		//本层需要展开，则返回列表，否则返回单个新建对象
		if(schemaTree.isSpread()) {
			result.setArrayResult(arrayResult);
			result.setResult(null);
		}else {
			if(!Collections.isNullOrEmpty(arrayResult) && arrayResult.get(0)!=null) {
				result = arrayResult.get(0);
			}
			result.setArrayResult(null);
		}
		return result;
	}
	
	
	/**
	 * 根据提取规则，批量提取返回结果中的目标值，返回map
	 * @param xpathParams
	 * @param resultMap
	 * @param json
	 */
	private static GrabResult _handleHtmlType(GrabResult result,SchemaTree schemaTree, Html html,boolean isAutoCreate) {
		//已不存在下一级元素，或出现死循环
		if(schemaTree== null || html == null){
			return new GrabResult();
		}
		
		if(isAutoCreate) {
			if(!Collections.isNullOrEmpty(schemaTree.getParams())) {
				for (Schema schema : schemaTree.getParams()) {
					if(StringUtil.isEmpty(schema.getExpression()) || schema.getExpression().startsWith("/html/body")) {
						continue;
					}
					schema.setExpression("/html/body"+schema.getExpression());
				}
			}
			if(schemaTree.getNextNode()!=null && schemaTree.getNextNode().getSchema()!=null) {
				Schema schema = schemaTree.getNextNode().getSchema();
				if(StringUtil.isNotEmpty(schema.getExpression())&&(!schema.getExpression().startsWith("/html/body"))) {
					schemaTree.getNextNode().getSchema().setExpression("/html/body"+schemaTree.getNextNode().getSchema().getExpression());
				}
			}
		}

		//需要展开，递归
		if(schemaTree.isSpread()) {
			//默认为当前节点
			String nextXpathParm = "/";
			if(schemaTree.getNextNode().getSchema()!=null) {
				//取到下一跳节点
				nextXpathParm = schemaTree.getNextNode().getSchema().getExpression();
			}
			List<String> list = html.xpath(nextXpathParm).all();
			if(!Collections.isNullOrEmpty(list)) {
				List<GrabResult> nextResult = new ArrayList<GrabResult>();
				for (String string : list) {
					Html s = new Html(string);
					//生成下一跳元素对象
					GrabResult r = _handleHtmlType(result,schemaTree.getNextNode(), s,true);
					//下一层也是列表，刚将列表对象加入本层
					if(!Collections.isNullOrEmpty(r.getArrayResult())) {
						nextResult.addAll(r.getArrayResult());
					}else {
						nextResult.add(r);
					}
				}
				result.setArrayResult(nextResult);
			}
		}

		List<GrabResult> arrayResult = null;
		//需要展开时，直接使用下一跳列表作为对象元素列表
		if(schemaTree.isSpread()) {
			arrayResult = result.getArrayResult();
		}else {
			//不需要展开时，直接生成子节点对象
			arrayResult = new ArrayList<GrabResult>();
			arrayResult.add(new GrabResult());
		}
		//依次提取属性
		for (Schema x:schemaTree.getParams()) {
			if(StringUtil.isEmpty(x.getName()) || StringUtil.isEmpty(x.getExpression())){
				LOGGER.error(String.format("页面提取规则错误,paramName:[%s],xpathParm:[%s]", x.getName(),x.getExpression()));
				continue;
			}
			ObjectTypeEnum objectType = x.getObjectType();
			Object value = null;
			if(objectType!=null && objectType.getId()==ObjectTypeEnum.LIST.getId()){
				List<String> list = html.xpath(x.getExpression()).all(); 
				if(!Collections.isNullOrEmpty(list)) {
					try {
						List<Object> objects = new ArrayList<Object>();
						for (String string : list) {
							objects.add(JSON.parse(string));
						}
						value = objects;
					}catch (Exception e) {
						value = list;
					}
				}else {
					value = list;
				}
			}else {
				String string = html.xpath(x.getExpression()).get();
				if(StringUtil.isNotEmpty(string)) {
					try {
						value = JSON.parse(html.xpath(x.getExpression()).get());
					}catch (Exception e) {
						value = string;
					}
				}else {
					value = string;
				}
			}
			//提取的属于加入相应对象，并将下一层压平
			for (GrabResult grabResult : arrayResult) {
				if(grabResult.getResult() == null) {
					grabResult.setResult(new HashMap<String, Object>());
				}
				grabResult.getResult().put(x.getName(), value);
				grabResult.setArrayResult(null);
			}
		}
		//本层需要展开，则返回列表，否则返回单个新建对象
		if(schemaTree.isSpread()) {
			result.setArrayResult(arrayResult);
			result.setResult(null);
		}else {
			if(!Collections.isNullOrEmpty(arrayResult) && arrayResult.get(0)!=null) {
				result = arrayResult.get(0);
			}
			result.setArrayResult(null);
		}
		return result;
	}
}
