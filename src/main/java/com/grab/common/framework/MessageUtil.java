package com.grab.common.framework;

/**
 * 澶氳瑷�璧勬簮宸ュ叿
 * @author hewei
 *
 */
public class MessageUtil {

	public static String getMessage(String code) {
		try {
			return ContainerLocation.getContainer().getMessage(code);
		}
		catch(Exception e ) {
			return "Can't find res:"+code;
		}
	}

	public static String getMessage(String code, Object[] args) {
		try {
			return ContainerLocation.getContainer().getMessage(code, args);
		}
		catch(Exception e ) {
			return "Can't find res:"+code;
		}
	}

	public static String getMessage(String code, Object[] args, String defaultMsg) {
		try {
			return ContainerLocation.getContainer().getMessage(code, args, defaultMsg);
		}
		catch(Exception e ) {
			return "Can't find res:"+code;
		}
	}
}
