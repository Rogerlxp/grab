package com.roger.grab.base.dao.mapping;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.roger.grab.base.domain.grab.GrabErrorCode;
import com.roger.grab.base.domain.grab.GrabModel;
import com.roger.grab.base.domain.grab.GrabModelField;


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