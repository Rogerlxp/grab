package com.grab.enums.grab;

import java.util.HashMap;
import java.util.Map;

/**
 *映射未命中时选择策略
 * 
 * @author Roger
 */
public enum ParamMappingSelectEnum {

	ORIGINAL(1, "original "),

	NULL(2, "null"),
    
	DEFAULT(3,"default");
    

    private int    id;  
    private String name;

    private ParamMappingSelectEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }


    public int getId() {
        return id;
    }


    public String getName() {
        return name;
    }

    private static final Map<Integer, ParamMappingSelectEnum> ENUMMAP = new HashMap<Integer, ParamMappingSelectEnum>();
   	static {
   		for (ParamMappingSelectEnum _enum : ParamMappingSelectEnum.values()) {
   			ENUMMAP.put(_enum.getId(), _enum);
   		}
   	}
   	
   	public static ParamMappingSelectEnum fromValue(int value) {
   		return ENUMMAP.get(value);
   	}
}
