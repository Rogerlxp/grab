package com.roger.grab.task.consumer;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.roger.grab.task.consumer.downloader.GrabDownloader;
import com.roger.grab.task.consumer.pipeline.GrabPipeline;
import com.roger.grab.task.consumer.processor.GrabPageProcessor;
import com.roger.grab.task.consumer.scheduler.GrabScheduler;
import com.roger.grab.task.consumer.spider.GrabSpider;
import com.roger.grab.task.consumer.spider.GrabSpider.Status;

@Service
public class Grab implements InitializingBean {
	
	private final ScheduledExecutorService scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
	
	@Autowired
	private GrabDownloader downloader;
	@Autowired
	private GrabPipeline pipeline;
	@Autowired
	private GrabPageProcessor processor;
	@Autowired
	private GrabScheduler scheduler; 
	@Value("${grab.thread.count}")
	private Integer threadCount = 20;
	private static GrabSpider spider;

	public void setThreadCount(Integer threadCount) {
		this.threadCount = threadCount;
	}

	public void grabRun() {
		if(spider == null) {
			synchronized (threadCount){
				spider= GrabSpider.create(processor).setDownloader(downloader)
						.addPipeline(pipeline)
						.setScheduler(scheduler)
						.thread(threadCount)
						;
			}
			spider.setExitWhenComplete(false);
		}
		restart();
	}
	
	public void restart() {
		if(!checkRunStatus()) {
			spider.run();
		}
	} 
	
	public boolean checkRunStatus() {
		if(spider != null) {
			if(spider.getStatus().getValue() == Status.Running.getValue()) {
				return true;
			}
			return false;
		}
		return false;
	}
	
	public void init() {
		//启动后直接运行
		Runnable restartService = new Runnable(){
			@Override
			public void run() {
				grabRun();
			}

		};
		//30分钟运行一次
		scheduledExecutorService.scheduleWithFixedDelay(restartService, 1, 30, TimeUnit.MINUTES);
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		init();
	}
	
}