package com.roger.grab.base.domain.grab;

import java.io.Serializable;

/**
 * 爬抓token
 * @author Roger
 *
 */
public class GrabSite implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 6335362844844305039L;
	
	
    private String charset;

	public String getCharset() {
		return charset;
	}


	public void setCharset(String charset) {
		this.charset = charset;
	}
	
}
