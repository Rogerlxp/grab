package com.roger.grab.base.dao.mapping;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.roger.grab.base.domain.grab.GrabParamString;


@Repository
public interface GrabMapper {
	/**
	 * 获取列表
	 * @param id
	 * @return
	 */
	List<GrabParamString> find( GrabParamString grabParamString );
	/**
	 * 查询爬抓规则
	 * @param id
	 * @return
	 */
	GrabParamString get( @Param( "id" ) Integer id );
	/**
	 * 添加爬抓规则
	 * @param grabParam
	 */
	int add( GrabParamString grabParamString );
	/**
	 * 修改爬抓规则
	 * @param grabParam
	 */
	void update( GrabParamString grabParamString );
	/**
	 * 删除爬抓规则
	 * @param grabParam
	 */
	void del( @Param( "id" ) Integer id);
	/**
	 * 批量查询
	 * @param grabIds
	 * @return
	 */
	List<GrabParamString> getList( @Param( "ids" )List<Integer> grabIds);
	
	void delCache(Integer grabId);
}
