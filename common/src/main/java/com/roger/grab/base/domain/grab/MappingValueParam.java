package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.Map;

import com.roger.grab.base.enums.grab.ParamMappingSelectEnum;



public class MappingValueParam implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -630258576461072206L;
	private String keyName;
	private Map<Object, Object> mappingMap;
	//未命中时选择策略
	private ParamMappingSelectEnum paramMappingSelectEnum = ParamMappingSelectEnum.ORIGINAL;
	//默认值
	private Object defaultValue;
	
	public String getKeyName() {
		return keyName;
	}
	public void setKeyName(String keyName) {
		this.keyName = keyName;
	}
	public Map<Object, Object> getMappingMap() {
		return mappingMap;
	}
	public void setMappingMap(Map<Object, Object> mappingMap) {
		this.mappingMap = mappingMap;
	}
	public ParamMappingSelectEnum getParamMappingSelectEnum() {
		return paramMappingSelectEnum;
	}
	public void setParamMappingSelectEnum(ParamMappingSelectEnum paramMappingSelectEnum) {
		this.paramMappingSelectEnum = paramMappingSelectEnum;
	}
	public Object getDefaultValue() {
		return defaultValue;
	}
	public void setDefaultValue(Object defaultValue) {
		this.defaultValue = defaultValue;
	}
}
