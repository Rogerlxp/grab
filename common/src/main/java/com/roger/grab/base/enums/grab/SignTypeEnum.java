package com.roger.grab.base.enums.grab;

/**
 * 文件信息枚举类
 * 
 * @author Roger
 */
public enum SignTypeEnum {

    MD5(1, "MD5"),

    SHA1(2, "SHA1"),
    
    SHA256(3, "SHA256");
    

    private int    id;  
    private String name;

    private SignTypeEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public static SignTypeEnum valueOf(Integer id) {
  		if(id == null || id == MD5.id) {
  			return MD5;
  		}else if(id == SHA1.id) {
  			return SHA1;
  		}else if(id == SHA256.id) {
  			return SHA256;
  		}
  		return MD5;
  	}

    public int getId() {
        return id;
    }


    public String getName() {
        return name;
    }

}
