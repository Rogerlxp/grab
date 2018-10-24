package com.roger.grab.base.enums.grab;

/**
 * 文件信息枚举类
 * 
 * @author Roger
 */
public enum ObjectTypeEnum {

    OBJECT(1, "object"),

    LIST(2, "list");
    

    private int    id;  
    private String name;

    private ObjectTypeEnum(int id, String name) {
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
