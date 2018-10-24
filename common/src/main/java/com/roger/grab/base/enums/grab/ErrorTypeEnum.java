package com.roger.grab.base.enums.grab;

import java.util.HashMap;
import java.util.Map;

/**
 * 爬抓异常类型
 * 
 * @author Roger
 */
public enum ErrorTypeEnum {
	CREATE_REQUEST_ERROR(-2,"创建request异常"),
	
    CONFIG(-1, "config配置异常"),

    NETWORK(1, "network层异常"),

    HTTP(2, "http层异常"),
    
    DATA(3, "数据异常"),
    
    REF_TOKEN(4, "token过期"),

    NO_HANDLE(5, "CP返回异常code,但不处理异常"),
    
    NO_EXPECTED(6, "返回数据不符合预期格式异常"),
    
    MPPING(7,"MPPING异常"),
    
	AGENT_CP_NOMORE_DATA(8,"no more data 异常");
    

    private int    id;  
    private String name;

    private ErrorTypeEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }

    private static final Map<Integer, ErrorTypeEnum> ENUMMAP = new HashMap<Integer, ErrorTypeEnum>();
	static {
		for (ErrorTypeEnum _enum : ErrorTypeEnum.values()) {
			ENUMMAP.put(_enum.getId(), _enum);
		}
	}
	
	public static ErrorTypeEnum fromValue(int value) {
		return ENUMMAP.get(value);
	}

    public int getId() {
        return id;
    }


    public String getName() {
        return name;
    }

}
