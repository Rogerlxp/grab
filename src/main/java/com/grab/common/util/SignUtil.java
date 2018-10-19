package com.grab.common.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.grab.common.framework.ILog;
import com.grab.common.framework.LogFactory;
import com.grab.domain.exception.GrabException;
import com.grab.domain.grab.SignSchema;
import com.grab.enums.grab.ErrorTypeEnum;


public class SignUtil{
	private static final ILog LOGGER = LogFactory.getLog(SignUtil.class);
	private static final String ENDCHARACTER_PARAM = "_params_mapping:";
	
	/**
	 * 获取签名
	 * @param signSchema
	 * @param map
	 * @return
	 * @throws GrabException 
	 */
	public static String getSign(SignSchema signSchema,Map<String, String> map, Map<String, Object> params) throws GrabException {
		if(signSchema.getSignTypeEnum() == null) {
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "sign type is null", null, null);
		}
		String signedString = createSignedString(signSchema, map,params);
		if(StringUtil.isEmpty(signedString)) {
			return null;
		}
		try {
			switch (signSchema.getSignTypeEnum()) {
			case MD5:
				return MD5Util.MD5Encode(signedString,"UTF-8");
			case SHA1:
				return SHA1.sha1(signedString);
			case SHA256:
				return SHA1.sha256(signedString);
			default:
				break;
			}
		}catch (Exception e) {
			LOGGER.error("签名失败",e);
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "签名失败", e, null);
		}
		return null;
	}

	/**
	 * 生成待签名字符串
	 * @param signSchema
	 * @param map
	 * @return
	 * @throws GrabException 
	 */
	public static String createSignedString(SignSchema signSchema, Map<String, String> map, Map<String, Object> params) throws GrabException {
		if(signSchema == null || signSchema.getId() == null) {
			return null;
		}
		if(signSchema.getSignParamOrderEnum() == null ) {
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "sign param order is null", null, null);
		}
		if(map == null || map.isEmpty() ) {
			throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR, null, "sign param map is null", null, null);
		}
		if(StringUtil.isEmpty(signSchema.getSingleParamFormat()) ) {
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "single param format is null", null, null);
		}
		signSchema.setBeginCharacter(getPositionCharacterKey(signSchema.getBeginCharacter(),map,params));
		signSchema.setEndCharacter(getPositionCharacterKey(signSchema.getEndCharacter(), map,params));
		
		StringBuffer stringBuffer = new StringBuffer(signSchema.getBeginCharacter());
		switch (signSchema.getSignParamOrderEnum()) {
		case APPOINT:
			//指定顺序
			for (int i=0;i<signSchema.getParamNames().size();i++) {
				String key = signSchema.getParamNames().get(i);
				//取出key-value的表达式格式或签名key
				String s = createSingleParam(signSchema, map, key);
				if(StringUtil.isNotEmpty(s)) {
					stringBuffer.append(s).append(signSchema.getSpliceCharacter());
				}
			}
			break;
		case PARAM_KEY_ASC:
			//按key正序
			Collections.sort(signSchema.getParamNames());
			for (int i=0;i<signSchema.getParamNames().size();i++) {
				String key = signSchema.getParamNames().get(i);
				//取出key-value的表达式格式或签名key
				String s = createSingleParam(signSchema, map, key);
				if(StringUtil.isNotEmpty(s)) {
					stringBuffer.append(s).append(signSchema.getSpliceCharacter());
				}
			}
			break;
		case PARAM_KEY_DESC:
			//按key逆序
			Collections.sort(signSchema.getParamNames());
			for (int i = signSchema.getParamNames().size()-1;i>=0;i--) {
				String key = signSchema.getParamNames().get(i);
				//取出key-value的表达式格式或签名key
				String s = createSingleParam(signSchema, map, key);
				if(StringUtil.isNotEmpty(s)) {
					stringBuffer.append(s).append(signSchema.getSpliceCharacter());
				}
			}
			break;
		case PARAM_VALUE_ASC:
			//按value正序
			Map<String, String> valueMapAsc = new HashMap<String, String>();
			List<String> valuesAsc = new ArrayList<String>();
			handleValue(signSchema, map, valueMapAsc, valuesAsc);
			//添加sign key
			Collections.sort(valuesAsc);
			for (int i =0; i<valuesAsc.size();i++) {
				String value = valuesAsc.get(i);
				stringBuffer.append(valueMapAsc.get(value)).append(signSchema.getSpliceCharacter());
			}
			break;
		case PARAM_VALUE_DESC:
			Map<String, String> valueMapDesc = new HashMap<String, String>();
			List<String> valuesDesc = new ArrayList<String>();
			handleValue(signSchema, map, valueMapDesc, valuesDesc);
			Collections.sort(valuesDesc);
			for (int i = valuesDesc.size()-1;i>=0;i--) {
				String value = valuesDesc.get(i);
				stringBuffer.append(valueMapDesc.get(value)).append(signSchema.getSpliceCharacter());
			}
			break;
		default:
			break;
		}
		if(!signSchema.isHasLastSplice() && stringBuffer.length()>0 && signSchema.getSpliceCharacter()!=null) {
			//最后一个且尾部不加拼接字符
			String temp = stringBuffer.toString();
			if(temp.endsWith(signSchema.getSpliceCharacter())){
				int end = temp.length()-signSchema.getSpliceCharacter().length();
				stringBuffer = new StringBuffer(temp.substring(0,end));
			}
		}
		return stringBuffer.append(signSchema.getEndCharacter()).toString();
	}
	
	/**
	 * 固定位置（开始/结束）参数替换
	 * @param paramName
	 * @return
	 */
	public static String createPositionCharacterKey(String paramName) {
		if(StringUtil.isEmpty(paramName)) {
			return paramName;
		}
		return ENDCHARACTER_PARAM+paramName;
	}
	
	/**
	 * 获取固定位置（开始/结束）参数替换的值
	 * @param character
	 * @return
	 * @throws GrabException 
	 */
	public static String getPositionCharacterKey(String character,Map<String, String> map, Map<String, Object> params) throws GrabException {
		if(StringUtil.isEmpty(character)) {
			return character;
		}
		if(!character.startsWith(ENDCHARACTER_PARAM)) {
			return character;
		}else {
			String key = character.replace(ENDCHARACTER_PARAM, "");
			String value = map.get(key);
			if(value == null) {
				throw new GrabException(ErrorTypeEnum.CREATE_REQUEST_ERROR, null, "签名所需开始/结束位置固定字符参数未传入", null, null);
			}
			map.remove(key);
			if(params!=null) {
				params.remove(key);
			}
			return value;
		}
	}

	/**
	 * 生成单个指定格式的值及添加值列表
	 * @param signSchema
	 * @param map
	 * @param valueMapAsc
	 * @param valuesAsc
	 */
	private static void handleValue(SignSchema signSchema, Map<String, String> map, Map<String, String> valueMapAsc,List<String> valuesAsc) {
		if(signSchema == null || ListUtils.isEmpty(signSchema.getParamNames())) {
			return;
		}
		for (String key:signSchema.getParamNames()) {
			//实际value值
			String value = map.get(key);
			//参数map中不存在
			if(value == null) {
				//签名key也参与排序
				if(signSchema.getSignKeyMap()!=null && !signSchema.getSignKeyMap().isEmpty()) {
					value = signSchema.getSignKeyMap().get(key);
				}
			}
			//用于签名格式的value值
			String s = RequestParamHandleUtil.createSingleParam(key,value, signSchema.getSingleParamFormat());
			if(StringUtil.isNotEmpty(s)) {
				valueMapAsc.put(value, s);
				valuesAsc.add(value);
			}
		}
	}

	/**
	 * 生成单个参数
	 * @param signSchema
	 * @param map
	 * @param key
	 * @return
	 */
	private static String createSingleParam(SignSchema signSchema, Map<String, String> map, String key) {
		String paramValue = map.get(key);
		//参数map中不存在
		if(paramValue == null) {
			//签名key也参与排序
			if(signSchema.getSignKeyMap()!=null && !signSchema.getSignKeyMap().isEmpty()) {
				paramValue = signSchema.getSignKeyMap().get(key);
			}
		}else {
			paramValue = RequestParamHandleUtil.createSingleParam(key, map.get(key), signSchema.getSingleParamFormat());
		}
		return paramValue;
	}
}
