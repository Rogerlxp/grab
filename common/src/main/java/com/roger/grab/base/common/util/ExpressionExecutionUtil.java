package com.roger.grab.base.common.util;

import java.util.Map;

import com.alibaba.simpleEL.dialect.tiny.TinyELEvalService;
import com.roger.grab.base.common.framework.ILog;
import com.roger.grab.base.common.framework.LogFactory;
import com.roger.grab.base.domain.grab.ExpiryMap;

public class ExpressionExecutionUtil {
	private static final ILog LOGGER = LogFactory.getLog(ExpressionExecutionUtil.class);
	private static final ExpiryMap<String, TinyELEvalService> TINYELEVALSERVICEMAP = new ExpiryMap<String, TinyELEvalService>(3000000000L);//本地保存50000分钟
	private static final ExpiryMap<String, TinyELEvalService> EXIT_RULE = new ExpiryMap<String, TinyELEvalService>(3000000000L);//本地保存50000分钟
	
	public  enum CacheSimpleElType {
		GRABRESULT(1, "grabResult"),
		PARAMRULE(2, "paramRule"),
		NEXTURLPARAM(3, "nextURLParam");

	    private int    id;  
	    private String name;

	    private CacheSimpleElType(int id, String name) {
	        this.id = id;
	        this.name = name;
	    }

	    public int getId() {
	        return id;
	    }

	    public String getName() {
	        return name;
	    }
	    
	    public String getName(Integer id) {
	        return String.format("%s:%s", name,id);
	    }
	}
	
	public static TinyELEvalService getSimpleElService(String serviceId) {
		if(serviceId == null) {
			return null;
		}
		return TINYELEVALSERVICEMAP.get(serviceId);
	}
	
	public static void putSimpleElService(CacheSimpleElType type,Integer id,TinyELEvalService service) {
		if(type == null || id == null || service == null) {
			return;
		}
		TINYELEVALSERVICEMAP.put(type.getName(id),service);
	}
	
	public static Object execution_simpleEl(String serviceId,TinyELEvalService service,String expression,Map<String,Object> env) {
		if(env == null || env.isEmpty() || service == null || StringUtil.isEmpty(expression)) {
			return null;
		}
		StringBuffer stringBuffer = new StringBuffer(serviceId == null?"":serviceId);
		stringBuffer.append(expression);
		String key = stringBuffer.toString();
		TinyELEvalService s = EXIT_RULE.get(key);
		if(s!=null && s == service) {
			return service.eval(env,expression);
		}else {
			synchronized(service) {
				s = EXIT_RULE.get(key);
				if(s == null) {
					Object object = service.eval(env,expression);
					EXIT_RULE.put(key, service);
					return object;
				}
			}
			return service.eval(env,expression);
		}
	}
}
