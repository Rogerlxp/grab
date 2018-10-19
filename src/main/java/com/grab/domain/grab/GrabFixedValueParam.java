package com.grab.domain.grab;

import java.io.Serializable;
import java.util.Map;

/**
 * 固定值配置对象
 * @author Roger
 *
 */
public class GrabFixedValueParam implements Serializable{
	private static final long serialVersionUID = -4660550500648282701L;
	
	private Map<String, Object> fixedValueMap;
	
	
	public Map<String, Object> getFixedValueMap() {
		return fixedValueMap;
	}
	public void setFixedValueMap(Map<String, Object> fixedValueMap) {
		this.fixedValueMap = fixedValueMap;
	}
}
