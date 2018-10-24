package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.annotation.JSONField;
import com.roger.grab.base.common.util.StringUtil;
import com.roger.grab.base.enums.grab.EntityTypeEnum;

public class GrabResultParamString implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -963105941222351200L;
	
	private Integer id;
	private Integer grabId;
	private String mappings;
	@JSONField(serialize=false)
	private List<MappingSchema> mappingSchemas;
	private String fixedValues;
	@JSONField(serialize=false)
	private GrabFixedValueParam fixedValueParam;
	private String mappingValues;
	@JSONField(serialize=false)
	private List<MappingValueParam> mappingValueParams;
	private Integer modeId;
	private EntityTypeEnum entityTypeEnum;
	private Date createTime;
	private Date updateTime;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getGrabId() {
		return grabId;
	}
	public void setGrabId(Integer grabId) {
		this.grabId = grabId;
	}
	public String getMappings() {
		return mappings;
	}
	public void setMappings(String mappings) {
		this.mappings = mappings;
		if(!StringUtil.isEmpty(mappings)) {
			mappingSchemas = JSON.parseArray(mappings, MappingSchema.class);
		}
	}
	public String getMappingValues() {
		return mappingValues;
	}
	public void setMappingValues(String mappingValues) {
		this.mappingValues = mappingValues;
		if(!StringUtil.isEmpty(mappingValues)) {
			this.mappingValueParams =JSON.parseArray(mappingValues,MappingValueParam.class);
		}
	}
	public String getFixedValues() {
		return fixedValues;
	}
	public void setFixedValues(String fixedValues) {
		this.fixedValues = fixedValues;
		if(!StringUtil.isEmpty(fixedValues)) {
			this.fixedValueParam = JSON.parseObject(fixedValues,GrabFixedValueParam.class);
		}
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
	public List<MappingSchema> getMappingSchemas() {
		return mappingSchemas;
	}
	public GrabFixedValueParam getFixedValueParam() {
		return fixedValueParam;
	}
	public List<MappingValueParam> getMappingValueParams() {
		return mappingValueParams;
	}
	public Integer getModeId() {
		return modeId;
	}
	public void setModeId(Integer modeId) {
		this.modeId = modeId;
		if(modeId !=null) {
			entityTypeEnum = EntityTypeEnum.fromValue(modeId);
		}
	}
	public EntityTypeEnum getEntityTypeEnum() {
		return entityTypeEnum;
	}
}
