package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.Date;

/**
 * 异常日志
 * @author Roger
 *
 */
public class GrabErrorLog implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 7456311691288363766L;
	private Integer id;
	private Integer grabId;
	private Integer processType;
	private Integer errorType;
	private Integer dataCode;
	private String message;
	private Date createTime;
	
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
	public Integer getProcessType() {
		return processType;
	}
	public void setProcessType(Integer processType) {
		this.processType = processType;
	}
	public Integer getErrorType() {
		return errorType;
	}
	public void setErrorType(Integer errorType) {
		this.errorType = errorType;
	}
	public Integer getDataCode() {
		return dataCode;
	}
	public void setDataCode(Integer dataCode) {
		this.dataCode = dataCode;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
}
