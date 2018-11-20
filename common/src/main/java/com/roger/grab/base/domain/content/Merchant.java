package com.roger.grab.base.domain.content;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;



/**
 * 商品对象
 * 
 * @author Roger
 */
public class Merchant implements Serializable {
	private static final long serialVersionUID = 2067868513097659096L;

	private String id;

	private String cpId;

	private String name;

	private String desc;
	
	private String img;
	
	//销量
	private Integer sales;
	
	//评论数量
	private Integer comment;
	
	//正面评价占比
	private float positive;
	
	//分类ID
	private String cpCategroyId;
	
	//商户商品数量
	private Integer count;
	
	private Date cpCreateTime;
	
	private Date cpUpdateTime;
	
	//扩展字段
	private Map<String, Object> extMap; 
	
	private Date createTime;
	
	private Date updateTime;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCpId() {
		return cpId;
	}

	public void setCpId(String cpId) {
		this.cpId = cpId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public Integer getSales() {
		return sales;
	}

	public void setSales(Integer sales) {
		this.sales = sales;
	}

	public Integer getComment() {
		return comment;
	}

	public void setComment(Integer comment) {
		this.comment = comment;
	}

	public float getPositive() {
		return positive;
	}

	public void setPositive(float positive) {
		this.positive = positive;
	}

	public String getCpCategroyId() {
		return cpCategroyId;
	}

	public void setCpCategroyId(String cpCategroyId) {
		this.cpCategroyId = cpCategroyId;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public Date getCpCreateTime() {
		return cpCreateTime;
	}

	public void setCpCreateTime(Date cpCreateTime) {
		this.cpCreateTime = cpCreateTime;
	}

	public Date getCpUpdateTime() {
		return cpUpdateTime;
	}

	public void setCpUpdateTime(Date cpUpdateTime) {
		this.cpUpdateTime = cpUpdateTime;
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

	public Map<String, Object> getExtMap() {
		return extMap;
	}

	public void setExtMap(Map<String, Object> extMap) {
		this.extMap = extMap;
	}

}
