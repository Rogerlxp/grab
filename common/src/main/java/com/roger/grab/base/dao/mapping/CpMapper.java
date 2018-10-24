package com.roger.grab.base.dao.mapping;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.roger.grab.base.domain.content.CP;


@Repository
public interface CpMapper {
	/**
	 * 根据状态根据CP列表
	 * @param status
	 * @return
	 */
	List<CP> getByStatus( @Param("status")Integer status );
	/**
	 * 查询所有更新CP
	 * @return
	 */
	List<CP> getByUpdate( @Param("updateTime")Integer updateTime );
	
	
	
	/**
	 * 根据状态根据CP列表
	 * @param status
	 * @return
	 */
	List<CP> getSupportBizCps( @Param("supportBizBit")Integer supportBizBit );
	
	
	/**
	 * 添加CP
	 * @param cp
	 * @return
	 */
	int add(CP cp);
	/**
	 * 修改CP
	 * @param cp
	 */
	void update(CP cp);
	/**
	 * 删除CP
	 */
	void del(@Param("id")Integer id);
	/**
	 * 查询
	 * @param cpId
	 * @return
	 */
	CP get(@Param("id")Integer cpId);
	/**
	 * 批量查询
	 * @param cpIds
	 * @return
	 */
	List<CP> getCps(@Param("ids")List<Integer> cpIds);
	List<CP> find(CP cp);
}
