package com.roger.grab.base.enums.grab;

import java.util.HashMap;
import java.util.Map;

/**
 * 文件信息枚举类
 * 
 * @author Roger
 */
public enum EntityTypeEnum {

    TOKEN(1, "TOKEN"),

    COMMODITY(2, "COMMODITY");
    

    private int    id;  
    private String name;

    private EntityTypeEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }


    public int getId() {
        return id;
    }


    public String getName() {
        return name;
    }

    private static final Map<Integer, EntityTypeEnum> ENUMMAP = new HashMap<Integer, EntityTypeEnum>();
   	static {
   		for (EntityTypeEnum _enum : EntityTypeEnum.values()) {
   			ENUMMAP.put(_enum.getId(), _enum);
   		}
   	}
   	
   	public static EntityTypeEnum fromValue(int value) {
   		return ENUMMAP.get(value);
   	}
}
