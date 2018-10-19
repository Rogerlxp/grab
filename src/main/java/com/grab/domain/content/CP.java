package com.grab.domain.content;

import java.io.Serializable;
import java.util.Date;

/**
 * CP对象
 * 
 * @author Roger
 */
public class CP implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -9087060830643630117L;
	
	private Integer cpId;
	private String name;
	private String enName;
	private String url;
	private String ico_url;
	private String expressions;
	private Integer status;
	private Integer type;
	private Integer automatic_capture;
	private String description;
	private Date updateTime;
	private Date createTime;
	private Integer level;
	private String class_path;
	private Integer insert_type;
	
	
	public Integer getCpId() {
		return cpId;
	}
	public void setCpId(Integer cpId) {
		this.cpId = cpId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEnName() {
		return enName;
	}
	public void setEnName(String enName) {
		this.enName = enName;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getIco_url() {
		return ico_url;
	}
	public void setIco_url(String ico_url) {
		this.ico_url = ico_url;
	}
	public String getExpressions() {
		return expressions;
	}
	public void setExpressions(String expressions) {
		this.expressions = expressions;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Integer getAutomatic_capture() {
		return automatic_capture;
	}
	public void setAutomatic_capture(Integer automatic_capture) {
		this.automatic_capture = automatic_capture;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Integer getLevel() {
		return level;
	}
	public void setLevel(Integer level) {
		this.level = level;
	}
	public String getClass_path() {
		return class_path;
	}
	public void setClass_path(String class_path) {
		this.class_path = class_path;
	}
	public Integer getInsert_type() {
		return insert_type;
	}
	public void setInsert_type(Integer insert_type) {
		this.insert_type = insert_type;
	}
	
	@Override
	public String toString() {
		return "CP [cpId=" + cpId + ", name=" + name + ", url=" + url + ", ico_url=" + ico_url + ", expressions="
				+ expressions + ", status=" + status + ", type=" + type + ", automatic_capture=" + automatic_capture
				+ ", description=" + description + ", updateTime=" + updateTime + ", createTime=" + createTime
				+ ", level=" + level + ", class_path=" + class_path + ", insert_type=" + insert_type + "]";
	}
	
}
