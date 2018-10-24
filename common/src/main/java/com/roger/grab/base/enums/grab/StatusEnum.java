package com.roger.grab.base.enums.grab;

/**
 * 爬抓异常类型
 * 
 * @author Roger
 */
public enum StatusEnum {
	SUCCESS(1,"success"),
	
    ERROR(2, "error");
    

    private int    id;  
    private String name;

    private StatusEnum(int id, String name) {
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
