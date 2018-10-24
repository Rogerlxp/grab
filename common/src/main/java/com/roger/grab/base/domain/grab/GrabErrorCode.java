package com.roger.grab.base.domain.grab;

import java.io.Serializable;

/**
 * 爬抓异常码定义
 * @author Roger
 *
 */
public class GrabErrorCode implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2467927523236355301L;
	
	private Integer id;
	private Integer type;
	private String des;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getDes() {
		return des;
	}
	public void setDes(String des) {
		this.des = des;
	}
}
