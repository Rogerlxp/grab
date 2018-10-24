package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.Map;

/**
 * 触发器参数
 * @author Roger
 *
 */
public class GrabTriggerParam implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -6600396396917859572L;
	
	//爬抓配置ID
	private Integer Id;
	//优先级
	private Integer priority;
	//参数
	private Map<String, Object> paramMap;
	public Integer getId() {
		return Id;
	}
	public void setId(Integer id) {
		Id = id;
	}
	public Map<String, Object> getParamMap() {
		return paramMap;
	}
	public void setParamMap(Map<String, Object> paramMap) {
		this.paramMap = paramMap;
	}
	public Integer getPriority() {
		return priority;
	}
	public void setPriority(Integer priority) {
		this.priority = priority;
	}
}
