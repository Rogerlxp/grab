package com.grab.domain.content;

import java.io.Serializable;
import java.util.Date;

/**
 * 分类对象
 * 
 * @author Roger
 */
public class Category implements Serializable {
	private static final long serialVersionUID = 2067868513097659096L;

	private String cpId;

	private String cpCategoryId;
	
	private String name;

	private Integer dbId;
	
	private Date createTime;
	
	private Date updateTime;

	
	public String getCpId() {
		return cpId;
	}

	public void setCpId(String cpId) {
		this.cpId = cpId;
	}

	public String getCpCategoryId() {
		return cpCategoryId;
	}

	public void setCpCategoryId(String cpCategoryId) {
		this.cpCategoryId = cpCategoryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getDbId() {
		return dbId;
	}

	public void setDbId(Integer dbId) {
		this.dbId = dbId;
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
