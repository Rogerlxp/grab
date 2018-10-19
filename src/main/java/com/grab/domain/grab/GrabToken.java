package com.grab.domain.grab;

import java.io.Serializable;

/**
 * 爬抓token
 * @author Roger
 *
 */
public class GrabToken implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -8377121356362948165L;
	
	private String token;
	private Long expires;
	
	public GrabToken() {
		super();
	}
	
	public GrabToken(String token, Long expires) {
		super();
		this.token = token;
		this.expires = expires;
	}
	
	
	
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public Long getExpires() {
		return expires;
	}
	public void setExpires(Long expires) {
		this.expires = expires;
	}
	@Override
	public String toString() {
		return "CpToken [token=" + token + ", expires=" + expires + "]";
	}
	
}
