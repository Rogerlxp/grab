package com.grab.enums.grab;

import java.util.HashMap;
import java.util.Map;

/**
 * 文件信息枚举类
 * 
 * @author Roger
 */
public enum TaskParamEnum {

    YEAR("YEAR", "年"),

    MONTH("MONTH","月"),
    
    WEEK("WEEK","周"),
    
    DAY("DAY","日"),
    
    HOUR("HOUR","小时"),
    
    MINUTE("MINUTE","分钟"),
    
    LAST_RUN_TIME_INT("LAST_RUN_TIME_INT","最后运行时间int"),
    
    LAST_RUN_TIME_LONG("LAST_RUN_TIME_LONG","最后运行时间long");
    

    private String desc;  
    private String name;

    private TaskParamEnum(String name,String desc) {
        this.desc = desc;
        this.name = name;
    }



    public String getDesc() {
		return desc;
	}

	public String getName() {
        return name;
    }

    private static final Map<String, TaskParamEnum> ENUMMAP = new HashMap<String, TaskParamEnum>();
   	static {
   		for (TaskParamEnum _enum : TaskParamEnum.values()) {
   			ENUMMAP.put(_enum.getName().toUpperCase(), _enum);
   		}
   	}
   	
   	public static TaskParamEnum fromValue(String value) {
   		if(value == null) {
   			return null;
   		}
   		return ENUMMAP.get(value.toUpperCase());
   	}
}
