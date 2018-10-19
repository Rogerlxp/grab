package com.grab.common.framework;

public interface ErrorCode {
	/** 璇锋眰瓒呮椂 */
	int TIMEOUT_CODE = 504;
	/** 绂佹璁块棶 */
	int FORBID_CODE = 403;
	/** 閫氱敤涓氬姟寮傚父 */
	int BIZ_ERROR_CODE = 4000;
	/** 绯荤粺寮傚父 */
	int SYS_ERROR_CODE = 400;
	/** */
	int CLOSE_FAILURE = 3;
	/** */
	int FILE_OPEN_FAILURE = 4;
	/** */
	int MISSING_LAYOUT = 5;
	/** */
	int ADDRESS_PARSE_FAILURE = 6;
	
	/** 鐢ㄦ埛涓績閿欒鐮� 寮�濮� */
	int ERR_UC_START = 0x10000000;
	
	/** 浣欓涓嶈冻 */
	int ERR_NO_BALANCE = ERR_UC_START + 1;
	
	/** 杞欢涓績閿欒鐮� 寮�濮� */
	int ERR_STORE_START = 0x20000000;
	
	/** FLYME閿欒鐮� 寮�濮� */
	int ERR_FLYME_START = 0x30000000;
	
	/** 鏃犳崯闊充箰閿欒鐮� 寮�濮� */
	int ERR_MUSIC_START = 0x40000000;
}
