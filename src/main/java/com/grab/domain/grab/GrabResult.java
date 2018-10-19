package com.grab.domain.grab;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 爬抓返回结果
 * @author Roger
 *
 */
public class GrabResult implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -5060453325896407658L;
	
	//返回单个对象
	private Map<String, Object> result;
	//返回对象列表
	private List<GrabResult> arrayResult;
	
	private GrabResultParam grabResultParam;
	
	private Integer cpId;
	
	public Map<String, Object> getResult() {
		return result;
	}



	public void setResult(Map<String, Object> result) {
		this.result = result;
	}



	public List<GrabResult> getArrayResult() {
		return arrayResult;
	}



	public void setArrayResult(List<GrabResult> arrayResult) {
		this.arrayResult = arrayResult;
	}
	

	public GrabResultParam getGrabResultParam() {
		return grabResultParam;
	}



	public void setGrabResultParam(GrabResultParam grabResultParam) {
		this.grabResultParam = grabResultParam;
	}

	public Integer getCpId() {
		return cpId;
	}

	public void setCpId(Integer cpId) {
		this.cpId = cpId;
	}

	@Override
	public String toString() {
		return "GrabResult [result=" + result + ", arrayResult=" + arrayResult + "]";
	}
	
}
