package com.roger.grab.base.common.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class SHA1 {
	
	public static String sha1(String input) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		MessageDigest mDigest = MessageDigest.getInstance("SHA1");
		byte[] result = mDigest.digest(input.getBytes("UTF-8"));
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < result.length; i++) {
			sb.append(Integer.toString((result[i] & 0xff) + 0x100, 16).substring(1));
		}
		return sb.toString();
	}
	
	public static String sha256(String input) throws NoSuchAlgorithmException, UnsupportedEncodingException{
		MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
		byte[] result = messageDigest.digest(input.getBytes("UTF-8"));
		StringBuffer stringBuffer = new StringBuffer();
        String temp = null;
        for (int i=0;i<result.length;i++){
            temp = Integer.toHexString(result[i] & 0xFF);
            if (temp.length()==1){
                //1得到一位的进行补0操作
                stringBuffer.append("0");
            }
            stringBuffer.append(temp);
        }
        return stringBuffer.toString();
	}
	
	public static void main(String[] args) throws Exception {
//		System.out.println(sha256_HMAC("12345678test12345678", "meizunews_8dabd7dba79379d26"));
		hmacSha256("123456781523346618", "test1234568");
	}
	
	public static String hmacSha256(String message, String secret) throws NoSuchAlgorithmException, InvalidKeyException {
		String hash = "";
		Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
		SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
		sha256_HMAC.init(secret_key);
		byte[] bytes = sha256_HMAC.doFinal(message.getBytes());
		hash = byteArrayToHexString(bytes);
		return hash;
	}

	private static String byteArrayToHexString(byte[] b) {
		StringBuilder hs = new StringBuilder();
		String stmp;
		for (int n = 0; b != null && n < b.length; n++) {
			stmp = Integer.toHexString(b[n] & 0XFF);
			if (stmp.length() == 1){
				hs.append('0');
			}
			hs.append(stmp);
		}
		return hs.toString().toLowerCase();
	}
	
}
