package com.roger.grab.base.enums.grab;

/**
 * 文件信息枚举类
 * 
 * @author Roger
 */
public enum PositionEnum {

    HEAD(1, "HEAD"),

    URL(2, "URL"),
    
    ENTITY(3,"ENTITY");
    

    private int    id;  
    private String name;

    private PositionEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }
    
    public static PositionEnum valueOf(Integer id) {
  		if(id == null || id == URL.id) {
  			return PositionEnum.URL;
  		}else if(id == HEAD.id) {
  			return HEAD;
  		}else if(id == ENTITY.id) {
  			return ENTITY;
  		}
  		return URL;
  	}
    


    public int getId() {
        return id;
    }


    public String getName() {
        return name;
    }

}
