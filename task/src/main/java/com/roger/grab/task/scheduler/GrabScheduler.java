package com.roger.grab.task.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.roger.grab.base.common.util.GrabConfigUtil;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabTriggerParam;
import com.roger.grab.base.service.grab.IGrabService;

import us.codecraft.webmagic.Request;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.scheduler.DuplicateRemovedScheduler;
import us.codecraft.webmagic.scheduler.MonitorableScheduler;
import us.codecraft.webmagic.scheduler.component.DuplicateRemover;
@Service("GrabScheduler")
public class GrabScheduler extends DuplicateRemovedScheduler implements MonitorableScheduler, DuplicateRemover {

	@Autowired
    private IGrabService grabService;
	
    public GrabScheduler() {
    	super();
        setDuplicateRemover(this);
    }

    @Override
    public void resetDuplicateCheck(Task task) {
    	grabService.resetGrabQueue();
    }

    @Override
    public boolean isDuplicate(Request request, Task task) {
    	GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
    	return grabService.isDuplicate(grabTriggerParam);
    }

    @Override
    protected void pushWhenNoDuplicate(Request request, Task task) {
    	GrabTriggerParam grabTriggerParam = GrabConfigUtil.createGrabTrigger(request);
    	try {
    		if(grabTriggerParam !=null ) {
    			grabService.pushGrab(grabTriggerParam);
    		}
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
		}
    }

    @Override
    public Request poll(Task task) {
    	try {
    		GrabTriggerParam grabTriggerParam = grabService.pollGrab();
    		if(grabTriggerParam == null) {
    			return null;
    		}
    		GrabParam grabParam = grabService.getGrabParam(grabTriggerParam.getId());
    		return GrabConfigUtil.createRequest(grabParam, grabTriggerParam);
    	}catch (Exception e) {
    		logger.error(e.getMessage(),e);
    	}
    	return null;
    }

    @Override
    public int getLeftRequestsCount(Task task) {
       return grabService.getGrabQueueSize();
    }

    @Override
    public int getTotalRequestsCount(Task task) {
        return grabService.getAllGrabSize();
    }
}