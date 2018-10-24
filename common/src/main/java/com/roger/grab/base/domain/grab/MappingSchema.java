package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.List;

public class MappingSchema implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -4399188355346347278L;
	
	//MappingMap 中的key(对应关系的key)
	private String keyName;
	//valueMap中的key(值的key)
	//private String valName;
	private List<String> valNames;
	//执行表达式
	private String expression;
	
	public String getKeyName() {
		return keyName;
	}
	public void setKeyName(String keyName) {
		this.keyName = keyName;
	}
	public List<String> getValNames() {
		return valNames;
	}
	public void setValNames(List<String> valNames) {
		this.valNames = valNames;
	}
	public String getExpression() {
		return expression;
	}
	public void setExpression(String expression) {
		this.expression = expression;
	}
}
