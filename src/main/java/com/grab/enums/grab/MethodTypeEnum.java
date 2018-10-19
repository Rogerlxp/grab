package com.grab.enums.grab;

/**
 * 文件信息枚举类
 * 
 * @author Roger
 */
public enum MethodTypeEnum {

    GET(1, "get提交"),

    POST_JSON_PARAM(2, "post提交，post参数为json"),
    
    POST_MAP_PARA(3, "post提交，post参数为map");
    

    private int    id;  
    private String name;

    private MethodTypeEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }
    
    public static MethodTypeEnum valueOf(Integer id) {
		if(id == null || id == GET.id) {
			return GET;
		}else if(id == POST_JSON_PARAM.id) {
			return POST_JSON_PARAM;
		}else if(id == POST_MAP_PARA.id) {
			return POST_MAP_PARA;
		}
		return GET;
	}


    public int getId() {
        return id;
    }


    public String getName() {
        return name;
    }

}
