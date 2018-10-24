package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.Map;


public class ParamSchema implements Serializable{
	private static final long serialVersionUID = 9159340707182425560L;
	
	//参数
	private Map<String, Object> paramMap;
	
	public Map<String, Object> getParamMap() {
		return paramMap;
	}
	public void setParamMap(Map<String, Object> paramMap) {
		this.paramMap = paramMap;
	}
}
