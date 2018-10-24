package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.roger.grab.base.enums.grab.PositionEnum;
import com.roger.grab.base.enums.grab.SignParamOrderEnum;
import com.roger.grab.base.enums.grab.SignTypeEnum;


public class SignSchema implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -8047556397903371593L;
	//签名规则ID
	private Integer id;
	//签名参数名
	private String signParamName;
	//签名类型
	private SignTypeEnum signTypeEnum;
	//签名字符串添加位置
	private PositionEnum positionEnum;
	//参数排序方式
	private SignParamOrderEnum signParamOrderEnum;
	//待签名参数
	private List<String> paramNames;
	//单个参数格式
	private String singleParamFormat;
	//开始字符(不参与排序的签名key)
	private String beginCharacter = "";
	//结束字符(不参与排序的签名key)
	private String endCharacter = "";
	//参数拼接字符
	private String spliceCharacter = "";
	//参与排序的签名key
	private Map<String, String> signKeyMap;
	//是否保留最后的拼接字符
	private boolean hasLastSplice = false;
	
	public SignSchema() {}
	
	public SignSchema(SignSchemaString signSchemaString) {
		if(signSchemaString != null) {
			id =  signSchemaString.getId();
			signParamName = signSchemaString.getSignParamName();
			signTypeEnum = SignTypeEnum.valueOf(signSchemaString.getSignTypeEnum());
			positionEnum = PositionEnum.valueOf(signSchemaString.getPositionEnum());
			signParamOrderEnum = SignParamOrderEnum.valueOf(signSchemaString.getSignParamOrderEnum());
			if(signSchemaString.getParamNames()!=null) {
				paramNames = JSON.parseArray(signSchemaString.getParamNames(),String.class);
			}
			singleParamFormat = signSchemaString.getSingleParamFormat();
			beginCharacter = signSchemaString.getBeginCharacter();
			endCharacter = signSchemaString.getEndCharacter();
			spliceCharacter = signSchemaString.getSpliceCharacter();
			if(signSchemaString.getSignKeyMap()!=null) {
				signKeyMap = JSON.parseObject(signSchemaString.getSignKeyMap(),Map.class);
			}
			if(signSchemaString.getHasLastSplice()!=null) {
				hasLastSplice = signSchemaString.getHasLastSplice()>0;
			}
		}
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public SignTypeEnum getSignTypeEnum() {
		return signTypeEnum;
	}
	public void setSignTypeEnum(SignTypeEnum signTypeEnum) {
		this.signTypeEnum = signTypeEnum;
	}
	public void setSignTypeEnumInt(Integer signType) {
		this.signTypeEnum = SignTypeEnum.valueOf(signType);
	}
	public PositionEnum getPositionEnum() {
		return positionEnum;
	}
	public void setPositionEnum(PositionEnum position) {
		this.positionEnum = position;
	}
	public void setPositionEnumInt(Integer position) {
		this.positionEnum = PositionEnum.valueOf(position);
	}
	public String getSingleParamFormat() {
		return singleParamFormat;
	}
	public void setSingleParamFormat(String singleParamFormat) {
		this.singleParamFormat = singleParamFormat;
	}
	public String getSpliceCharacter() {
		return spliceCharacter;
	}
	public void setSpliceCharacter(String spliceCharacter) {
		this.spliceCharacter = spliceCharacter;
	}
	public boolean isHasLastSplice() {
		return hasLastSplice;
	}
	public void setHasLastSpliceInt(Integer hasLastSplice) {
		if(hasLastSplice!=null && hasLastSplice>0 ) {
			this.hasLastSplice = true;
		}
	}
	public void setHasLastSplice(boolean hasLastSplice) {
		this.hasLastSplice = hasLastSplice;
	}
	public SignParamOrderEnum getSignParamOrderEnum() {
		return signParamOrderEnum;
	}
	public Integer getSignParamOrderEnumInt() {
		if(signParamOrderEnum == null) {
			return null;
		}
		return signParamOrderEnum.getId();
	}
	public void setSignParamOrderEnumInt(Integer signParamOrder) {
		this.signParamOrderEnum = SignParamOrderEnum.valueOf(signParamOrder);
	}
	public void setSignParamOrderEnum(SignParamOrderEnum signParamOrder) {
		this.signParamOrderEnum = signParamOrder;
	}
	public List<String> getParamNames() {
		return paramNames;
	}
	public void setParamNames(List<String> paramNames) {
		if(paramNames!=null) {
			this.paramNames =  paramNames;
		}
	}
	public void setParamNameStrings(String paramNames) {
		if(paramNames!=null) {
			this.paramNames =  JSON.parseArray(paramNames,String.class);
		}
	}
	public String getSignParamName() {
		return signParamName;
	}
	public void setSignParamName(String signParamName) {
		this.signParamName = signParamName;
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
	public Map<String, String> getSignKeyMap() {
		return signKeyMap;
	}
	public void setSignKeyMap(Map<String, String> signKeyMap) {
		this.signKeyMap = signKeyMap;
	}
	public void setSignKeyMapStrings(String signKeyMap) {
		if(paramNames!=null) {
			this.signKeyMap =  JSON.parseObject(signKeyMap,Map.class);
		}
	}
}
