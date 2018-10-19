package com.grab.enums.grab;

/**
 * 文件信息枚举类
 * 
 * @author Roger
 */
public enum SignParamOrderEnum {

	APPOINT(1, "指定顺序"),

    PARAM_KEY_ASC(2, "按参数key正序"),
    
    PARAM_KEY_DESC(3, "按参数key逆序"),
    
    PARAM_VALUE_ASC(4, "按value正序"),
    
    PARAM_VALUE_DESC(5, "按value逆序"),;
    

    private int    id;  
    private String name;

    private SignParamOrderEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public static SignParamOrderEnum valueOf(Integer id) {
  		if(id == null || id == APPOINT.id) {
  			return APPOINT;
  		}else if(id == PARAM_KEY_ASC.id) {
  			return PARAM_KEY_ASC;
  		}else if(id == PARAM_KEY_DESC.id) {
  			return PARAM_KEY_DESC;
  		}else if(id == PARAM_VALUE_ASC.id) {
  			return PARAM_VALUE_ASC;
  		}else if(id == PARAM_VALUE_DESC.id) {
  			return PARAM_VALUE_DESC;
  		}
  		return APPOINT;
  	}

    public int getId() {
        return id;
    }


    public String getName() {
        return name;
    }

}
