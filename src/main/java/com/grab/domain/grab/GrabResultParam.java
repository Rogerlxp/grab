package com.grab.domain.grab;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.annotation.JSONField;
import com.grab.enums.grab.EntityTypeEnum;

/**
 * 爬抓结果映射配置
 * @author Roger
 *
 */
public class GrabResultParam implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1030063787363060851L;
	private Integer grabId;
	//结果与对象映射
	private List<MappingSchema> mappingSchemas;
	@JSONField(serialize=false)
	private Map<String, MappingSchema> mappingSchemaMap;
	//爬抓结果添加固定值
	private GrabFixedValueParam fixedValueParam;
	//爬抓结果替换
	private List<MappingValueParam> mappingValueParams;
	//映射对象
	private EntityTypeEnum entityType;
	
	public EntityTypeEnum getEntityType() {
		return entityType;
	}
	public void setEntityType(EntityTypeEnum entityType) {
		this.entityType = entityType;
	}
	public List<MappingSchema> getMappingSchemas() {
		return mappingSchemas;
	}
	public void setMappingSchemas(List<MappingSchema> mappingSchemas) {
		this.mappingSchemas = mappingSchemas;
		this.mappingSchemaMap = new HashMap<>();
		if(mappingSchemas != null && mappingSchemas.size()>0) {
			for( MappingSchema schema : mappingSchemas ) {
				mappingSchemaMap.put( schema.getKeyName(), schema );
			}
			//mappingSchemas.stream().forEach(schema -> mappingSchemaMap.put(schema.getKeyName(), schema));
		}
	}
	public Map<String, MappingSchema> getMappingSchemaMap() {
		return mappingSchemaMap;
	}
	public Integer getGrabId() {
		return grabId;
	}
	public void setGrabId(Integer grabId) {
		this.grabId = grabId;
	}
	public GrabFixedValueParam getFixedValueParam() {
		return fixedValueParam;
	}
	public void setFixedValueParam(GrabFixedValueParam fixedValueParam) {
		this.fixedValueParam = fixedValueParam;
	}
	public List<MappingValueParam> getMappingValueParams() {
		return mappingValueParams;
	}
	public void setMappingValueParams(List<MappingValueParam> mappingValueParams) {
		this.mappingValueParams = mappingValueParams;
	}
}
