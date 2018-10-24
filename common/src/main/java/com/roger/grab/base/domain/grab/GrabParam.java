package com.roger.grab.base.domain.grab;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.roger.grab.base.common.util.StringUtil;
import com.roger.grab.base.enums.grab.MethodTypeEnum;
import com.roger.grab.base.enums.grab.ObjectTypeEnum;

/**
 * 爬抓配置
 * @author Roger
 *
 */
public class GrabParam implements Serializable{
	private static final long serialVersionUID = 8111435767196309794L;
	
	//爬抓配置ID
	private Integer id;
	//接口描述
	private String name;
	//爬抓URL
	private String url;
	//爬抓方式
	private MethodTypeEnum methodType;
	//参数
	private ParamSchema paramSchema;
	//head 参数
	private List<UrlHead> heads;
	//签名规则Id
	private Integer signId;
	//签名
	private SignSchema signSchema;
	//是否需要token,有则传入token爬抓ID
	private TokenSchema tokenSchema;
	//结果提取
	private GrabExtractElement grabExtractElement;
	//站点配置ID
	private Integer siteId;
	//CPID
	private Integer cpId;
	
	public GrabParam() {}
	
	public GrabParam(GrabParamString grabParamString) {
		if(grabParamString!=null) {
			id = grabParamString.getId();
			url = grabParamString.getUrl();
			methodType = MethodTypeEnum.valueOf(grabParamString.getMethodType());
			if(!StringUtil.isEmpty(grabParamString.getParamSchema())) {
				paramSchema = JSON.parseObject(grabParamString.getParamSchema(),ParamSchema.class);
			}
			if(!StringUtil.isEmpty(grabParamString.getHeads())) {
				heads =JSON.parseArray(grabParamString.getHeads(),UrlHead.class);
			}
			signId = grabParamString.getSignId();
			if(grabParamString.getSignSchema()!=null) {
				signSchema = grabParamString.getSignSchema();
			}
			if(grabParamString.getTokenGrabId()!=null || (!StringUtil.isEmpty(grabParamString.getUserTokenRule()))) {
				tokenSchema = new TokenSchema();
				tokenSchema.setTokenName( grabParamString.getTokenName());
				tokenSchema.setPositionEnum(grabParamString.getPositionEnum());
				tokenSchema.setTokenGrabId(grabParamString.getTokenGrabId());
				tokenSchema.setUserTokenRule(grabParamString.getUserTokenRule());
			}
			if(!StringUtil.isEmpty(grabParamString.getGrabExtractElement())) {
				grabExtractElement =JSON.parseObject(grabParamString.getGrabExtractElement(),GrabExtractElement.class);
			}
			cpId = grabParamString.getCpId();
		}
	}
	
	public GrabParam clone() {
		GrabParam grabParam = null;
		try { // 将该对象序列化成流,因为写在流里的是对象的一个拷贝，而原对象仍然存在于JVM里面。所以利用这个特性可以实现对象的深拷贝
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ObjectOutputStream oos = new ObjectOutputStream(baos);
			oos.writeObject(this);
			// 将流序列化成对象
			ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
			ObjectInputStream ois = new ObjectInputStream(bais);
			grabParam = (GrabParam) ois.readObject();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return grabParam;
	}
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public MethodTypeEnum getMethodType() {
		return methodType;
	}
	public void setMethodType(MethodTypeEnum methodType) {
		this.methodType = methodType;
	}
	public void setMethodType(Integer methodType) {
		this.methodType = MethodTypeEnum.valueOf(methodType);
	}
	public ParamSchema getParamSchema() {
		return paramSchema;
	}
	public void setParamSchema(ParamSchema paramSchema) {
		this.paramSchema = paramSchema;
	}
	public void setParamSchema(String paramSchema) {
		this.paramSchema = JSON.parseObject(paramSchema,ParamSchema.class);
	}
	public List<UrlHead> getHeads() {
		return heads;
	}
	public void setHeads(List<UrlHead> heads) {
		this.heads = heads;
	}
	public void setHeads(String heads) {
		this.heads =  JSON.parseArray(heads, UrlHead.class);
	}
	public SignSchema getSignSchema() {
		return signSchema;
	}
	public void setSignSchema(SignSchema signSchema) {
		this.signSchema = signSchema;
	}
	public TokenSchema getTokenSchema() {
		return tokenSchema;
	}
	public void setTokenSchema(TokenSchema tokenSchema) {
		this.tokenSchema = tokenSchema;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public GrabExtractElement getGrabExtractElement() {
		return grabExtractElement;
	}
	public void setGrabExtractElement(GrabExtractElement grabExtractElement) {
		this.grabExtractElement = grabExtractElement;
	}
	public void setGrabExtractElement(String grabExtractElement) {
		this.grabExtractElement =  JSON.parseObject(grabExtractElement,GrabExtractElement.class);
	}
	public Integer getSignId() {
		return signId;
	}
	public void setSignId(Integer signId) {
		this.signId = signId;
	}
	public Integer getSiteId() {
		return siteId;
	}
	public void setSiteId(Integer siteId) {
		this.siteId = siteId;
	}
	public Integer getCpId() {
		return cpId;
	}

	public void setCpId(Integer cpId) {
		this.cpId = cpId;
	}


	public static class Param {
		private String name;
		private String rule;
		private Integer valueType;//内容类型，1：对象，2：列表
		
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getRule() {
			return rule;
		}
		public void setRule(String rule) {
			this.rule = rule;
		}
		public Integer getValueType() {
			return valueType;
		}
		public ObjectTypeEnum getObjectType() {
			if(valueType ==null ) {
				return null;
			}
			if(valueType == ObjectTypeEnum.LIST.getId()) {
				return ObjectTypeEnum.LIST;
			}
			if(valueType == ObjectTypeEnum.OBJECT.getId()) {
				return ObjectTypeEnum.OBJECT;
			}
			return null;
		}
		public void setValueType(Integer valueType) {
			this.valueType = valueType;
		}
		@Override
		public String toString() {
			return "Param [name=" + name + ", rule=" + rule + ", valueType=" + valueType + "]";
		}
	}
	
}
