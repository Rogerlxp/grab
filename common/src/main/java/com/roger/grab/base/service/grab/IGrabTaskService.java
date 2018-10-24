package com.roger.grab.base.service.grab;

import java.util.List;

import com.roger.grab.base.domain.grab.GrabTask;


public interface IGrabTaskService {
	/**
	 * 获取指定任务
	 * @param id
	 * @return
	 */
	GrabTask get(Integer id );
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
