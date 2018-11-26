package com.roger.grab.base.common.httpClient;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.roger.grab.base.common.framework.ILog;
import com.roger.grab.base.common.framework.LogFactory;
import com.roger.grab.base.common.util.GrabAnalysisUtil;
import com.roger.grab.base.common.util.RequestParamHandleUtil;
import com.roger.grab.base.common.util.StringUtil;
import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabResult;
import com.roger.grab.base.domain.grab.GrabSite;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.GrabTriggerParam;
import com.roger.grab.base.domain.grab.TokenSchema;
import com.roger.grab.base.enums.grab.ErrorTypeEnum;
import com.roger.grab.base.enums.grab.MethodTypeEnum;

import us.codecraft.webmagic.selector.Html;
import us.codecraft.webmagic.utils.UrlUtils;

@Service
public class GrabHttpClient {
	private static final ILog LOGGER = LogFactory.getLog(GrabHttpClient.class);
	
	private static ScheduledExecutorService scheduledExecutorService;
	private static HttpClient httpClient;
	private static RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(900).setConnectTimeout(1500).setConnectionRequestTimeout(100).build();  

	private static Integer maxTotal;
	private static Integer maxPerRoute;
	
	public static void setMaxTotal(Integer maxTotal) {
		GrabHttpClient.maxTotal = maxTotal;
	}

	public static void setMaxPerRoute(Integer maxPerRoute) {
		GrabHttpClient.maxPerRoute = maxPerRoute;
	}

	private static HttpClient getHttpClient(){
		if(httpClient !=null){
			return httpClient;
		}
		synchronized(requestConfig){
			PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
			// 设置最大连接数
			if(maxTotal==null || maxTotal <= 0) {
				maxTotal = 1000;
			}
			cm.setMaxTotal(maxTotal);
			// 设置每个主机地址的并发数
			if(maxPerRoute==null || maxPerRoute <= 0) {
				maxPerRoute = 100;
			}
			cm.setDefaultMaxPerRoute(maxPerRoute);
//			httpClient = HttpClients.custom().setConnectionManager(cm).build();
			httpClient = HttpClients.custom().setConnectionManager(cm).setConnectionTimeToLive(30, TimeUnit.SECONDS).setKeepAliveStrategy(new GrabKeepAliveStrategy()).build();
			
			//30秒回收一次
			scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
			Runnable idleConnectionMonitorThread = new Runnable(){
				@Override
				public void run() {
					try {
						cm.closeExpiredConnections();
						cm.closeIdleConnections(30, TimeUnit.SECONDS);
					}catch (Exception e) {
						LOGGER.error("主动回收连接失败，message:"+e.getMessage(),e);
					}
				}
			};
			scheduledExecutorService.scheduleWithFixedDelay(idleConnectionMonitorThread, 10, 30, TimeUnit.SECONDS);
			return httpClient; 
		}
	}
	
	/**
	 * 获取http返回
	 * @param grabTriggerParam
	 * @return
	 * @throws GrabException
	 */
	public static GrabResult doHttp(GrabTriggerParam grabTriggerParam,GrabParam grabParam,GrabSite grabSite,GrabToken token) throws GrabException {
		String result = doHttpOriginal(grabTriggerParam, grabParam, grabSite, token);
		switch (grabParam.getGrabExtractElement().getType()) {
		case HTML:
			Html html = new Html(result);
			return GrabAnalysisUtil._doAnalysis(grabParam.getUrl(),html, grabParam);
		case JSON:
		case JSONP:
			return GrabAnalysisUtil.doAnalysis(grabParam.getUrl(), result, grabParam);
		default:
			break;
		}
    	return null;
	}
	
	public static String doHttpOriginal(GrabTriggerParam grabTriggerParam,GrabParam grabParam,GrabSite grabSite,GrabToken token) throws GrabException {
		if(grabTriggerParam == null || grabTriggerParam.getId() == null ) {
			return null;
		}
		
		if(grabParam == null || grabParam.getId() == null || StringUtil.isEmpty(grabParam.getUrl())) {
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "爬抓grab配置错误,grabId"+grabTriggerParam.getId(), null, grabTriggerParam.getId());
		}
		if(grabParam.getParamSchema()!=null) {
			grabParam.getParamSchema().setParamMap(RequestParamHandleUtil.createParamMap(grabParam, grabTriggerParam.getParamMap()));
		}
		
		//检查URL中是否存在替换参数
		grabParam.setUrl(RequestParamHandleUtil.urlReplaceValue(grabParam.getUrl(),grabParam.getParamSchema()));
		//检查entity中是否顾在替换参数
		RequestParamHandleUtil.replaceEntityParam(grabParam);
		//添加token
		Map<String, String> headers = new HashMap<>();
		TokenSchema tokenSchema = grabParam.getTokenSchema();
		if(tokenSchema != null && token!= null) {
			RequestParamHandleUtil.addToken(token, headers,grabParam);
		}
		//添加签名
		RequestParamHandleUtil.addSign(headers,grabParam);
//		RequestBuilder requestBuilder = selectRequestMethod(grabParam);
//		//添加head
//		RequestParamHandleUtil.addHead(headers,requestBuilder,grabParam);
//		//添加post参数
//		RequestParamHandleUtil.addEntity(requestBuilder,grabParam);
//		requestBuilder.setConfig(requestConfig);
		
		HttpRequestBase httpRequestBase =getRequest(grabParam, headers);
		
		String result = null; 
		try {
//			HttpResponse httpResponse = getHttpClient().execute(requestBuilder.build());
			HttpResponse httpResponse = getHttpClient().execute(httpRequestBase);
			result = getContent(grabSite == null ? null:grabSite.getCharset(), httpResponse);
		} catch (IOException e) {
			throw new GrabException(ErrorTypeEnum.HTTP, null, e.getMessage(), e, grabParam.getId());
		}
		return result;
	}
	
	private static HttpRequestBase getRequest(GrabParam grabParam,Map<String, String> headers) throws GrabException {
		MethodTypeEnum method = grabParam.getMethodType();
		if (method == null || method.equals(MethodTypeEnum.GET)) {
			//default get
			RequestParamHandleUtil.addEntity_httpPost(null,grabParam);
			HttpGet httpGet = new HttpGet(grabParam.getUrl());
			httpGet.setConfig(requestConfig);
			RequestParamHandleUtil.addHead(headers,httpGet,grabParam);
			LOGGER.debug("http get:"+grabParam.getUrl());
			return httpGet;
		} else if (method.equals(MethodTypeEnum.POST_JSON_PARAM) || method.equals(MethodTypeEnum.POST_MAP_PARA)) {
			HttpPost httpPost = new HttpPost(grabParam.getUrl());
			httpPost.setConfig(requestConfig);
			RequestParamHandleUtil.addHead(headers,httpPost,grabParam);
			RequestParamHandleUtil.addEntity_httpPost(httpPost,grabParam);
			String params = null;
			if(grabParam.getParamSchema()!=null) {
				params = JSON.toJSONString(grabParam.getParamSchema().getParamMap());
			}
			LOGGER.debug("http post:"+grabParam.getUrl()+"  params:"+params);
			return httpPost;
		}
		throw new GrabException(ErrorTypeEnum.CONFIG, null, "请求方式配置错误", null, grabParam.getId());
	}
	
	private static RequestBuilder selectRequestMethod(GrabParam grabParam) throws GrabException {
		MethodTypeEnum method = grabParam.getMethodType();
		if (method == null || method.equals(MethodTypeEnum.GET)) {
			//default get
			return RequestBuilder.get().setUri(grabParam.getUrl());
		} else if (method.equals(MethodTypeEnum.POST_JSON_PARAM) || method.equals(MethodTypeEnum.POST_MAP_PARA)) {
			return RequestBuilder.post().setUri(grabParam.getUrl());
		}
		throw new GrabException(ErrorTypeEnum.CONFIG, null, "请求方式配置错误", null, grabParam.getId());
	}
	
	private static String getContent(String charset, HttpResponse httpResponse) throws IOException {
		if (charset == null) {
			charset = "UTF-8";
		} 
		return EntityUtils.toString(httpResponse.getEntity(), Charset.forName(charset));
	}
    
    private static String getHtmlCharset(HttpResponse httpResponse, byte[] contentBytes) throws IOException {
        String charset;
        String value = httpResponse.getEntity().getContentType().getValue();
        charset = UrlUtils.getCharset(value);
        if (StringUtils.isNotBlank(charset)) {
            LOGGER.debug(String.format("Auto get charset: {%s}", charset));
            return charset;
        }
        // use default charset to decode first time
        Charset defaultCharset = Charset.defaultCharset();
        String content = new String(contentBytes, defaultCharset.name());
        if (StringUtils.isNotEmpty(content)) {
            Document document = Jsoup.parse(content);
            Elements links = document.select("meta");
            for (Element link : links) {
                String metaContent = link.attr("content");
                String metaCharset = link.attr("charset");
                if (metaContent.indexOf("charset") != -1) {
                    metaContent = metaContent.substring(metaContent.indexOf("charset"), metaContent.length());
                    charset = metaContent.split("=")[1];
                    break;
                }
                else if (StringUtils.isNotEmpty(metaCharset)) {
                    charset = metaCharset;
                    break;
                }
            }
        }
        LOGGER.debug(String.format("Auto get charset: {%s}", charset));
        return charset;
    }
}
