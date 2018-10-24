package com.roger.grab.base.dao.mapping;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.roger.grab.base.domain.grab.GrabResultParamString;


@Repository
public interface GrabMappingMapper {
	/**
	 * 获取映射关系
	 * @param id
	 * @return
	 */
	GrabResultParamString get( @Param( "grabId" ) Integer grabId );
	/**
	 * 添加映射关系
	 * @param schema
	 */
	int add( GrabResultParamString schemaString );
	/**
	 * 修改映射关系
	 * @param schema
	 */
	void update( GrabResultParamString schemaString );
	/**
	 * 删除映射
	 * @param grabParam
	 */
	void del( @Param( "grabId" ) Integer grabId);
	/**
	 * 查询列表
	 * @param grabResultParamString
	 * @return
	 */
	List<GrabResultParamString> find(GrabResultParamString grabResultParamString);
	
	void delCache(Integer grabId);
}