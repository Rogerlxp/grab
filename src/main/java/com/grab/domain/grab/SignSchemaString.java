package com.grab.domain.grab;

import java.io.Serializable;

import com.alibaba.fastjson.JSON;



public class SignSchemaString implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -8047556397903371593L;
	//签名规则ID
	private Integer id;
	private Integer cpId;
	private String remark;
	//签名参数名
	private String signParamName;
	//签名类型
	private Integer signTypeEnum;
	//签名字符串添加位置
	private Integer positionEnum;
	//参数排序方式
	private Integer signParamOrderEnum;
	//待签名参数
	private String paramNames;
	//单个参数格式
	private String singleParamFormat; 
	//开始字符(不参与排序的签名key)
	private String beginCharacter = "";
	//结束字符(不参与排序的签名key)
	private String endCharacter = "";
	//参数拼接字符
	private String spliceCharacter = "";
	//参与排序的签名key
	private String signKeyMap;
	//是否保留最后的拼接字符
	private Integer hasLastSplice;
	
	public SignSchemaString() {}
	
	public SignSchemaString(SignSchema signSchema) {
		if(signSchema != null) {
			id =  signSchema.getId();
			signParamName = signSchema.getSignParamName();
			if(signSchema.getSignTypeEnum()!=null) {
				signTypeEnum = signSchema.getSignTypeEnum().getId();
			}
			if(signSchema.getPositionEnum()!=null) {
				positionEnum = signSchema.getPositionEnum().getId();
			}
			if(signSchema.getSignParamOrderEnum()!=null) {
				signParamOrderEnum = signSchema.getSignParamOrderEnum().getId();
			}
			if(signSchema.getParamNames()!=null) {
				paramNames = JSON.toJSONString(signSchema.getParamNames());
			}
			singleParamFormat = signSchema.getSingleParamFormat();
			beginCharacter = signSchema.getBeginCharacter();
			endCharacter = signSchema.getEndCharacter();
			spliceCharacter = signSchema.getSpliceCharacter();
			if(signSchema.getSignKeyMap()!=null) {
				signKeyMap = JSON.toJSONString(signSchema.getSignKeyMap());
			}
			hasLastSplice = signSchema.isHasLastSplice() ? 1:0;
		}
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getSignParamName() {
		return signParamName;
	}
	public void setSignParamName(String signParamName) {
		this.signParamName = signParamName;
	}
	public Integer getSignTypeEnum() {
		return signTypeEnum;
	}
	public void setSignTypeEnum(Integer signTypeEnum) {
		this.signTypeEnum = signTypeEnum;
	}
	public Integer getPositionEnum() {
		return positionEnum;
	}
	public void setPositionEnum(Integer positionEnum) {
		this.positionEnum = positionEnum;
	}
	public Integer getSignParamOrderEnum() {
		return signParamOrderEnum;
	}
	public void setSignParamOrderEnum(Integer signParamOrderEnum) {
		this.signParamOrderEnum = signParamOrderEnum;
	}
	public String getParamNames() {
		return paramNames;
	}
	public void setParamNames(String paramNames) {
		this.paramNames = paramNames;
	}
	public String getSingleParamFormat() {
		return singleParamFormat;
	}
	public void setSingleParamFormat(String singleParamFormat) {
		this.singleParamFormat = singleParamFormat;
	}
	public String getBeginCharacter() {
		return beginCharacter;
	}
	public void setBeginCharacter(String beginCharacter) {
		this.beginCharacter = beginCharacter;
	}
	public String getEndCharacter() {
		return endCharacter;
	}
	public void setEndCharacter(String endCharacter) {
		this.endCharacter = endCharacter;
	}
	public String getSpliceCharacter() {
		return spliceCharacter;
	}
	public void setSpliceCharacter(String spliceCharacter) {
		this.spliceCharacter = spliceCharacter;
	}
	public String getSignKeyMap() {
		return signKeyMap;
	}
	public void setSignKeyMap(String signKeyMap) {
		this.signKeyMap = signKeyMap;
	}
	public Integer getHasLastSplice() {
		return hasLastSplice;
	}
	public void setHasLastSplice(Integer hasLastSplice) {
		this.hasLastSplice = hasLastSplice;
	}
	public Integer getCpId() {
		return cpId;
	}
	public void setCpId(Integer cpId) {
		this.cpId = cpId;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
}
