package com.grab.common.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

//import com.meizu.framework.service.log.ILog;
//import com.meizu.framework.service.log.LogFactory;

/**
 * 鎻忚堪锛歮d5绠楁硶鍔犲瘑绫� 浣滆�咃細 yangqiang 鍒涘缓鏃堕棿锛�2009-7-22涓嬪崍09:11:43
 * 
 * @since v0.1
 * 
 */
public class MD5Util {
	//private final static ILog logger = LogFactory.getLog(MD5Util.class);
	private final static String[] hexDigits = { "0", "1", "2", "3", "4", "5",
			"6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };

    private static ThreadLocal<MessageDigest> MD5 = new ThreadLocal<MessageDigest>()
    {
        @Override
        protected MessageDigest initialValue()
        {
            try
            {
                return MessageDigest.getInstance("MD5");
            } catch (NoSuchAlgorithmException e)
            {
                throw new IllegalStateException("no md5 algorythm found");
            }
        }
    };
    
	/**
	 * 
	 * 鎻忚堪锛氳浆鎹㈠瓧鑺傛暟缁勪负16杩涘埗瀛椾覆 浣滆�咃細 yangqiang 鍒涘缓鏃堕棿锛� 2009-7-22涓嬪崍09:41:08
	 * 
	 * @since v0.1
	 * 
	 * @param b
	 *            瀛楄妭鏁扮粍
	 * @return 16杩涘埗瀛椾覆
	 * 
	 */
	public static String byteArrayToHexString(byte[] b) {
		StringBuffer resultSb = new StringBuffer();
		for (int i = 0; i < b.length; i++) {
			resultSb.append(byteToHexString(b[i], true));
		}
		return resultSb.toString();
	}

	public static String byteArrayToHexStringLittleEnding(byte[] b) {
		StringBuffer resultSb = new StringBuffer();
		for (int i = 0; i < b.length; i++) {
			resultSb.append(byteToHexString(b[i], false));
		}
		return resultSb.toString();
	}
	
	private static String byteToHexString(byte b, boolean bigEnding) {
		int n = b;
		if (n < 0)
			n = 256 + n;
		int d1 = n / 16;
		int d2 = n % 16;
		return (bigEnding)?(hexDigits[d1] + hexDigits[d2]):(hexDigits[d2] + hexDigits[d1]);
	}

	public static String MD5Encode(String origin) {
		return MD5Encode(origin, null);
	}

	/**
	 * 鎶�16杩涘埗瀛楃涓茶浆鎹负byte鏁扮粍
	 * @param s
	 * @return
	 */
	public static byte[] hexStringToByteArray(String s){
		if(s.length()%2 != 0){
			throw new RuntimeException("Error Hex String length");
		}
		byte[] result = new byte[s.length()/2];
		for(int i=0; i<s.length();){
			int bytepos = i/2;
			char c = s.charAt(i++);
			char c2 = s.charAt(i++);
			result[bytepos] = Integer.decode("0x"+c+c2).byteValue();
		}
		return result;
	}
	
	/**
	 * MD5鎽樿
	 * @param origin  鎽樿鍘熸枃
	 * @param encoding  瀛楃涓瞣rigin 鐨勭紪鐮�
	 * @return
	 */
	public static String MD5Encode(String origin, String encoding) {
		String resultString = null;

		try {
			resultString = new String(origin);
			MessageDigest md = MD5.get();
			if (encoding == null) {
				resultString = byteArrayToHexString(md.digest(resultString
						.getBytes()));
			} else {
				resultString = byteArrayToHexString(md.digest(resultString
						.getBytes(encoding)));
			}

		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		return resultString;
	}
	
	public static MessageDigest getMd5Digest(){
	    return MD5.get();
	}
	
	public static byte[] MD5Encode(byte origin[]) {
		try {
			MessageDigest md = MD5.get();
			return md.digest(origin);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
