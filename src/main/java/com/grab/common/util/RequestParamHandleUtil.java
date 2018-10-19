package com.grab.common.util;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Array;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.grab.common.framework.ILog;
import com.grab.common.framework.LogFactory;
import com.grab.domain.exception.GrabException;
import com.grab.domain.grab.GrabParam;
import com.grab.domain.grab.GrabToken;
import com.grab.domain.grab.ParamSchema;
import com.grab.domain.grab.SignSchema;
import com.grab.domain.grab.TokenSchema;
import com.grab.domain.grab.UrlHead;
import com.grab.enums.grab.ErrorTypeEnum;
import com.grab.enums.grab.MethodTypeEnum;

public class RequestParamHandleUtil{
	private static final ILog LOGGER = LogFactory.getLog(RequestParamHandleUtil.class);
	private static final String KEY_FORMAT = "\\{key\\}";
	private static final String VALUE_FORMAT = "\\{value\\}";
	
	private static final Pattern GRAB_URL_PARAM_REPLACE = Pattern.compile("g_u_p_r_\\[[^]]*\\]");
	private static final Integer GRAB_URL_PARAM_REPLACE_BEGIN = 9;
	
	private static final String RANDOM_CHARACTER = "{random}";
	private static final String TIMESTAMP_INT_CHARACTER = "{timestamp_int}";
	private static final String TIMESTAMP_LONG_CHARACTER = "{timestamp_long}";
	private static final String TIMESTAMP_STRING_CHARACTER = "{timestamp_string}";
	private static final SimpleDateFormat TIME_STRING=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
	private static final  Random RANDOM = new Random(); 
	
	/**
	 *按规则生成单个参数串 
	 * @param key
	 * @param value
	 * @param format
	 * @return
	 */
	public static String createSingleParam(String key,String value,String format) {
		if(StringUtil.isEmpty(key)) {
			return null;
		}
		if(StringUtil.isEmpty(value)) {
			return null;
		}
		if(StringUtil.isEmpty(format)) {
			return null;
		}
		return format.replaceAll(KEY_FORMAT, key).replaceAll(VALUE_FORMAT, GrabRuleUtil.escapeExprSpecialWord(value));
	}
	
	/**
	 * 替换URL中的参数值
	 * @param url
	 * @return
	 * @throws Exception 
	 */
	public static String urlReplaceValue(String url,ParamSchema paramSchema) throws GrabException {
		if(StringUtil.isEmpty(url)) {
			return url;
		}
		Map<String, String> map = new HashMap<String, String>();
		getRequestParamToMap(map, url);
		if(!map.isEmpty()) {
			String domain = url.substring(0, url.indexOf("?")+1);
			if(paramSchema !=null ) {
				domain = replaceURL(domain,  paramSchema.getParamMap());
			}
			StringBuffer stringBuffer = new StringBuffer(domain);
			boolean hasParamMap = paramSchema!=null && paramSchema.getParamMap()!=null;
			Set<Map.Entry<String, String>> set = map.entrySet();
			for (Map.Entry<String, String> entry : set) {
				Object object = null;
				if(hasParamMap && paramSchema.getParamMap().get(entry.getKey())!=null) {
					//优先用生成的参数替换URL中的参数
					object = paramSchema.getParamMap().get(entry.getKey());
					paramSchema.getParamMap().remove(entry.getKey());
				}else {
					object = replaceValue(entry.getValue());
				}
				if(object==null) {
					object = "";
				}
				try {
					stringBuffer = updateURL(stringBuffer, entry.getKey(), URLEncoder.encode(object.toString(),"UTF-8"));
				} catch (UnsupportedEncodingException e) {
					throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR,null,"参数编码出错，key:"+entry.getKey()+",value:"+entry.getValue(),null,null);
				}
			}
			return stringBuffer.toString();
		}else {
			if(paramSchema !=null ) {
				url = replaceURL(url, paramSchema.getParamMap());
			}
		}
		return url;
	}
	
	/**
	 * 替换url中的占位参数
	 * @param url
	 * @param param
	 * @return
	 * @throws GrabException
	 */
	public static String replaceURL(String url,Map<String, Object> param) throws GrabException {
		if(param == null || param.isEmpty()) {
			return url;
		}
		Matcher matcher = GRAB_URL_PARAM_REPLACE.matcher(url);
		while(matcher.find()) {
			String urlKey = matcher.group();
			int endIndex = urlKey.length()-1;
			int beginIndex = Math.min(endIndex, GRAB_URL_PARAM_REPLACE_BEGIN);
			String key = urlKey.substring(beginIndex, endIndex);
			if(StringUtil.isEmpty(key)) {
				throw new GrabException(ErrorTypeEnum.CONFIG,null,"url中需替换的参数配置不正确",null,null);
			}
			Object o =  param.get(key);
			String value = o == null ? null:o.toString();
			if(StringUtil.isEmpty(value)) {
				throw new GrabException(ErrorTypeEnum.CONFIG,null,"未提供url中需替换的参数:"+key,null,null);
			}
			url = url.replace(urlKey, value);
			param.remove(key);
		}
		return url;
	}
	
	/**
	 * 获取请求参数
	 * @param map
	 * @param URL
	 */
	public static void getRequestParamToMap(Map<String, String> map,String URL){
		if(StringUtil.isEmpty(URL)) {
			return ;
		}
		int begin = URL.indexOf("?");
		if(begin<1 && URL.length() > begin+1) {
			return ;
		}
		URL = URL.substring(begin+1);
		if(StringUtil.isEmpty(URL)) {
			return;
		}

		String[] arrSplit=URL.split("[&]");
		for(String strSplit:arrSplit){
			String[] arrSplitEqual = strSplit.split("[=]");
			//解析出键值
			if(arrSplitEqual.length>1){
				//正确解析
				map.put(arrSplitEqual[0], arrSplitEqual[1]);
			}else{
				if(arrSplitEqual[0]!=""){
					//只有参数没有值，不加入
					map.put(arrSplitEqual[0], "");       
				}
			}
		}   
	}
	
	/**
	 * 将生成参数添加入URL，生成新URL
	 * @param url
	 * @param key
	 * @param value
	 * @return
	 */
	public static String updateURL(String url, String key, String value) {
		if(StringUtil.isEmpty(url)) {
			return null;
		}
		StringBuffer urlbuffer = new StringBuffer(url);
		int index = url.indexOf("?"); 
		if(index > -1) {
			//非最后一个
			if(url.length() > index+1) {
				urlbuffer.append("&");
			}
		}else {
			urlbuffer.append("?");
		}
		urlbuffer.append(key).append("=").append(value);
		return urlbuffer.toString();
	}
	
	/**
	 * 将生成参数添加入URL，生成新URL
	 * @param url
	 * @param key
	 * @param value
	 * @return
	 */
	public static StringBuffer updateURL(StringBuffer url, String key, String value) {
		if(StringUtil.isEmpty(key)) {
			return url;
		}
		if(StringUtil.isEmpty(value)) {
			return url;
		}
		if(url == null) {
			url = new StringBuffer();
		}
		int index = url.indexOf("?"); 
		if(index > -1) {
			//非最后一个
			if(url.length() > index+1) {
				url.append("&");
			}
		}else {
			url.append("?");
		}
		url.append(key).append("=").append(value);
		return url;
	}
	
	/**
	 *  将生成参数添加入URL，生成新URL
	 * @param url
	 * @return
	 */
	public static String updateURL(String url,Map<String, String> map) {
		if(StringUtil.isEmpty(url)) {
			return url;
		}
		if(map == null || map.isEmpty()) {
			return url;
		}

		StringBuffer stringBuffer = new StringBuffer(url);
		int index = url.indexOf("?"); 
		if(index > -1) {
			//非最后一个
			if(url.length() > index+1) {
				stringBuffer.append("&");
			}
		}else {
			stringBuffer.append("?");
		}
		for (Map.Entry<String, String> entry : map.entrySet()) {
			Object object = replaceValue(entry.getValue());
			if(object==null) {
				object = "";
			}
			stringBuffer = updateURL(stringBuffer, entry.getKey(), entry.getValue());
		}
		return stringBuffer.toString();
	}
	
	/**
	 * 替换参数
	 * @param value
	 * @return
	 */
	public static Object replaceValue(Object object) {
		String value = object.toString();
		if(StringUtil.isEmpty(value)) {
			return object;
		}
		if(value.equalsIgnoreCase(RANDOM_CHARACTER)) {
			return Math.abs(RANDOM.nextInt());
		}
		if(value.equalsIgnoreCase(TIMESTAMP_INT_CHARACTER)) {
			return System.currentTimeMillis()/1000;
		}
		if(value.equalsIgnoreCase(TIMESTAMP_LONG_CHARACTER)) {
			return System.currentTimeMillis();
		}
		if(value.equalsIgnoreCase(TIMESTAMP_STRING_CHARACTER)) {
			return TIME_STRING.format(new Date());
		}
		return object;
	}
	
	/**
	 * 编码参数
	 * @param value
	 * @return
	 */
	public static String percentEncode( String value ){
		if( value == null ){
			return "";
		}

		try{
			return URLEncoder.encode( value, "UTF-8" )
					.replace( "+", "%20" ).replace( "*", "%2A" )
					.replace( "%7E", "~" );
		} catch( UnsupportedEncodingException ex ){
			LOGGER.error(ex.getMessage() + "[value=" + value + "]", ex);
		}

		return value;
	}
	
	/**
	 * 获取生成参数
	 * @param grabParam
	 * @param valueParamMap
	 * @return
	 * @throws GrabException
	 */
	public static Map<String, Object> createParamMap(GrabParam grabParam, Map<String, Object> valueParamMap) throws GrabException {
		//参数配置
		ParamSchema paramSchema = grabParam.getParamSchema();
		if(paramSchema == null) {
			return null;
		}
		Map<String, Object> baseParamMap = paramSchema.getParamMap();
		Map<String, Object> paramMap = new HashMap<>();
		if(paramSchema != null && baseParamMap!=null) {
			StringBuffer stringBuffer = new StringBuffer();
			boolean isError = false;
			for (String key : baseParamMap.keySet()) {
				if(valueParamMap.get(key)!=null) {
					//结果中存在该值
					Object object = valueParamMap.get(key);
					if(object instanceof Map && !(object instanceof JSONObject )) {
						object = JSONObject.parseObject(JSON.toJSONString(object));
					}
					paramMap.put(key, object);
					continue;
				}else if(baseParamMap.get(key)!=null){
					//配置中存在默认值
					Object object = baseParamMap.get(key);
					if(object instanceof Map && !(object instanceof JSONObject )) {
						object = JSONObject.parseObject(JSON.toJSONString(object));
					}
					paramMap.put(key, object);
				}else {
					stringBuffer.append(key).append(",");
					isError = true;
				}
			}
			if(isError) {
				String message = "生成下一链失败，所需必须参数提取为null,参数key:"+stringBuffer.toString();
				throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR, null, message, null, grabParam.getId());
			}
		}
		return paramMap;
	}
	
	public static Map<String, Object> createParamMap(Map<String, Object> baseParamMap, Map<String, Object> valueParamMap,String base) {
		//参数配置
		if(baseParamMap == null || baseParamMap.isEmpty()) {
			return null;
		}
		Map<String, Object> paramMap = new HashMap<>();
		StringBuffer stringBuffer = new StringBuffer();
		for (String key : baseParamMap.keySet()) {
			Object value = baseParamMap.get(key);
			if(value != null && value instanceof JSONObject) {
				Map<String, Object> nextParamMap = new HashMap();
				_createParamMap_handlerObject(nextParamMap, key, value, valueParamMap, base, stringBuffer);
				paramMap.put(key, nextParamMap);
				continue;
			}else if(value != null && value instanceof JSONArray) {
				value = ((JSONArray)value).get(0);
				Object valueArrayObject = valueParamMap.get(key);
				if(valueArrayObject == null) {
					stringBuffer.append(key).append(",");
				}else if(valueArrayObject instanceof JSONArray) {
					JSONArray jsonArray = (JSONArray)valueArrayObject;
					int count = jsonArray.size();
					if(count<=0) {
						stringBuffer.append(base).append(key).append(" 参数为list，但list中传入了 0 个 对象,");
						continue;
					}
					boolean isNotNull = false; 
					for (int i=0; i<count;i++) {
						Object object = jsonArray.get(i);
						if(object == null) {
							stringBuffer.append(base).append(key).append("[").append(i).append("]").append(" 为null,");
							continue;
						}
						isNotNull = true;
						_createParamMap_handlerObject(paramMap, key, object, valueParamMap, base, stringBuffer);
					}
					if(isNotNull) {
						stringBuffer.append(base).append(key).append(" 参数为list，但list中传入了 0 个非null 对象,");
						continue;
					}
				}else if(valueArrayObject.getClass().isArray()) {
					
				}else {
					stringBuffer.append(base).append(key).append(" 参数为list 传入了单个对象,");
					continue;
				}
			}
			else {
				_createParamMap_handlerValue(paramMap,key,baseParamMap,valueParamMap,base,stringBuffer);
			}
		}
		return paramMap;
	}
	
	/**
	 * 当参数为对象类型时，需要向下展开检查对象内的属性值是否满足参数要求
	 * 取 baseValueObject 中的属性  或  valueParamMap 中 key 的对象的属性 ，生成key参数 放入paramMap中
	 * 或无key参数时，生成相应日志带回
	 * @param paramMap
	 * @param key
	 * @param baseValueObject
	 * @param valueParamMap
	 * @param base
	 * @param stringBuffer
	 */
	private static void _createParamMap_handlerObject(Map<String, Object> paramMap,String key,Object baseValueObject, Map<String, Object> valueParamMap,String base,StringBuffer stringBuffer) {
		Map<String, Object> nextBaseMap = (Map<String, Object>) JSONObject.parseArray(baseValueObject.toString(), Map.class);
		Object nextValueParamMap = valueParamMap.get(key);
		if(nextBaseMap == null) {
			nextBaseMap = new HashMap<>();
		}
		if(nextValueParamMap instanceof Map) {
			if(base == null) {
				base = "";
			}
			String nextBase = base + key + ".";
			paramMap.put(key,createParamMap(nextBaseMap, (Map<String, Object>)nextValueParamMap,nextBase));
		}else {
			stringBuffer.append(base).append(key).append(",");
		}
	}
	
	/**
	 * 从baseParamMap 或 valueParamMap中生成 参数key 放入paramMap中
	 * 或无key参数时，生成相应日志带回
	 * @param paramMap
	 * @param key
	 * @param baseParamMap
	 * @param valueParamMap
	 * @param base
	 * @param stringBuffer
	 */
	private static void _createParamMap_handlerValue(Map<String, Object> paramMap,String key,Map<String, Object> baseParamMap, Map<String, Object> valueParamMap,String base,StringBuffer stringBuffer) {
		if(valueParamMap.get(key)!=null) {
			//结果中存在该值
			paramMap.put(key, valueParamMap.get(key));
		}else if(baseParamMap.get(key)!=null){
			//配置中存在默认值
			paramMap.put(key, baseParamMap.get(key));
		}else {
			stringBuffer.append(base).append(key).append(",");
		}
	}
	
	/**
	 * 替换entity中的参数替代值
	 * @param request
	 */
	public static void replaceEntityParam(GrabParam grabParam) {
		ParamSchema paramSchema = grabParam.getParamSchema();
		if(paramSchema!=null ) {
			replaceEntityParam(paramSchema.getParamMap());
		}
	}
	
	/**
	 * 层级化检查
	 * @param map
	 */
	private static void replaceEntityParam(Map<String, Object> map) {
		if(map!=null) {
			for (Map.Entry<String, Object> entry : map.entrySet()) {
				Object object = entry.getValue();
				if(object == null) {
					continue;
				}else if(object instanceof Map) {
					replaceEntityParam((Map)object);
				}else if(object instanceof List ){
					List list = (List)object;
					for (Object object2 : list) {
						if(object2 instanceof Map) {
							replaceEntityParam((Map)object2);
						}
					}
				}else if(object.getClass().isArray()  ){
					int count = Array.getLength(object);
					for (int i = 0;i<count;i++) {
						Object object2 = Array.get(object, i);
						if(object2 instanceof Map) {
							replaceEntityParam((Map)object2);
						}
					}
				}else if(object!=null) {
					entry.setValue(RequestParamHandleUtil.replaceValue(object));
				}
			}
		}
	}
	
	/**
	 * 添加token
	 * @param request
	 * @param requestBuilder
	 * @throws Exception 
	 */
	public static void addToken(GrabToken grabToken,Map<String, String> headers,GrabParam grabParam) throws GrabException {
		TokenSchema tokenSchema = grabParam.getTokenSchema();
		if(tokenSchema!=null) {
			if(tokenSchema.getPositionEnum()!=null && StringUtil.isNotEmpty(tokenSchema.getTokenName())) {
				if(grabToken!=null && StringUtil.isNotEmpty(grabToken.getToken())) {
					switch (tokenSchema.getPositionEnum()) {
					case HEAD:
						if(headers == null) {
							headers = new HashMap<>();
						}
						headers.put(tokenSchema.getTokenName(), grabToken.getToken());
						break;
					case URL:
						String url = RequestParamHandleUtil.updateURL(grabParam.getUrl(), tokenSchema.getTokenName(), grabToken.getToken());
						grabParam.setUrl(url);
						break;
					case ENTITY:
						ParamSchema paramSchema = grabParam == null ? null:grabParam.getParamSchema();
						if(paramSchema == null) {
							paramSchema = new ParamSchema();
						}
						if(paramSchema.getParamMap() == null) {
							paramSchema.setParamMap(new HashMap<>());
						}
						paramSchema.getParamMap().put(tokenSchema.getTokenName(), grabToken.getToken());
						grabParam.setParamSchema(paramSchema);
						break;
					default:
						break;
					}
				}
			}
		}
	}
	
	/**
	 * 添加签名
	 * @param request
	 * @param requestBuilder
	 * @throws GrabException 
	 */
	public static void addSign(Map<String, String> headers,GrabParam grabParam) throws GrabException {
		SignSchema signSchema = grabParam.getSignSchema();
		if(signSchema ==null || signSchema.getId() == null) {
			return ;
		} 
		ParamSchema paramSchema = grabParam.getParamSchema();
		//获取entity参数
		Map<String, String> map = new HashMap<String, String>();
		if(paramSchema!=null && paramSchema.getParamMap()!=null) {
			for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {
				Object object = entry.getValue();
				map.put(entry.getKey(), object == null ? "":object.toString());
			}
		}
		//获取URL中参数
		RequestParamHandleUtil.getRequestParamToMap(map,grabParam.getUrl());
		String sign = SignUtil.getSign(signSchema,map,paramSchema.getParamMap());
		if(StringUtil.isNotEmpty(sign)) {
			switch (signSchema.getPositionEnum()) {
			case HEAD:
				if(headers == null) {
					headers = new HashMap<>();
				}
				headers.put(signSchema.getSignParamName(), sign);
				break;
			case URL:
				String url = RequestParamHandleUtil.updateURL(grabParam.getUrl(), signSchema.getSignParamName(), sign);
				grabParam.setUrl(url);
				break;
			case ENTITY:
				if(paramSchema == null) {
					paramSchema = new ParamSchema();
				}
				if(paramSchema.getParamMap() == null) {
					paramSchema.setParamMap(new HashMap<>());
				}
				paramSchema.getParamMap().put(signSchema.getSignParamName(), sign);
				grabParam.setParamSchema(paramSchema);
				break;
			default:
				break;
			}
		}
	}
	/**
	 * 添加head
	 * @param request
	 * @param headers
	 * @param requestBuilder
	 */
	public static void addHead(Map<String, String> headers, RequestBuilder requestBuilder,GrabParam grabParam) {
		List<UrlHead> heads = grabParam.getHeads();
		if(heads !=null && !heads.isEmpty()){
			for (UrlHead head : heads) {
				if(StringUtil.isNotEmpty(head.getHeadName())){
					requestBuilder.setHeader(head.getHeadName(),head.getHeadValue());
				}
			}
		}
		if (headers != null) {
            for (Map.Entry<String, String> headerEntry : headers.entrySet()) {
                requestBuilder.setHeader(headerEntry.getKey(), headerEntry.getValue());
            }
        }
	}
	
	/**
	 * 添加head
	 * @param request
	 * @param headers
	 * @param requestBase
	 */
	public static void addHead(Map<String, String> headers, HttpRequestBase requestBase,GrabParam grabParam) {
		List<UrlHead> heads = grabParam.getHeads();
		if(heads !=null && !heads.isEmpty()){
			for (UrlHead head : heads) {
				if(StringUtil.isNotEmpty(head.getHeadName())){
					requestBase.setHeader(head.getHeadName(),head.getHeadValue());
				}
			}
		}
		if (headers != null) {
            for (Map.Entry<String, String> headerEntry : headers.entrySet()) {
                requestBase.setHeader(headerEntry.getKey(), headerEntry.getValue());
            }
        }
	}
	
	public static void addEntity(RequestBuilder requestBuilder,GrabParam grabParam) throws GrabException {
		ParamSchema paramSchema = grabParam.getParamSchema();
		if(paramSchema!=null && paramSchema.getParamMap()!=null && !paramSchema.getParamMap().isEmpty()) {
			if(grabParam.getMethodType() == null) {
				grabParam.setMethodType(MethodTypeEnum.GET);
			}
			switch (grabParam.getMethodType()) {
			case GET:
				//取出entity中的参数放入URL中提交
				for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {
					Object object = entry.getValue();
					if(StringUtil.isNotEmpty(entry.getKey()) && object!=null) {
						grabParam.setUrl(RequestParamHandleUtil.updateURL(grabParam.getUrl(), entry.getKey(), object.toString()));
					}
				}
				requestBuilder.setUri(grabParam.getUrl());
				break;
			case POST_JSON_PARAM:
				//json形式提交
				requestBuilder.setEntity(new StringEntity(JSON.toJSONString(paramSchema.getParamMap()),HTTP.UTF_8));
				break;
			case POST_MAP_PARA:
				//map形式提交
				List <NameValuePair> params = new ArrayList<NameValuePair>();  
				for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {
					Object object = entry.getValue();
					String value = object ==null ? "":object.toString();
					if(StringUtil.isNotEmpty(entry.getKey()) && object!=null) {
						params.add(new BasicNameValuePair(entry.getKey(), value)); 
					}
				}
				try {
					requestBuilder.setEntity(new UrlEncodedFormEntity(params,HTTP.UTF_8));
				} catch (UnsupportedEncodingException e) {
					LOGGER.error("添加post entity失败,url:"+requestBuilder.getUri(),e);
					throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR, null, "post请求中添加entity失败", e, grabParam.getId());
				}
				break;
			default:
				break;
			}
		}
	}
	
	public static void addEntity_httpPost(HttpPost httpPost,GrabParam grabParam) throws GrabException {
		ParamSchema paramSchema = grabParam.getParamSchema();
		if(paramSchema!=null && paramSchema.getParamMap()!=null && !paramSchema.getParamMap().isEmpty()) {
			if(grabParam.getMethodType() == null) {
				grabParam.setMethodType(MethodTypeEnum.GET);
			}
			switch (grabParam.getMethodType()) {
			case GET:
				//取出entity中的参数放入URL中提交
				for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {
					Object object = entry.getValue();
					if(StringUtil.isNotEmpty(entry.getKey()) && object!=null) {
						try {
							grabParam.setUrl(RequestParamHandleUtil.updateURL(grabParam.getUrl(), entry.getKey(), URLEncoder.encode(object.toString(),"UTF-8")));
						} catch (UnsupportedEncodingException e) {
							LOGGER.error("url encode error", e);
							throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR, null, "url encode error", e, grabParam.getId());
						}
					}
				}
				break;
			case POST_JSON_PARAM:
				//json形式提交
				if(httpPost == null) {
					return;
				}
				httpPost.setEntity(new StringEntity(JSON.toJSONString(paramSchema.getParamMap()),HTTP.UTF_8));
				break;
			case POST_MAP_PARA:
				//map形式提交
				if(httpPost == null) {
					return;
				}
				List <NameValuePair> params = new ArrayList<NameValuePair>();  
				for (Map.Entry<String, Object> entry : paramSchema.getParamMap().entrySet()) {
					Object object = entry.getValue();
					String value = object ==null ? "":object.toString();
					if(entry.getKey()!=null && object!=null) {
						params.add(new BasicNameValuePair(entry.getKey(), value)); 
					}
				}
				try {
					httpPost.setEntity(new UrlEncodedFormEntity(params,HTTP.UTF_8));
				} catch (UnsupportedEncodingException e) {
					LOGGER.error("添加post entity失败,url:"+httpPost.getURI().getPath(),e);
					throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR, null, "post请求中添加entity失败", e, grabParam.getId());
				}
				break;
			default:
				break;
			}
		}
	}
}
