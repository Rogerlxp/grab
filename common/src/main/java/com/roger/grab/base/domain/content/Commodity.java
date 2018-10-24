package com.roger.grab.base.domain.content;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import com.sun.tools.javac.util.List;

/**
 * 商品对象
 * 
 * @author Roger
 */
public class Commodity implements Serializable {
	private static final long serialVersionUID = 2067868513097659096L;

	private String id;

	private String cpId;

	private String name;

	private String desc;
	
	private String img;
	
	private List<String> detail_img;
	
	private BigDecimal ori_price;
	
	private BigDecimal real_price;
	
	private BigDecimal ori_price_us;
	
	private BigDecimal real_price_us;
	
	private BigDecimal shipping_price;
	
	private BigDecimal shipping_price_us;

	//库存
	private Integer inventory;
	
	//销量
	private Integer sales;
	
	//评论数量
	private Integer comment;
	
	//正面评价占比
	private float positive;
	
	//分类ID
	private Integer cpCategroyId;
	
	//商户Id
	private String merchantId;
	
	//商户商品数量
	private Integer mer_com_count;
	
	//商户评论数量
	private Integer mer_comment;
	
	//商户正面评论
	private float mer_positive;
	
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

	public List<String> getDetail_img() {
		return detail_img;
	}

	public void setDetail_img(List<String> detail_img) {
		this.detail_img = detail_img;
	}

	public BigDecimal getOri_price() {
		return ori_price;
	}

	public void setOri_price(BigDecimal ori_price) {
		this.ori_price = ori_price;
	}

	public BigDecimal getReal_price() {
		return real_price;
	}

	public void setReal_price(BigDecimal real_price) {
		this.real_price = real_price;
	}

	public BigDecimal getOri_price_us() {
		return ori_price_us;
	}

	public void setOri_price_us(BigDecimal ori_price_us) {
		this.ori_price_us = ori_price_us;
	}

	public BigDecimal getReal_price_us() {
		return real_price_us;
	}

	public void setReal_price_us(BigDecimal real_price_us) {
		this.real_price_us = real_price_us;
	}

	public BigDecimal getShipping_price() {
		return shipping_price;
	}

	public void setShipping_price(BigDecimal shipping_price) {
		this.shipping_price = shipping_price;
	}

	public BigDecimal getShipping_price_us() {
		return shipping_price_us;
	}

	public void setShipping_price_us(BigDecimal shipping_price_us) {
		this.shipping_price_us = shipping_price_us;
	}

	public Integer getInventory() {
		return inventory;
	}

	public void setInventory(Integer inventory) {
		this.inventory = inventory;
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

	public Integer getCpCategroyId() {
		return cpCategroyId;
	}

	public void setCpCategroyId(Integer cpCategroyId) {
		this.cpCategroyId = cpCategroyId;
	}

	public String getMerchantId() {
		return merchantId;
	}

	public void setMerchantId(String merchantId) {
		this.merchantId = merchantId;
	}

	public Integer getMer_com_count() {
		return mer_com_count;
	}

	public void setMer_com_count(Integer mer_com_count) {
		this.mer_com_count = mer_com_count;
	}

	public Integer getMer_comment() {
		return mer_comment;
	}

	public void setMer_comment(Integer mer_comment) {
		this.mer_comment = mer_comment;
	}

	public float getMer_positive() {
		return mer_positive;
	}

	public void setMer_positive(float mer_positive) {
		this.mer_positive = mer_positive;
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
