package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.util.List;

import com.roger.grab.base.enums.grab.TextTypeEnum;


/**
 * 结果解析配置对象
 * @author Roger
 *
 */
public class GrabExtractElement implements Serializable{
	private static final long serialVersionUID = 8074493123299705920L;
	
	//文本类型
	private TextTypeEnum type;
	//结果提取模式
	private SchemaTree resultSchemaTree;
	//jsonp 类型时使用
	private String jsonpMethod;
	//状态码信息
	private GrabResultDataStatus grabResultDataStatus;
	//下一跳URL模式
	private List<NextUrlSchema> nextUrls;
	
	public TextTypeEnum getType() {
		return type;
	}
	public void setType(TextTypeEnum type) {
		this.type = type;
	}
	public SchemaTree getResultSchemaTree() {
		return resultSchemaTree;
	}
	public void setResultSchemaTree(SchemaTree schemaTree) {
		this.resultSchemaTree = schemaTree;
	}
	public String getJsonpMethod() {
		return jsonpMethod;
	}
	public void setJsonpMethod(String jsonpMethod) {
		this.jsonpMethod = jsonpMethod;
	}
	public List<NextUrlSchema> getNextUrls() {
		return nextUrls;
	}
	public void setNextUrls(List<NextUrlSchema> nextUrls) {
		this.nextUrls = nextUrls;
	}
	public GrabResultDataStatus getGrabResultDataStatus() {
		return grabResultDataStatus;
	}
	public void setGrabResultDataStatus(GrabResultDataStatus grabResultDataStatus) {
		this.grabResultDataStatus = grabResultDataStatus;
	}
}
