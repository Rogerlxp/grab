package com.grab.grab.processor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.alibaba.fastjson.JSON;
import com.grab.common.framework.ILog;
import com.grab.common.framework.LogFactory;
import com.grab.common.util.GrabAnalysisUtil;
import com.grab.common.util.GrabNextUrlUtil;
import com.grab.domain.exception.GrabException;
import com.grab.domain.grab.GrabParam;
import com.grab.domain.grab.GrabResult;
import com.grab.domain.grab.GrabResultParam;
import com.grab.domain.grab.NextUrlSchema;
import com.grab.enums.grab.ErrorTypeEnum;
import com.grab.enums.grab.FieldConstant;
import com.grab.enums.grab.HandleProcessEnum;
import com.grab.enums.grab.StatusEnum;
import com.grab.service.grab.IGrabService;

import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;

/**
 * 解析器
 * 
 */
@Service("pageProcessor")
public class GrabPageProcessor implements PageProcessor {

    private static final ILog LOGGER = LogFactory.getLog(GrabPageProcessor.class);
    @Autowired
    private IGrabService grabService;
    

    @Override
    public void process(Page page) {
    	Object obj = page.getRequest().getExtra(FieldConstant.GRAB_CONFIG);
    	if (obj == null || !(obj instanceof GrabParam)) {
    		LOGGER.error("页面解析失败，未定义解析!");
    		return ;
    	}
    	GrabParam grabParam = null;
    	try {
    		grabParam = (GrabParam) obj;
    		GrabResult result = GrabAnalysisUtil.doAnalysis(page,grabParam);
    		if(checkSkip(result,grabParam)) {
    			//跳过结果，无须处理
    			page.getResultItems().setSkip(true);
    		}else {
    			page.putField(FieldConstant.RESULT, result);
    		}
    		addNextRequert(page,result,grabParam);
    		grabService.statistics(grabParam.getId(), HandleProcessEnum.EXTRACT, null, StatusEnum.SUCCESS);
    	}catch (GrabException e) {
    		grabService.addLog(grabParam.getId(),HandleProcessEnum.EXTRACT,e.getErrorTypeEnum(),e.getDataStatusCode(),e.getMessage(),e.getException());
    		page.getResultItems().setSkip(true);
    		onError(page,grabParam,e);
    	}
    }
    
    /**
     * 检查是否需要处理爬抓结果
     * @param result
     * @param grabParam
     * @return
     * @throws GrabException 
     */
    private boolean checkSkip(GrabResult result,GrabParam grabParam) throws GrabException {
    	if(result == null) {
    		return true;
    	}
    	if(result ==null || (result.getResult() == null && CollectionUtils.isEmpty(result.getArrayResult()))) {
    		return true;
    	}
    	GrabResultParam grabResultParam = grabService.getGrabResultParam(grabParam.getId());
    	if(grabResultParam == null || CollectionUtils.isEmpty(grabResultParam.getMappingSchemas())) {
    		return true;
    	}
    	result.setGrabResultParam(grabResultParam);
    	return false;
    }
    
    /**
     * 处理数据特定异常
     * @param grabParam
     * @param e
     */
    private void onError(Page page,GrabParam grabParam, GrabException e) {
    	if(e.getErrorTypeEnum()!= null && e.getErrorTypeEnum().getId() == ErrorTypeEnum.REF_TOKEN.getId()) {
    		Integer tokenGrabId = null;
    		if(grabParam != null && grabParam.getTokenSchema() != null && grabParam.getTokenSchema().getTokenGrabId()!=null) {
    			tokenGrabId = grabParam.getTokenSchema().getTokenGrabId();
    		}
    		boolean status = grabService.refGrabToken(tokenGrabId);
    		if(status) {
    			//加入重试
    			page.addTargetRequest(page.getRequest());
    		}
    	}
    }

	@Override
    public Site getSite() {
        return Site.me().setCharset("utf-8").setRetryTimes(3).setSleepTime(200).setTimeOut(10000);
    }
    
    /**
     * 生成下一链
     * @param page
     * @param grabParam
     * @throws GrabException 
     */
	private void addNextRequert(Page page,GrabResult grabResult, GrabParam grabParam) throws GrabException {
		try {
			if(grabParam == null || grabParam.getGrabExtractElement() == null || CollectionUtils.isEmpty(grabParam.getGrabExtractElement().getNextUrls())) {
				return ;
			} 
			List<Integer> grabIds = new ArrayList<>();
			for (NextUrlSchema n : grabParam.getGrabExtractElement().getNextUrls()) {
				grabIds.add(n.getGrabId());
			}
			List<GrabParam> grabParams = grabService.getGrabParam(grabIds);
			if(CollectionUtils.isEmpty(grabParams)) {
				throw new GrabException(ErrorTypeEnum.CONFIG, null, "下一链GrabId未定义，无法生成 下一链", null, grabParam.getId());
			}
			Map<Integer, GrabParam> grabParamMap = grabParams.stream().collect(Collectors.toMap(GrabParam::getId, g -> g));
			List<Request> requests = GrabNextUrlUtil.createNextRequest(grabParamMap,grabResult, grabParam,page);
			if(CollectionUtils.isEmpty(requests)){
				return ;
			}
			for (Request request : requests) {
				page.addTargetRequest(request);
			}
		}catch (Exception e) {
			StringBuffer message = new StringBuffer("下一链GrabId未定义，无法生成 下一链\n\r");
			message.append(e.getMessage()).append("\n\r");
			message.append(JSON.toJSONString(grabParam));
			throw new GrabException(ErrorTypeEnum.CONFIG, null, message.toString(), null, grabParam.getId());
		}
	}

}
