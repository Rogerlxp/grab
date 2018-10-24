package com.roger.grab.base.dao.mapping;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.roger.grab.base.domain.grab.SignSchemaString;


@Repository
public interface GrabSignMapper {
	/**
	 * 获取列表
	 * @param schemaString
	 * @return
	 */
	List<SignSchemaString> find(SignSchemaString schemaString);
	/**
	 * 签名ID
	 * @param id
	 * @return
	 */
	SignSchemaString get( @Param( "id" ) Integer id );
	/**
	 * 添加签名规则
	 * @param schema
	 */
	int add( SignSchemaString schemaString );
	/**
	 * 修改签名规则
	 * @param schema
	 */
	void update( SignSchemaString schemaString );
	/**
	 * 删除签名规则
	 * @param grabParam
	 */
	void del( @Param( "id" ) Integer id);
}