package com.roger.grab.base.domain.grab;

import java.io.Serializable;

public class GrabModelField implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1639305174245382510L;
	
	private Integer id;
	private Integer modelId;
	private String name;
	private String type;
	private String desc;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public Integer getModelId() {
		return modelId;
	}
	public void setModelId(Integer modelId) {
		this.modelId = modelId;
	}
}
