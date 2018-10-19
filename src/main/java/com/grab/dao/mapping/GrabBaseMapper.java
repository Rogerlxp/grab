package com.grab.dao.mapping;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.grab.domain.grab.GrabErrorCode;
import com.grab.domain.grab.GrabModel;
import com.grab.domain.grab.GrabModelField;

@Repository
public interface GrabBaseMapper {
	/**
	 * 获取模型字段列表
	 * @param ModelId
	 * @return
	 */
	List<GrabModelField> getModelFields(@Param( "modelId" )Integer modelId);
	
	/**
	 * 获取模型
	 * @param modelId
	 * @return
	 */
	List<GrabModel> getModels();
	
	/**
	 * 获取定义异常
	 * @param id
	 * @return
	 */
	List<GrabErrorCode> getErrorCodes();
}