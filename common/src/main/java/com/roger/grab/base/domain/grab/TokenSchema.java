package com.roger.grab.base.domain.grab;

import java.io.Serializable;

import com.roger.grab.base.enums.grab.PositionEnum;


public class TokenSchema implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 7276817009937517859L;
	
	private String tokenName;
	private PositionEnum positionEnum;
	private Integer tokenGrabId;
	//用户token 唯一标识提取规则，如imei的提取规则
	private String userTokenRule;
	
	public String getTokenName() {
		return tokenName;
	}
	public void setTokenName(String tokenName) {
		this.tokenName = tokenName;
	}
	public PositionEnum getPositionEnum() {
		return positionEnum;
	}
	public void setPositionEnum(PositionEnum positionEnum) {
		this.positionEnum = positionEnum;
	}
	public void setPositionEnum(Integer position) {
		this.positionEnum = PositionEnum.valueOf(position);
	}
	public Integer getTokenGrabId() {
		return tokenGrabId;
	}
	public void setTokenGrabId(Integer tokenId) {
		this.tokenGrabId = tokenId;
	}
	public String getUserTokenRule() {
		return userTokenRule;
	}
	public void setUserTokenRule(String userTokenRule) {
		this.userTokenRule = userTokenRule;
	}
}
