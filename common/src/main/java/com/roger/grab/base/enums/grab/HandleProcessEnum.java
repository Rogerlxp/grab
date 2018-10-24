package com.roger.grab.base.enums.grab;

/**
 * 爬抓异常类型
 * 
 * @author Roger
 */
public enum HandleProcessEnum {
	CREATE_REQUEST(1,"创建request"),
	
    GET_CONTENT(2, "获取内容"),

    EXTRACT(3, "提取"),

    MAPPING(4, "映射");    

    private int    id;  
    private String name;

    private HandleProcessEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }


    public int getId() {
        return id;
    }


    public String getName() {
        return name;
    }

}
