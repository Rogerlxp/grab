package com.roger.grab.base.domain.grab;

import java.io.Serializable;

import com.roger.grab.base.enums.grab.ObjectTypeEnum;


public class Schema implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -3211922939924958072L;
	private String name;
	private String expression;
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
}
