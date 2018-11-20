package com.roger.grab.manage.model;

import org.apache.commons.lang.StringUtils;

/**
 * 请求响应实体
 */
public class ResponseEntity {

	public static ResponseEntity build( String callback, Object v ) {
		if( StringUtils.isBlank( callback ) ) {
			return new BaseResultModel( v );
		} else {
			return new JSONPResultModel( callback, v );
		}
	}
}
