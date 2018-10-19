package com.grab.domain.exception;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.grab.enums.grab.ErrorTypeEnum;

public class GrabException extends Exception{
	private static final long serialVersionUID = 1L;
	
	private Integer grabId;
	private ErrorTypeEnum errorTypeEnum;
	private Integer dataStatusCode;
	private String message;
	private Throwable exception;
	
	public GrabException(ErrorTypeEnum errorTypeEnum,Integer dataStatusCode,String message,Throwable exception,Integer grabId) {
		super();
		this.errorTypeEnum = errorTypeEnum;
		this.dataStatusCode = dataStatusCode;
		this.message = message;
		this.exception = exception;
		this.grabId = grabId;
	}
	
	public GrabException(Integer dataStatusCode,String message,Integer grabId) {
		super();
		this.dataStatusCode = dataStatusCode;
		if(dataStatusCode != null ) {
			errorTypeEnum = ErrorTypeEnum.fromValue(dataStatusCode);
		}
		if(errorTypeEnum == null) {
			errorTypeEnum = ErrorTypeEnum.NO_EXPECTED;
		}
		this.message = message;
		this.grabId = grabId;
	}
	
	public ErrorTypeEnum getErrorTypeEnum() {
		return errorTypeEnum;
	}

	public void setErrorTypeEnum(ErrorTypeEnum errorTypeEnum) {
		this.errorTypeEnum = errorTypeEnum;
	}

	public Integer getDataStatusCode() {
		return dataStatusCode;
	}

	public void setDataStatusCode(Integer dataStatusCode) {
		this.dataStatusCode = dataStatusCode;
	}

	public String getMessage() {
		if(exception!=null) {
			return message + "\r\n" + getStackTrace(exception);
		}
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	public Integer getGrabId() {
		return grabId;
	}

	public void setGrabId(Integer grabId) {
		this.grabId = grabId;
	}

	public Throwable getException() {
		return exception;
	}

	public void setException(Throwable exception) {
		this.exception = exception;
	}
	
	public static String getStackTrace(Throwable throwable){
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		try{
			throwable.printStackTrace(pw);
			return sw.toString();
		} finally{
			pw.close();
		}
	}
	
}
