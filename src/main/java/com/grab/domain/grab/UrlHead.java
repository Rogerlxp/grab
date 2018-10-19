package com.grab.domain.grab;

import java.io.Serializable;

public class UrlHead implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1639305174245382510L;
	
	private String headName;
	private String headValue;
	
	
	public String getHeadName() {
		return headName;
	}
	public void setHeadName(String headName) {
		this.headName = headName;
	}
	public String getHeadValue() {
		return headValue;
	}
	public void setHeadValue(String headValue) {
		this.headValue = headValue;
	}
	
}
