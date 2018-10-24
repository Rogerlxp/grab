/**
 * 描述： <br/>
 * 作者： XiaJinSong <br/>
 * 创建时间：2012-4-3 <br/>
 */
package com.roger.grab.base.enums;

import java.util.HashMap;
import java.util.Map;


/**
 * @author Roger
 *
 */
public enum CPStatusEnum {
	NO_USE(0, "不使用"),
	USE(1, "使用");

	private int value;
	private String name;

	private CPStatusEnum(int value,String name) {
		this.value = value;
		this.name = name;
	}

	public int getValue() {
		return value;
	}

	public String getName() {
		return name;
	}

	private static final Map<Integer, CPStatusEnum> ENUMMAP = new HashMap<Integer, CPStatusEnum>();
	static {
		for (CPStatusEnum _enum : CPStatusEnum.values()) {
			ENUMMAP.put(_enum.getValue(), _enum);
		}
	}

	public static CPStatusEnum fromValue(int value) {
		return ENUMMAP.get(value);
	}
}
