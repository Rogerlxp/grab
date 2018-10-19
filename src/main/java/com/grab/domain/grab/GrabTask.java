package com.grab.domain.grab;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.grab.common.util.StringUtil;

/**
 * 爬抓Task配置
 * @author Roger
 *
 */
public class GrabTask implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 6335362844844305039L;
	
	private Integer id;
	private Integer grabId;
	private Map<String, Object> params;
	private Integer space;
	private Integer nextRunTime;
	private Integer lastRunTime;
	private Integer status;
	private Date createTime;
	private Date updateTime;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getGrabId() {
		return grabId;
	}
	public void setGrabId(Integer grabId) {
		this.grabId = grabId;
	}
	public Map<String, Object> getParams() {
		return params;
	}
	public void setParams(Map<String, Object> params) {
		this.params = params;
	}
	public String getParamString() {
		if(params==null || params.isEmpty()) {
			return null;
		}
		return JSON.toJSONString(params);
	}
	public void setParamString(String params) {
		if(!StringUtil.isEmpty(params)) {
			this.params = JSON.parseObject(params, Map.class);
		}
	}
	public Integer getSpace() {
		return space;
	}
	public void setSpace(Integer space) {
		this.space = space;
	}
	public Integer getNextRunTime() {
		return nextRunTime;
	}
	public void setNextRunTime(Integer nextRunTime) {
		this.nextRunTime = nextRunTime;
	}
	public Integer getLastRunTime() {
		return lastRunTime;
	}
	public void setLastRunTime(Integer lastRunTime) {
		this.lastRunTime = lastRunTime;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
}
