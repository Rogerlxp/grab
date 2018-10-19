package com.grab.common.util;

import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.grab.common.framework.ILog;
import com.grab.common.framework.LogFactory;
import com.grab.enums.grab.TaskParamEnum;


public class GrabTaskParamUtil{
	private static final ILog LOGGER = LogFactory.getLog(GrabTaskParamUtil.class);
	private static final Pattern GRAB_TASK_PARAM_REPLACE = Pattern.compile("^task\\[[^]]*\\]");
	private static final String GRAB_TASK_PARAM_SPACE = "\\*";
	private static final Integer GRAB_TASK_PARAM_REPLACE_BEGIN = 5;
	
	public static void main(String[] args) {
		try {
			Object object = GrabTaskParamUtil.createParam("task[LAST_RUN_TIME_INT]", 12345690);
			System.err.println(object);
			
			object = GrabTaskParamUtil.createParam("task[1*YEAR]", 12345690);
			System.err.println(object);
			
			object = GrabTaskParamUtil.createParam("task[-3*MONTH]", 12345690);
			System.err.println(object);
			
			object = GrabTaskParamUtil.createParam("task[-13*HOUR]", 12345690);
			System.err.println(object);
			
			
			object = GrabTaskParamUtil.createParam("task[73*MINUTE]", 12345690);
			System.err.println(object);
			
			object = GrabTaskParamUtil.createParam("task[LAST_RUN_TIME_Long]", 12345690);
			System.err.println(object);
			
			object = GrabTaskParamUtil.createParam("task[0*WEEK]", 12345690);
			System.err.println(object);
			
			
			object = GrabTaskParamUtil.createParam("task[0*DAY]", 12345690);
			System.err.println(object);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static Object createParam(Object param,Integer lastRunTime) throws Exception {
		if(param == null) {
			return param;
		}
		if(param instanceof String) {
			String temp_param = param.toString();
			Matcher matcher = GRAB_TASK_PARAM_REPLACE.matcher(temp_param);
			if(matcher.find()) {
				temp_param = matcher.group();
				if(StringUtil.isEmpty(temp_param)) {
					throw new Exception("task 配置异常，配置的自动时间参数 不存在");
				}
				int endIndex = temp_param.length()-1;
				int beginIndex = Math.min(endIndex, GRAB_TASK_PARAM_REPLACE_BEGIN);
				temp_param = temp_param.substring(beginIndex, endIndex);
				String[] params = temp_param.split(GRAB_TASK_PARAM_SPACE);
				if(params.length == 1) {
					TaskParamEnum taskParamEnum = TaskParamEnum.fromValue(params[0]);
					if(taskParamEnum == null) {
						throw new Exception("task 配置异常，配置的TaskParamEnum 不存在");
					}
					switch (taskParamEnum) {
					case LAST_RUN_TIME_INT:
						return lastRunTime;
					case LAST_RUN_TIME_LONG:
						long time = lastRunTime;
						return time*1000;
					default:
						throw new Exception("task 配置异常，配置的second 不存在");
					}
				}else if(params.length == 2) {
					Integer second = Integer.valueOf(params[0]);
					TaskParamEnum taskParamEnum = TaskParamEnum.fromValue(params[1]);
					if(second == null || taskParamEnum == null) {
						throw new Exception("task 配置异常，配置的TaskParamEnum 不存在或second为null");
					}
					
					Calendar calendar = Calendar.getInstance();  
					switch (taskParamEnum) {
					case YEAR:
						calendar.add(Calendar.YEAR, second);
						calendar.set(Calendar.MONTH, 0);
						calendar.set(Calendar.DAY_OF_MONTH, 1);
						calendar.set(Calendar.HOUR_OF_DAY, 0);
						calendar.set(Calendar.MINUTE, 0);
						calendar.set(Calendar.SECOND, 0);
						break;
					case MONTH:
						calendar.add(Calendar.MONTH, second);
						calendar.set(Calendar.DAY_OF_MONTH, 1);
						calendar.set(Calendar.HOUR_OF_DAY, 0);
						calendar.set(Calendar.MINUTE, 0);
						calendar.set(Calendar.SECOND, 0);
						break;
					case WEEK:
						calendar.add(Calendar.WEEK_OF_MONTH, second);
						calendar.set(Calendar.DAY_OF_WEEK, 1);
						calendar.set(Calendar.HOUR_OF_DAY, 0);
						calendar.set(Calendar.MINUTE, 0);
						calendar.set(Calendar.SECOND, 0);
						break;
					case DAY:
						calendar.add(Calendar.DAY_OF_MONTH, second);
						calendar.set(Calendar.HOUR_OF_DAY, 0);
						calendar.set(Calendar.MINUTE, 0);
						calendar.set(Calendar.SECOND, 0);
						break;
					case HOUR:
						calendar.add(Calendar.HOUR, second);
						calendar.set(Calendar.MINUTE, 0);
						calendar.set(Calendar.SECOND, 0);
						break;
					case MINUTE:
						calendar.add(Calendar.MINUTE, second);
						calendar.set(Calendar.SECOND, 0);
						break;
					default:
						throw new Exception("task 配置异常，每次衔接最后运行时间类型无需second");
					}
					return calendar.getTimeInMillis()/1000;
					
				}else {
					throw new Exception("task 配置异常，配置的自动时间参数格式错误");
				}
			}
		}
		return param;
	}
	
	
}
