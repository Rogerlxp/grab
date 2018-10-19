package com.grab.grab.downloader;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.http.HttpHost;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Sets;
import com.grab.common.util.GrabConfigUtil;
import com.grab.common.util.RequestParamHandleUtil;
import com.grab.domain.exception.GrabException;
import com.grab.domain.grab.GrabParam;
import com.grab.domain.grab.GrabToken;
import com.grab.domain.grab.TokenSchema;
import com.grab.enums.grab.ErrorTypeEnum;
import com.grab.enums.grab.HandleProcessEnum;
import com.grab.enums.grab.StatusEnum;
import com.grab.service.grab.IGrabService;

import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.downloader.HttpClientGenerator;
@Service("GrabDownloader")
public class GrabDownloader extends us.codecraft.webmagic.downloader.HttpClientDownloader{
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	@Autowired
	private IGrabService grabService;
	
    private final Map<String, CloseableHttpClient> httpClients = new HashMap<String, CloseableHttpClient>();

    private HttpClientGenerator httpClientGenerator = new HttpClientGenerator();

    private CloseableHttpClient getHttpClient(Site site) {
        if (site == null) {
            return httpClientGenerator.getClient(null);
        }
        String domain = site.getDomain();
        CloseableHttpClient httpClient = httpClients.get(domain);
        if (httpClient == null) {
            synchronized (this) {
                httpClient = httpClients.get(domain);
                if (httpClient == null) {
                    httpClient = httpClientGenerator.getClient(site);
                    httpClients.put(domain, httpClient);
                }
            }
        }
        return httpClient;
    }

    @Override
    public Page download(Request request, Task task) {
        Site site = null;
        if (task != null) {
            site = task.getSite();
        }
        Set<Integer> acceptStatCode;
        String charset = null;
        Map<String, String> headers = null;
        if (site != null) {
            acceptStatCode = site.getAcceptStatCode();
            charset = site.getCharset();
            headers = site.getHeaders();
        } else {
            acceptStatCode = Sets.newHashSet(200);
        }
        LOGGER.info("downloading page {}", request.getUrl());
        CloseableHttpResponse httpResponse = null;
        int statusCode=0;
        try {
            HttpUriRequest httpUriRequest = getHttpUriRequest(request, site, headers);
            //生成 request 失败，已经添加过失败日志
            if(httpUriRequest == null) {
            	return null;
            }
            httpResponse = getHttpClient(site).execute(httpUriRequest);
            statusCode = httpResponse.getStatusLine().getStatusCode();
            request.putExtra(Request.STATUS_CODE, statusCode);
            if (statusAccept(acceptStatCode, statusCode)) {
                Page page = handleResponse(request, charset, httpResponse, task);
                onSuccess(request);
                return page;
            } else {
            	LOGGER.warn("code error " + statusCode + "\t" + request.getUrl());
            	onError(request,"返回非正常http code,code:"+statusCode,ErrorTypeEnum.HTTP);
                return null;
            }
        } catch (IOException e) {
        	LOGGER.warn("download page " + request.getUrl() + " error", e);
            if (site.getCycleRetryTimes() > 0) {
                return addToCycleRetry(request, site);
            }
            onError(request,e.getMessage(),ErrorTypeEnum.NETWORK);
            return null;
        } finally {
        	request.putExtra(Request.STATUS_CODE, statusCode);
            try {
                if (httpResponse != null) {
                    //ensure the connection is released back to pool
                    EntityUtils.consume(httpResponse.getEntity());
                }
            } catch (IOException e) {
            	LOGGER.warn("close response fail", e);
            }
        }
    }
	
	@Override
	protected HttpUriRequest getHttpUriRequest(Request request, Site site, Map<String, String> headers) {
		GrabParam grabParam = null;
		try{
			grabParam = GrabConfigUtil.getGrabParam(request);
			if(grabParam == null) {
				throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR, null, "request未添加grab,request:"+request, null, null);
			}
			//检查URL中是否存在替换参数
			grabParam.setUrl(RequestParamHandleUtil.urlReplaceValue(request.getUrl(),grabParam.getParamSchema()));
			//检查entity中是否顾在替换参数
			RequestParamHandleUtil.replaceEntityParam(grabParam);
			//添加token
			TokenSchema tokenSchema = grabParam.getTokenSchema();
			if(tokenSchema != null && tokenSchema.getTokenGrabId()!= null) {
				Map<String, Object> params = null;
				if(grabParam.getParamSchema()!=null) {
					params = grabParam.getParamSchema().getParamMap();
				}
				GrabToken token = grabService.getGrabToken(tokenSchema,params);
				RequestParamHandleUtil.addToken(token, headers,grabParam);
			}
			//添加签名
			RequestParamHandleUtil.addSign(headers,grabParam);
			RequestBuilder requestBuilder = selectRequestMethod(request).setUri(grabParam.getUrl());
			//添加head
			RequestParamHandleUtil.addHead(headers, requestBuilder,grabParam);
			//添加post参数
			RequestParamHandleUtil.addEntity(requestBuilder,grabParam);

			RequestConfig.Builder requestConfigBuilder = RequestConfig.custom()
					.setConnectionRequestTimeout(site.getTimeOut())
					.setSocketTimeout(site.getTimeOut())
					.setConnectTimeout(site.getTimeOut())
					.setCookieSpec(CookieSpecs.BEST_MATCH);
			if (site.getHttpProxyPool() != null && site.getHttpProxyPool().isEnable()) {
				HttpHost host = site.getHttpProxyFromPool();
				requestConfigBuilder.setProxy(host);
				request.putExtra(Request.PROXY, host);
			}else if(site.getHttpProxy()!= null){
				HttpHost host = site.getHttpProxy();
				requestConfigBuilder.setProxy(host);
				request.putExtra(Request.PROXY, host);	
			}
			requestBuilder.setConfig(requestConfigBuilder.build());
			grabService.statistics(grabParam.getId(), HandleProcessEnum.CREATE_REQUEST, null, StatusEnum.SUCCESS);
			return requestBuilder.build();
		}catch (GrabException e) {
    		grabService.addLog(grabParam.getId(),HandleProcessEnum.CREATE_REQUEST,e.getErrorTypeEnum(),e.getDataStatusCode(),e.getMessage(),e.getException());
		}
		return null;
	}

	@Override
    protected void onSuccess(Request request) {
		GrabParam grabParam = GrabConfigUtil.getGrabParam(request);
		if(grabParam == null) {
			LOGGER.error("request未添加grab!,request:"+request);
			return;
		}
		grabService.statistics(grabParam.getId(), HandleProcessEnum.GET_CONTENT, null,StatusEnum.SUCCESS);
    }

    protected void onError(Request request,String message,ErrorTypeEnum errorTypeEnum) {
		GrabParam grabParam = GrabConfigUtil.getGrabParam(request);
		if(grabParam == null) {
			LOGGER.error("request未添加grab!,request:"+request);
			return;
		}
		grabService.addLog(grabParam.getId(), HandleProcessEnum.GET_CONTENT, errorTypeEnum, null, message, null);
    }
}
