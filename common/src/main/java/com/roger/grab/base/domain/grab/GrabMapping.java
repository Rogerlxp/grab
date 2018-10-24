package com.roger.grab.base.domain.grab;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * 自动反射结果配置
 * @author Roger
 *
 */
public class GrabMapping implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 611026836506389692L;
	
	private String className;
	private Class<?> objClass;
	private Method[] methods;  
	private Field[] fields;
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
	}
	public Class<?> getObjClass() {
		return objClass;
	}
	public void setObjClass(Class<?> objClass) {
		this.objClass = objClass;
	}
	public Method[] getMethods() {
		return methods;
	}
	public void setMethods(Method[] methods) {
		this.methods = methods;
	}
	public Field[] getFields() {
		return fields;
	}
	public void setFields(Field[] fields) {
		this.fields = fields;
	}  
}
