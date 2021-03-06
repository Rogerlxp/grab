package com.roger.grab.base.service.grab.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.roger.grab.base.dao.mapping.GrabTaskMapper;
import com.roger.grab.base.domain.grab.GrabTask;
import com.roger.grab.base.service.grab.IGrabTaskService;


@Service("GrabTaskServiceImpl")
public class GrabTaskServiceImpl implements IGrabTaskService{
	
	@Autowired
	private GrabTaskMapper grabTaskMapper;

	@Override
	public GrabTask get(Integer id) {
		return grabTaskMapper.get(id);
	}

	@Override
	public int add(GrabTask task) {
		return grabTaskMapper.add(task);
	}

	@Override
	public List<GrabTask> getWaitTask() {
		return grabTaskMapper.getWaitTask();
	}

	@Override
	public void updateTask(GrabTask task) {
		grabTaskMapper.updateTask(task);
	}

	@Override
	public void updateTaskRunStatus(GrabTask task) {
		grabTaskMapper.updateTaskRunStatus(task);
	}

}
