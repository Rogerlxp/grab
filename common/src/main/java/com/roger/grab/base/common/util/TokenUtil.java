package com.roger.grab.base.common.util;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONPath;
import com.roger.grab.base.common.framework.ILog;
import com.roger.grab.base.common.framework.LogFactory;
import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabResult;
import com.roger.grab.base.domain.grab.GrabResultParam;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.ParamSchema;
import com.roger.grab.base.domain.grab.SignSchema;
import com.roger.grab.base.enums.grab.EntityTypeEnum;
import com.roger.grab.base.enums.grab.ErrorTypeEnum;
import com.roger.grab.base.enums.grab.MethodTypeEnum;
import com.roger.grab.base.enums.grab.PositionEnum;

public class TokenUtil{

	private static final ILog LOGGER = LogFactory.getLog(TokenUtil.class);

	private static HttpClient httpClient;
	private static RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(3000).setConnectTimeout(3000).setConnectionRequestTimeout(100).build();  

	private static HttpClient getHttpClient(){
		if(httpClient !=null){
			return httpClient;
		}
		PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
		// 设置最大连接数
		cm.setMaxTotal(200);
		// 设置每个主机地址的并发数
		cm.setDefaultMaxPerRoute(200);
		httpClient = HttpClients.custom().setConnectionManager(cm).build();
		return httpClient; 
	} 

	public static GrabToken getToken(GrabParam tokengrabParam,GrabResultParam grabResultParam) throws GrabException {
		if(tokengrabParam == null || tokengrabParam.getGrabExtractElement() == null) {
			return null;
		}
		if(tokengrabParam.getMethodType() == null) {
			tokengrabParam.setMethodType(MethodTypeEnum.GET);
		}
		String token_result = null;
		try {
			switch (tokengrabParam.getMethodType()) {
			case GET:
				token_result = executeGet(tokengrabParam.getSignSchema(),tokengrabParam.getUrl(), tokengrabParam.getParamSchema());
				break;
			case POST_JSON_PARAM:
			case POST_MAP_PARA:
				token_result = executePost(tokengrabParam.getSignSchema(),tokengrabParam.getUrl(),  tokengrabParam.getParamSchema(), tokengrabParam.getMethodType());
			default:
				break;
			}
		}catch (Exception e) {
			throw new GrabException(ErrorTypeEnum.NETWORK,null,null,e,tokengrabParam.getId());
		}
		if(StringUtil.isEmpty(token_result)) {
			return null;
		}
		GrabResult grabResult = GrabAnalysisUtil.doAnalysis(tokengrabParam.getUrl(), token_result,tokengrabParam);
		if(grabResultParam.getEntityType() == null) {
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "未定义token映射，无法生成对象，entityType is null", null,tokengrabParam.getId());
		}
		if(grabResultParam.getEntityType().getId()!= EntityTypeEnum.TOKEN.getId()) {
			String message = "token定义不正确，无法生成对象，entityType:"+ grabResultParam.getEntityType();
			throw new GrabException(ErrorTypeEnum.CONFIG, null, message, null,tokengrabParam.getId());
		}
		return ResultMappingUtil.mappingToToken(grabResultParam,grabResult.getResult());
	}

	private static String executeGet(SignSchema signSchema, String uri, ParamSchema paramSchema) throws Exception {
		if(httpClient == null){
			httpClient = getHttpClient();
		}
		//检查URL中是否存在替换参数
		uri = RequestParamHandleUtil.urlReplaceValue(uri,paramSchema);
		//获取所有参数
		Map<String, String> map = new HashMap<>();
		RequestParamHandleUtil.getRequestParamToMap(map, uri);

		if(paramSchema!=null && paramSchema.getParamMap() != null && !paramSchema.getParamMap().isEmpty()){
			for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) { 
				Object object = entry.getValue();
				if(object != null) {
					object = RequestParamHandleUtil.replaceValue(object);
				}
				String value = object ==null ? "":object.toString();
				map.put(entry.getKey(), value);
				uri = RequestParamHandleUtil.updateURL(uri, RequestParamHandleUtil.percentEncode(entry.getKey()), RequestParamHandleUtil.percentEncode(value));
			}
		}

		HttpGet httpGet = null;
		if(signSchema!=null ) {
			String sign = SignUtil.getSign(signSchema, map,paramSchema.getParamMap());
			if(StringUtil.isNotEmpty(sign)) {
				if(signSchema.getPositionEnum() == null) {
					signSchema.setPositionEnum(PositionEnum.URL);
				}
				switch (signSchema.getPositionEnum()) {
				case HEAD:
					httpGet = new HttpGet(uri);
					httpGet.addHeader(signSchema.getSignParamName(), sign);
					break;
				case URL:
					RequestParamHandleUtil.updateURL(uri, signSchema.getSignParamName(), sign);
					break;
				default:
					break;
				}
			}
		}
		if(httpGet == null) {
			httpGet = new HttpGet(uri);
		}
		httpGet.setConfig(requestConfig);
		HttpResponse response = httpClient.execute(httpGet);
		return EntityUtils.toString(response.getEntity(), Charset.forName("UTF-8"));
	}

	protected static String executePost(SignSchema signSchema, String uri, ParamSchema paramSchema,MethodTypeEnum methodType) throws Exception {
		if(httpClient == null){
			httpClient = getHttpClient();
		}
		//检查URL中是否存在替换参数
		uri = RequestParamHandleUtil.urlReplaceValue(uri,paramSchema);

		//获取所有参数
		Map<String, String> map = new HashMap<>();
		RequestParamHandleUtil.getRequestParamToMap(map, uri);

		List <NameValuePair> params = new ArrayList<NameValuePair>();  
		if(paramSchema!=null && paramSchema.getParamMap() != null && !paramSchema.getParamMap().isEmpty()){
			for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {  
				Object object = entry.getValue();
				if(object != null) {
					object = RequestParamHandleUtil.replaceValue(object);
				}
				String value = object ==null ? "":object.toString();
				//加入所有参数列表
				map.put(entry.getKey(), value);
				//根据相应提交方式加入相应列表
				if(methodType.getId() == MethodTypeEnum.POST_JSON_PARAM.getId()) {
					entry.setValue(value);
				}else if(methodType.getId() == MethodTypeEnum.POST_MAP_PARA.getId()) {
					params.add(new BasicNameValuePair(entry.getKey(), value));  
				}
			}
		}

		HttpPost httpPost = null;
		if(signSchema!=null ) {
			String sign = SignUtil.getSign(signSchema, map,paramSchema.getParamMap());
			if(StringUtil.isNotEmpty(sign)) {
				if(signSchema.getPositionEnum() == null) {
					signSchema.setPositionEnum(PositionEnum.URL);
				}
				switch (signSchema.getPositionEnum()) {
				case HEAD:
					httpPost = new HttpPost(uri);
					httpPost.addHeader(signSchema.getSignParamName(), sign);
					break;
				case URL:
					uri = RequestParamHandleUtil.updateURL(uri, signSchema.getSignParamName(), sign);
					break;
				default:
					break;
				}
			}
		}
		if(httpPost == null) {
			httpPost = new HttpPost(uri);
		}
		httpPost.setConfig(requestConfig);
		if(methodType.getId() == MethodTypeEnum.POST_JSON_PARAM.getId()) {
			httpPost.setEntity(new StringEntity(JSON.toJSONString(paramSchema.getParamMap()),HTTP.UTF_8));
		}else if(methodType.getId() == MethodTypeEnum.POST_MAP_PARA.getId()) {
			httpPost.setEntity(new UrlEncodedFormEntity(params,HTTP.UTF_8));
		}
		HttpResponse response = httpClient.execute(httpPost);
		return new BasicResponseHandler().handleResponse(response);
	}
	
	public static String getTokenUserId(Map<String, Object> values,String tokenRule) {
		if(values == null || values.isEmpty() || StringUtil.isEmpty(tokenRule)) {
			return null;
		}
		Object object = JSONPath.eval(values, tokenRule);
		return object == null?null:object.toString();
	}
}
