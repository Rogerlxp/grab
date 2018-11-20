package com.roger.grab.manage.model;

import org.apache.commons.lang.StringUtils;

public class BaseResultModel extends ResponseEntity{
	
	public static ResponseEntity build( String callback, Object v ) {
		if( StringUtils.isBlank( callback ) ) {
			return new BaseResultModel( v );
		} else {
			return new JSONPResultModel( callback, v );
		}
	}

	private int code = 200;

	private String message = "";

	private Object value = new Object();

	private String redirect = "";

	public BaseResultModel() {
		this.value = "ok";
	}
	
	public BaseResultModel( Object value ) {
		this.value = value;
	}
	
	public BaseResultModel( int code, String message ) {
		this.code = code;
		this.message = message;
		this.value = "";
	}
	
	public BaseResultModel( int code, String message, Object value ) {
		this.code = code;
		this.message = message;
		this.value = value;
	}

	public int getCode() {
		return code;
	}

	public void setCode( int code ) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage( String message ) {
		this.message = message;
	}

	public Object getValue() {
		return value;
	}

	public void setValue( Object value ) {
		this.value = value;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect( String redirect ) {
		this.redirect = redirect;
	}

}
