package com.roger.grab.base.common.framework;

/**
 * 鎻忚堪锛� 
 * 浣滆�咃細 yangqiang
 * 鍒涘缓鏃堕棿锛�2009-8-17涓嬪崍04:58:34
 * @since v0.1
 *
 */
public class BizException extends RuntimeException{

	/** */
	private static final long serialVersionUID = 5141348587994068486L;

	/** 寮傚父閿欒鐮� */
	private int errorCode;

	/**鍥介檯鍖栦唬鐮侊紝 {link #getMessage()}鐨勬椂鍊欒浆鎹负鏈湴璧勬簮*/
	private String i18code;
	/**鍥介檯鍖栬祫婧愬弬鏁�*/
	private Object[] i18args;
	
	/**
	 * 鍥介檯鍖栦唬鐮侊紝 {link #getMessage()}鐨勬椂鍊欒浆鎹负鏈湴璧勬簮
	 * @param i18code 璧勬簮鐮�
	 * @return
	 */
	public static BizException createException(String i18code){
		return createException(i18code, null, null);
	}
	
	/**
	 * 鍥介檯鍖栦唬鐮侊紝 {link #getMessage()}鐨勬椂鍊欒浆鎹负鏈湴璧勬簮
	 * @param i18code 璧勬簮鐮�
	 * @param i18args
	 * @param cause
	 * @return
	 */
	public static BizException createException(String i18code,  Object[] i18args, Throwable cause){
		BizException exception = new BizException(i18code, cause);
		exception.i18args = i18args;
		exception.i18code = i18code;
		return exception;
	}
	
	/**杩斿洖娑堟伅鍐呭锛屽鏋滄湁璁剧疆澶氳瑷�锛屽垯杩斿洖澶氳瑷�鍐呭*/
	public String getMessage(){
		if(i18code == null){
			return super.getMessage();
		}else{
			return getLocalizedMessage();
		}
	}
	
	/**杩斿洖澶氳瑷�瀛楃涓�*/
	public String getLocalizedMessage(){
		if(i18code == null){
			return super.getLocalizedMessage();
		}else{
			if(i18args != null){
				return MessageUtil.getMessage(i18code, i18args);
			}else{
				return MessageUtil.getMessage(i18code);
			}
		}
	}
	
	/**
	 * 
	 */
	public BizException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param errorCode
	 */
	public BizException(int errorCode) {
		super();
		this.errorCode = errorCode;
	}

	
	public BizException(String message) {
		super(message);
		this.errorCode = ErrorCode.BIZ_ERROR_CODE;
	}

	/**
	 * @param errorCode
	 */
	public BizException(int errorCode, String message) {
		super(message);
		this.errorCode = errorCode;
	}

	/**
	 * @param message
	 * @param cause
	 */
	public BizException(int errorCode, String message, Throwable cause) {
		super(message, cause);
		this.errorCode = errorCode;
	}
	
	/**
	 * @param message
	 * @param cause
	 */
	public BizException(String message, Throwable cause) {
		super(message, cause);
		this.errorCode = ErrorCode.BIZ_ERROR_CODE;
	}

	/**
	 * @param cause
	 */
	public BizException(int errorCode, Throwable cause) {
		super(cause);
		this.errorCode = errorCode;
		// TODO Auto-generated constructor stub
	}

	/**
	 * @return the errorCode
	 */
	public int getErrorCode() {
		return errorCode;
	}

	
	
}
