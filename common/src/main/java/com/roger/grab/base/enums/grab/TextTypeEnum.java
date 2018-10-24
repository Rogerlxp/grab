package com.roger.grab.base.enums.grab;

/**
 * 文件信息枚举类
 * 
 * @author Roger
 */
public enum TextTypeEnum {

    HTML(1, "html"),

    JSON(2, "json"),
    
    JSONP(3, "jsonp");
    

    private int    id;  
    private String name;

    private TextTypeEnum(int id, String name) {
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
