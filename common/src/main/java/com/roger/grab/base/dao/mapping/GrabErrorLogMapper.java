package com.roger.grab.base.dao.mapping;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.roger.grab.base.domain.grab.GrabErrorLog;


@Repository
public interface GrabErrorLogMapper {
	/**
	 * 签名ID
	 * @param id
	 * @return
	 */
	GrabErrorLog get( @Param( "id" ) Integer id );

	/**
	 * 添加异常日志
	 * @param schema
	 */
	int add( GrabErrorLog log );
}