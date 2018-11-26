package com.roger.grab.task.producer;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.roger.grab.base.common.util.GrabTaskParamUtil;
import com.roger.grab.base.common.util.ListUtils;
import com.roger.grab.base.domain.grab.GrabTask;
import com.roger.grab.base.domain.grab.GrabTriggerParam;
import com.roger.grab.base.service.grab.IGrabService;
import com.roger.grab.base.service.grab.IGrabTaskService;


@Component
public class GrabGeneratorHandler {
	
	private static final Logger LOGGER = LoggerFactory.getLogger( GrabGeneratorHandler.class );
	
	@Autowired
	private IGrabTaskService grabTaskService;
	@Autowired 
	private IGrabService grabService;
	
	/**
	 * 添加定时爬抓任务
	 */
	public void run() {
		List<GrabTask> tasks = findAllWaitTask();
		if(ListUtils.isNotEmpty(tasks)) {
			for (GrabTask grabTask : tasks) {
				runTask(grabTask);
			}
		}
	}

	/**
	 * 执行Task
	 * @param grabTask
	 * @throws Exception 
	 */
	private void runTask(GrabTask grabTask) {
		if(grabTask == null) {
			return;
		}
		try {
			GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
			grabTriggerParam.setId(grabTask.getGrabId());
			//grabTriggerParam.setPriority(grabTask.getPriority());
			grabTriggerParam.setParamMap(checkGrabTaskParams(grabTask));
			grabService.pushGrab(grabTriggerParam);
			//更新下次执行时间
			int nextRunTime = (int)(System.currentTimeMillis()/1000) + grabTask.getSpace();
			grabTask.setNextRunTime(nextRunTime);
			grabTaskService.updateTaskRunStatus(grabTask);
		}catch (Exception e) {
			LOGGER.error("爬抓任务生成失败"+e.getMessage(),e);
		}
	}

	private Map<String, Object> checkGrabTaskParams(GrabTask grabTask) throws Exception {
		if(grabTask.getParams() == null || grabTask.getParams().isEmpty()) {
			return null;
		}
		Map<String, Object> paramMap = grabTask.getParams();
		for (Map.Entry<String, Object> entry : paramMap.entrySet()) {
			entry.setValue(GrabTaskParamUtil.createParam(entry.getValue(), grabTask.getLastRunTime()));
		}
		return paramMap;
	}

	/**
	 * 扫描所有待执行的任务
	 * @return
	 */
	private List<GrabTask> findAllWaitTask() {
		//任务过多时需添加分页逻辑
		return grabTaskService.getWaitTask();
	}
}
