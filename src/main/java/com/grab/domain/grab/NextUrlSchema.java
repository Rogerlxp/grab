package com.grab.domain.grab;

import java.io.Serializable;
import java.util.List;


public class NextUrlSchema implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -1020327685123237990L;
	
	//下一跳爬抓模型
	private Integer grabId;
	
	private List<Schema> schemas;
	
	private List<NextUrlParamSchema> paramSchemas;
	
	//URL爬抓优先级
	private Integer priority;
	
	public Integer getGrabId() {
		return grabId;
	}
	public void setGrabId(Integer grabId) {
		this.grabId = grabId;
	}
	public Integer getPriority() {
		return priority;
	}
	public void setPriority(Integer priority) {
		this.priority = priority;
	}
	public List<Schema> getSchemas() {
		return schemas;
	}
	public void setSchemas(List<Schema> schemas) {
		this.schemas = schemas;
	}
	public List<NextUrlParamSchema> getParamSchemas() {
		return paramSchemas;
	}
	public void setParamSchemas(List<NextUrlParamSchema> paramSchemas) {
		this.paramSchemas = paramSchemas;
	}
	
}
