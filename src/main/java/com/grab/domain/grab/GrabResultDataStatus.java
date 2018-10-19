package com.grab.domain.grab;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

/**
 * 结果状态码
 * @author Roger
 *
 */
public class GrabResultDataStatus implements Serializable{
	private static final long serialVersionUID = 8590773092154526279L;
	
	//状态提取表达式
	private Schema codeSchema;
	//成功状态
	private Set<String> success;
	//异常状态映射
	private Map<String, Integer> errorCodeMap;
	
	public Schema getCodeSchema() {
		return codeSchema;
	}
	public void setCodeSchema(Schema codeSchema) {
		this.codeSchema = codeSchema;
	}
	public Set<String> getSuccess() {
		return success;
	}
	public void setSuccess(Set<String> success) {
		this.success = success;
	}
	public Map<String, Integer> getErrorCodeMap() {
		return errorCodeMap;
	}
	public void setErrorCodeMap(Map<String, Integer> errorCodeMap) {
		this.errorCodeMap = errorCodeMap;
	}
}
