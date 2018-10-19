package com.grab.domain.grab;

import java.io.Serializable;

import com.grab.enums.grab.ObjectTypeEnum;

public class NextUrlParamSchema implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -3211922939924958072L;
	private String name;
	private String expression;
	private String elRule;
	private ObjectTypeEnum objectType;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getExpression() {
		return expression;
	}
	public void setExpression(String expression) {
		this.expression = expression;
	}
	public ObjectTypeEnum getObjectType() {
		return objectType;
	}
	public void setObjectType(ObjectTypeEnum objectType) {
		this.objectType = objectType;
	}
	public String getElRule() {
		return elRule;
	}
	public void setElRule(String elRule) {
		this.elRule = elRule;
	}
}
