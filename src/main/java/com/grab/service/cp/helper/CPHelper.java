package com.grab.service.cp.helper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grab.common.framework.SpringContextUtil;
import com.grab.common.util.ListUtils;
import com.grab.common.util.StringUtil;
import com.grab.domain.content.CP;
import com.grab.service.cp.ICpService;


@Service("CPHelper")
public class CPHelper implements InitializingBean {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CPHelper.class);
	private final static Map<Integer, ICPInterface> cpApiMap = new HashMap<Integer, ICPInterface>();
	private final static Map<Integer, CP> cpMap = new HashMap<Integer, CP>();
	
	private static ICPInterface baserCp = new CommonDataFetcher();
	private static Integer CP_UPDATE_TIME = 0;
	
	@Autowired
	private SpringContextUtil springContextUtil;
	@Autowired
	private ICpService cpService;
	private static ScheduledExecutorService scheduledExecutorService;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		List<CP> cps = cpService.getCPByUpdateTime(0);
		if (ListUtils.isEmpty(cps)) {
			LOGGER.error("未查询到CP数据！！");
		}
		initCP(cps);
		//5分钟检查一次
		scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
		Runnable idleConnectionMonitorThread = new Runnable(){
			@Override
			public void run() {
				try {
					ref();
				}catch (Exception e) {
					LOGGER.error("主动回收连接失败，message:"+e.getMessage(),e);
				}
			}
		};
		scheduledExecutorService.scheduleWithFixedDelay(idleConnectionMonitorThread, 120, 300, TimeUnit.SECONDS);
	}

	/**
	 * 刷新cp
	 * @throws Exception
	 */
	public void ref() throws Exception {
		List<CP> cps = cpService.getCPByUpdateTime(CP_UPDATE_TIME);
		if(ListUtils.isNotEmpty(cps)) {
			initCP(cps);
		}
	}
	
	

	/**
	 * 初使化CP
	 * @param cps
	 * @throws Exception
	 */
	private void initCP(List<CP> cps) throws Exception {
		for (CP cp : cps) {
			Class c1 = null;
			try {
				//无Cp处理类时，使用通用处理
				if(StringUtil.isEmpty(cp.getClass_path())) {
					cpApiMap.put(cp.getCpId(), baserCp);
					cpMap.put(cp.getCpId(), cp);
					continue;
				}
				c1 = Class.forName(cp.getClass_path());
			} catch (Exception e) {
				throw new Exception(
						String.format("初使化CP：【%s】失败，未找到相应类：【%s】,CP:[%s]", cp.getCpId(), cp.getClass_path(), cp), e);
			}
			if (!ICPInterface.class.isAssignableFrom(c1)) {
				throw new Exception(
						String.format("cpId:[%s]，配置错误，未实现ICPInterface 接口,path:[%S]", cp.getCpId(), cp.getClass_path()));
			}
			Map<String, ICPInterface> cp_services = (Map<String, ICPInterface>) springContextUtil.getType(c1);
			if (cp_services == null || cp_services.isEmpty()) {
				throw new Exception(
						String.format("cpId:[%s]，配置错误，未找到相关实现类 ,path:[%S]", cp.getCpId(), cp.getClass_path()));
			}
			for (String service : cp_services.keySet()) {
				ICPInterface cpInterface = cp_services.get(service);
				if (cpInterface != null) {
					cpApiMap.put(cp.getCpId(), cpInterface);
					cpMap.put(cp.getCpId(), cp);
					break;
				}
			}
			if(cp.getUpdateTime()!=null) {
				long updateTime = cp.getUpdateTime().getTime()/1000;
				if(updateTime > CP_UPDATE_TIME) {
					CP_UPDATE_TIME = (int)updateTime;
				}
			}
		}
	}
	
	public CP getCp(Integer cpId) {
		return cpMap.get(cpId);
	}
	
	public ICPInterface getCPInterface(Integer cpId) {
		return cpApiMap.get(cpId);
	}
}
