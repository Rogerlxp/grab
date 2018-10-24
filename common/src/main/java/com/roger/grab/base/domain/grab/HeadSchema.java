package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.List;

/**
 * 自动生成head配置
 * @author MEIZU
 *
 */
public class HeadSchema implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -1074101293124941236L;
	
	//head key
	private String headName;
	//head value model
	private String headValueFormat;
	// head param schema
	private List<Schema> headParamSchemas;
	//head value
	private String headValue;
	
	
	public String getHeadName() {
		return headName;
	}
	public void setHeadName(String headName) {
		this.headName = headName;
	}
	public String getHeadValueFormat() {
		return headValueFormat;
	}
	public void setHeadValueFormat(String headValueFormat) {
		this.headValueFormat = headValueFormat;
	}
	public List<Schema> getHeadParamSchemas() {
		return headParamSchemas;
	}
	public void setHeadParamSchemas(List<Schema> headParamSchemas) {
		this.headParamSchemas = headParamSchemas;
	}
	public String getHeadValue() {
		return headValue;
	}
	public void setHeadValue(String headValue) {
		this.headValue = headValue;
	}
	
}
