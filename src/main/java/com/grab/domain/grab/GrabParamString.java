package com.grab.domain.grab;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.grab.domain.grab.GrabParam.Param;
import com.grab.enums.grab.PositionEnum;

/**
 * 爬抓配置
 * @author Roger
 *
 */
public class GrabParamString implements Serializable{
	private static final long serialVersionUID = 8111435767196309794L;
	
	//爬抓配置ID
	private Integer id;
	private String name;
	@JSONField(serialize=false)
	private OriginalParam originalExtract;
	//爬抓URL
	private String url;
	//爬抓方式
	private Integer methodType;
	//参数
	private String paramSchema;
	//head 参数
	private String heads;
	//签名规则Id
	private Integer signId;
	//签名
	private SignSchema signSchema;
	//token 名
	private String tokenName;
	//token位置
	private PositionEnum positionEnum;
	//tokenId
	private Integer tokenGrabId;	
	//用户唯一标识提取规则，用于标识token所属用户
	private String userTokenRule;	
	//结果提取
	private String grabExtractElement;
	//站点配置ID
	private Integer siteId;
	private Integer cpId;
	private Date create_Time;
	private Date update_Time;
	
	public GrabParamString() {}
	
	public GrabParamString(GrabParam grabParam) {
		if(grabParam!=null) {
			id = grabParam.getId();
			url = grabParam.getUrl();
			name = grabParam.getName();
			if(grabParam.getMethodType()!=null) {
				methodType = grabParam.getMethodType().getId();
			}
			if(grabParam.getParamSchema()!=null) {
				paramSchema = JSONObject.toJSONString(grabParam.getParamSchema(),SerializerFeature.WriteMapNullValue);
			}
			if(grabParam.getHeads()!=null) {
				heads = JSONObject.toJSONString(grabParam.getHeads(),SerializerFeature.WriteMapNullValue);
			}
			signId = grabParam.getSignId();
			if(grabParam.getSignSchema()!=null) {
				signSchema = grabParam.getSignSchema();
			}
			if(grabParam.getTokenSchema()!=null) {
				tokenName = grabParam.getTokenSchema().getTokenName();
				if(grabParam.getTokenSchema().getPositionEnum()!=null) {
					positionEnum = grabParam.getTokenSchema().getPositionEnum();
				}
				tokenGrabId = grabParam.getTokenSchema().getTokenGrabId();
				userTokenRule = grabParam.getTokenSchema().getUserTokenRule();
			}
			if(grabParam.getGrabExtractElement()!=null) {
				grabExtractElement = JSONObject.toJSONString(grabParam.getGrabExtractElement(),SerializerFeature.WriteMapNullValue);
			}
			cpId = grabParam.getCpId();
		}
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public Integer getMethodType() {
		return methodType;
	}
	public void setMethodType(Integer methodType) {
		this.methodType = methodType;
	}
	public String getParamSchema() {
		return paramSchema;
	}
	public void setParamSchema(String paramSchema) {
		this.paramSchema = paramSchema;
	}
	public String getHeads() {
		return heads;
	}
	public void setHeads(String heads) {
		this.heads = heads;
	}
	public Integer getSignId() {
		return signId;
	}
	public void setSignId(Integer signId) {
		this.signId = signId;
	}
	public SignSchema getSignSchema() {
		return signSchema;
	}
	public void setSignSchema(SignSchema signSchema) {
		this.signSchema = signSchema;
	}
	public String getTokenName() {
		return tokenName;
	}
	public void setTokenName(String tokenName) {
		this.tokenName = tokenName;
	}
	public PositionEnum getPositionEnum() {
		return positionEnum;
	}
	public Integer getPositionEnumInt() {
		if(positionEnum == null) {
			return null;
		}
		return positionEnum.getId();
	}
	public void setPositionEnum(PositionEnum positionEnum) {
		this.positionEnum = positionEnum;
	}
	public void setPositionEnumInt(Integer positionEnum) {
		this.positionEnum = PositionEnum.valueOf(positionEnum);
	}
	public Integer getTokenGrabId() {
		return tokenGrabId;
	}
	public void setTokenGrabId(Integer tokenGrabId) {
		this.tokenGrabId = tokenGrabId;
	}
	public String getGrabExtractElement() {
		return grabExtractElement;
	}
	public void setGrabExtractElement(String grabExtractElement) {
		this.grabExtractElement = grabExtractElement;
	}
	public GrabExtractElement getExtractElement() {
		return JSON.parseObject(grabExtractElement,GrabExtractElement.class);
	}
	public void setExtractElement(GrabExtractElement grabExtractElement) {
		this.grabExtractElement = JSON.toJSONString(grabExtractElement);
	}
	public Integer getSiteId() {
		return siteId;
	}
	public void setSiteId(Integer siteId) {
		this.siteId = siteId;
	}
	public Date getCreate_Time() {
		return create_Time;
	}

	public void setCreate_Time(Date create_Time) {
		this.create_Time = create_Time;
	}

	public Date getUpdate_Time() {
		return update_Time;
	}

	public void setUpdate_Time(Date update_Time) {
		this.update_Time = update_Time;
	}

	public Integer getCpId() {
		return cpId;
	}

	public void setCpId(Integer cpId) {
		this.cpId = cpId;
	}

	public String getUserTokenRule() {
		return userTokenRule;
	}
	public void setUserTokenRule(String userTokenRule) {
		this.userTokenRule = userTokenRule;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOriginalExtract() {
		if(originalExtract == null ) {
			return null;
		}
		return JSON.toJSONString(originalExtract);
	}
	public void setOriginalExtract(String originalExtract) {
		if(originalExtract !=null) {
			this.originalExtract = JSON.parseObject(originalExtract, OriginalParam.class);
		}
	}
	
	public OriginalParam getOriginalParam() {
		return originalExtract;
	}
	public void setOriginalParam(OriginalParam originalExtract) {
		this.originalExtract = originalExtract;
	}
	
	public static class OriginalParam {
		private List<Param> params;
		private String baseRule;
		private List<String> attributes;
		
		public List<Param> getParams() {
			return params;
		}
		public void setParams(List<Param> params) {
			this.params = params;
		}
		public String getBaseRule() {
			return baseRule;
		}
		public void setBaseRule(String baseRule) {
			this.baseRule = baseRule;
		}
		public List<String> getAttributes() {
			return attributes;
		}
		public void setAttributes(List<String> attributes) {
			this.attributes = attributes;
		}
	}
}
