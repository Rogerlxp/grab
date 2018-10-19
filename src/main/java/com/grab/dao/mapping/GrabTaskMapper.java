package com.grab.dao.mapping;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.grab.domain.grab.GrabTask;

@Repository
public interface GrabTaskMapper {
	/**
	 * 获取指定任务
	 * @param id
	 * @return
	 */
	GrabTask get( @Param( "id" ) Integer id );
	/**
	 * 添加任务
	 * @param schema
	 */
	int add( GrabTask task );
	/**
	 * 获取需要运行的任务
	 * @param id
	 * @return
	 */
	List<GrabTask> getWaitTask();
	/**
	 * 更新任务
	 * @param id
	 * @return
	 */
	void updateTask(GrabTask task);
	/**
	 * 更新任务运行
	 * @param id
	 * @return
	 */
	void updateTaskRunStatus(GrabTask task);
}