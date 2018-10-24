package com.roger.grab.base.domain.grab;

import java.io.Serializable;

public class GrabModel implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1639305174245382510L;
	
	private Integer id;
	private String classBean;
	private String desc;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getClassBean() {
		return classBean;
	}
	public void setClassBean(String classBean) {
		this.classBean = classBean;
	}
}
