package com.grab.common.util;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.assertj.core.util.Collections;

import com.alibaba.fastjson.JSON;
import com.alibaba.simpleEL.dialect.tiny.TinyELEvalService;
import com.grab.common.framework.ILog;
import com.grab.common.framework.LogFactory;
import com.grab.common.util.ExpressionExecutionUtil.CacheSimpleElType;
import com.grab.domain.content.Commodity;
import com.grab.domain.grab.GrabMapping;
import com.grab.domain.grab.GrabResultParam;
import com.grab.domain.grab.GrabToken;
import com.grab.domain.grab.MappingSchema;
import com.grab.domain.grab.MappingValueParam;
import com.grab.enums.grab.ParamMappingSelectEnum;


public class ResultMappingUtil{
	private static final ILog LOGGER = LogFactory.getLog(ResultMappingUtil.class);
	public static final String SPLIT_LIST_CHAR = ",";
	private static final Map<String, GrabMapping> MAP = new HashMap<>();
	
    /**
     * 将固定值加入
     * @param fixedValue
     * @param map
     */
	private static void _addFixedValue(GrabResultParam resultParam, Map<String, Object> map) {
		if(resultParam.getFixedValueParam() == null) {
			return;
		}
		Map<String, Object> fixedValue = resultParam.getFixedValueParam().getFixedValueMap();
		if(fixedValue == null || fixedValue.isEmpty()) {
			return;
		}
		if(map!=null) {
			fixedValue.keySet().stream().forEach(key -> map.put(key, fixedValue.get(key)));
		}
	}
	
	 /**
     * 替换映射字段
     * @param page
     * @param grabResult
     */
    @SuppressWarnings("unchecked")
    private static void _replaceMappingValue(List<MappingValueParam> mappingValueParams, Map<String, Object> map) {
    	if(!Collections.isNullOrEmpty(mappingValueParams) && map!=null && (!map.isEmpty())) {
    		for (MappingValueParam mappingValueParam : mappingValueParams) {
    			Object original = map.get(mappingValueParam.getKeyName());
    			if(original == null || mappingValueParam.getMappingMap() == null || mappingValueParam.getMappingMap().isEmpty()) {
    				continue;
    			}
    			Object target = mappingValueParam.getMappingMap().get(original);
    			if(target != null) {
    				map.put(mappingValueParam.getKeyName(),target);
    			}else {
    				if(mappingValueParam.getParamMappingSelectEnum() == null) {
    					mappingValueParam.setParamMappingSelectEnum(ParamMappingSelectEnum.ORIGINAL);
    				}
    				switch (mappingValueParam.getParamMappingSelectEnum()) {
    				case DEFAULT:
    					map.put(mappingValueParam.getKeyName(),mappingValueParam.getDefaultValue());
    					break;
    				case NULL:
    					map.put(mappingValueParam.getKeyName(),null);
    					break;
    				case ORIGINAL:
    				default:
    					//默认返回原始值
    					map.put(mappingValueParam.getKeyName(),original);
    					break;
    				}
    			}
    		}
    	}
    }

	/** 
	 * 取Bean的属性和值对应关系的MAP 
	 *  
	 * @param bean 
	 * @return Map 
	 */  
	public static Map<String, String> getFieldValueMap(Object bean) {  
		Class<?> cls = bean.getClass();  
		Map<String, String> valueMap = new HashMap<String, String>();  
		Method[] methods = cls.getDeclaredMethods();  
		Field[] fields = cls.getDeclaredFields();  
		for (Field field : fields) {  
			try {  
				String fieldType = field.getType().getSimpleName();  
				String fieldGetName = parGetName(field.getName());  
				if (!checkGetMet(methods, fieldGetName)) {  
					continue;  
				}  
				Method fieldGetMet = cls.getMethod(fieldGetName, new Class[] {});  
				Object fieldVal = fieldGetMet.invoke(bean, new Object[] {});  
				String result = null;  
				if ("Date".equals(fieldType)) {  
					result = fmtDate((Date) fieldVal);  
				} else {  
					if (null != fieldVal) {  
						result = String.valueOf(fieldVal);  
					}  
				}  
				//String fieldKeyName = parKeyName(field.getName());  
				valueMap.put(field.getName(), result);  
			} catch (Exception e) {  
				continue;  
			}  
		}  
		return valueMap;  
	} 

	/**
	 * 待组装的token对象属性
	 * @author MEIZU
	 *
	 */
	public static class GrabTokenKey{
		public static final String token ="token";
		public static final String expires ="expires";
	}

	/**
	 * 自动组装token对象
	 * @param mappingSchemas
	 * @param result
	 * @return
	 */
	public static GrabToken mappingToToken(GrabResultParam resultParam, Map<String, Object> result) {
		if(resultParam == null) {
			return null;
		}
		List<MappingSchema> mappingSchemas = resultParam.getMappingSchemas();
		if(Collections.isNullOrEmpty(mappingSchemas)) {
			return null;
		}
		if(result == null || result.isEmpty()) {
			return null;
		}
		_addFixedValue(resultParam, result);
		_replaceMappingValue(resultParam.getMappingValueParams(), result);
		Map<String, MappingSchema> map = resultParam.getMappingSchemaMap();
		GrabToken grabToken = new GrabToken();
		
		Object value = getValue(resultParam, map, result, GrabTokenKey.token);
		if(value == null) {
			return null;
		}
		grabToken.setToken(value.toString());
		value = getValue(resultParam, map, result, GrabTokenKey.expires);
		if(value != null) {
			grabToken.setExpires(_valueToLong(value));
		}
		return grabToken;
	}  

	/**
	 * 待组装的GrabCommodity对象属性
	 * @author MEIZU
	 *
	 */
	public static class GrabCommodity{
		public static final String id = "id";
		public static final String cpId = "cpId";
		public static final String name="name";
		public static final String desc = "desc";
		public static final String img = "img";
		public static final String detail_img = "detail_img";
		public static final String ori_price="ori_price";
		public static final String real_price="real_price";
		public static final String ori_price_us="ori_price_us";
		public static final String real_price_us="real_price_us";
		public static final String shipping_price="shipping_price";
		public static final String shipping_price_us="shipping_price_us";
		//库存
		public static final String inventory="inventory";
		//销量
		public static final String sales="sales";
		//评论数量
		public static final String comment="comment";
		//正面评价占比
		public static final String positive="positive";
		//分类ID
		public static final String cpCategroyId="cpCategroyId";
		//商户Id
		public static final String merchantId="merchantId";
		//商户商品数量
		public static final String mer_com_count="mer_com_count";
		//商户评论数量
		public static final String mer_comment="mer_comment";
		//商户正面评论
		public static final String mer_positive="mer_positive";
		public static final String createTime="createTime";
		public static final String updateTime ="updateTime";
	}
	
	/**
	 * 自动组装Content对象
	 * @param mappingSchemas
	 * @param result
	 * @return
	 */
	public static Commodity mappingToCommodity(GrabResultParam resultParam,Map<String, MappingSchema> map, Map<String, Object> result,Integer cpId) {
		try {
			if(map == null || map.isEmpty() || cpId == null) {
				return null;
			}
			if(result == null || result.isEmpty()) {
				return null;
			}
			if(resultParam == null) {
				return null;
			}
			_addFixedValue(resultParam, result);
			_replaceMappingValue(resultParam.getMappingValueParams(), result);

			Commodity commodity = new Commodity();
			commodity.setCpId(cpId == null?null:cpId.toString());
			Object value = getValue(resultParam, map, result, GrabCommodity.cpId);
			if(value !=null) {
				commodity.setCpId(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.id);
			if(value != null) {
				commodity.setId(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.name);
			if(value != null) {
				commodity.setName(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.desc);
			if(value != null) {
				commodity.setDesc(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.img);
			if(value != null) {
				//""处理
				commodity.setImg(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.desc);
			if(value != null) {
				//长度
				commodity.setDesc(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.detail_img);
			if(value != null) {
				//长度
				MappingSchema mappingSchema = map.get(GrabCommodity.detail_img);
				commodity.setDetail_img((value, mappingSchema));
			}
			value = getValue(resultParam,map, result,GrabCommodity.ori_price);
			if(value != null) {
				//长度
				MappingSchema mappingSchema = map.get(GrabCommodity.ori_price);
				commodity.setOri_price(_valueToLong(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.source);
			if(value != null) {
				//长度
				commodity.setSource(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.h5_url);
			if(value != null) {
				commodity.setH5_url(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.share_url);
			if(value != null) {
				commodity.setShare_url(value.toString());
			}
			//状态对应关系转换
			value = getValue(resultParam,map, result,GrabCommodity.status);
			if(value != null) {
				commodity.setStatus(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.authorName);
			if(value != null) {
				commodity.setAuthor(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.pv);
			if(value != null) {
				commodity.setPv(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.commentCount);
			if(value != null) {
				commodity.setCommentCount(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.shareCount);
			if(value != null) {
				commodity.setShareCount(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.collectCount);
			if(value != null) {
				commodity.setCollectCount(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.diggCount);
			if(value != null) {
				commodity.setDiggCount(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.buryCount);
			if(value != null) {
				commodity.setBuryCount(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.publish_time);
			if(value != null) {
				commodity.setPublish_time(_valueToDate(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.cp_recom_time);
			if(value != null) {
				commodity.setCp_recom_time(_valueToDate(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.weight);
			if(value != null) {
				commodity.setWeight(_valueToInteger(value));
			}
			commodity.setCreate_time(new Date());
			commodity.setRelease_time(new Date());
			commodity.setUpdate_time(new Date());
			commodity.setEntityUniqId( ContentIdUtil.createMeizuUniqEntityId(commodity.getCpId(), commodity.getCpEntityId()) );

			MappingSchema mappingSchema_ext = map.get(GrabCommodity.extend);
			commodity.setExtendMap(_valueToExtendMap(resultParam, result, mappingSchema_ext));
			
			mappingSchema_ext = map.get(GrabCommodity.requestId);
			commodity.setRequestId(_valueToExtendMap(resultParam, result, mappingSchema_ext));
			
			value = getValue(resultParam,map, result,GrabCommodity.bigImg);
			if(value != null) {
				MappingSchema mappingSchema = map.get(GrabCommodity.bigImg);
				if(value.getClass().isArray()) {
					int count = Array.getLength(value);
					for(int i=0 ; i<count;i++) {
						Object object = Array.get(value, i);
						handlerBigImg(commodity, object,mappingSchema);
					}
				}else if(value instanceof JSONArray) {
					JSONArray array = (JSONArray) value;
					for (Object object : array) {
						handlerBigImg(commodity, object,mappingSchema);
					}
				}else if(value instanceof List) {
					List<String> array = (List<String>) value;
					for (String object : array) {
						handlerBigImg(commodity, object,mappingSchema);
					}
				}else {
					//单个对象
					handlerBigImg(commodity, value,mappingSchema);
					Object width = getValue(resultParam,map, result,GrabCommodity.bigImg_width);
					Object height = getValue(resultParam,map, result,GrabCommodity.bigImg_height);
					if(commodity.getImgInfo()!=null && !Collections.isNullOrEmpty(commodity.getImgInfo().getBigImgInfos())) {
						if(commodity.getImgInfo().getBigImgInfos().size() == 1) {
							ImgInfo imgInfo = commodity.getImgInfo().getBigImgInfos().get(0);
							if(imgInfo!=null) {
								imgInfo.setHeight(_valueToInteger(height));
								imgInfo.setWidth(_valueToInteger(width));
							}
						}
					}
				}
			}
			value = getValue(resultParam,map, result,GrabCommodity.midImg);
			if(value != null) {
				MappingSchema mappingSchema = map.get(GrabCommodity.midImg);
				if(value.getClass().isArray()) {
					int count = Array.getLength(value);
					for(int i=0 ; i<count;i++) {
						Object object = Array.get(value, i);
						handlerMidImg(commodity, object,mappingSchema);
					}
				}else if(value instanceof JSONArray) {
					JSONArray array = (JSONArray) value;
					for (Object object : array) {
						handlerMidImg(commodity, object,mappingSchema);
					}
				}else if(value instanceof List) {
					List<String> array = (List<String>) value;
					for (String object : array) {
						handlerMidImg(commodity, object,mappingSchema);
					}
				}else {
					//单个对象
					handlerMidImg(commodity, value,mappingSchema);
					Object width = getValue(resultParam,map, result,GrabCommodity.midImg_width);
					Object height = getValue(resultParam,map, result,GrabCommodity.midImg_height);
					if(commodity.getImgInfo()!=null && !Collections.isNullOrEmpty(commodity.getImgInfo().getMidImgInfos())) {
						if(commodity.getImgInfo().getMidImgInfos().size() == 1) {
							ImgInfo imgInfo = commodity.getImgInfo().getMidImgInfos().get(0);
							if(imgInfo!=null) {
								imgInfo.setHeight(_valueToInteger(height));
								imgInfo.setWidth(_valueToInteger(width));
							}
						}
					}
				}
			}
			value = getValue(resultParam,map, result,GrabCommodity.smallImg);
			if(value != null) {
				MappingSchema mappingSchema = map.get(GrabCommodity.smallImg);
				if(value.getClass().isArray()) {
					int count = Array.getLength(value);
					for(int i=0 ; i<count;i++) {
						Object object = Array.get(value, i);
						handlerSmallImg(commodity, object,mappingSchema);
					}
				}else if(value instanceof JSONArray) {
					JSONArray array = (JSONArray) value;
					for (Object object : array) {
						handlerSmallImg(commodity, object,mappingSchema);
					}
				}else if(value instanceof List) {
					List<String> array = (List<String>) value;
					for (String object : array) {
						handlerSmallImg(commodity, object,mappingSchema);
					}
				}else {
					//单个对象
					handlerSmallImg(commodity, value,mappingSchema);
					Object width = getValue(resultParam,map, result,GrabCommodity.smallImg_width);
					Object height = getValue(resultParam,map, result,GrabCommodity.smallImg_height);
					if(commodity.getImgInfo()!=null && !Collections.isNullOrEmpty(commodity.getImgInfo().getSmallImgInfos())) {
						if(commodity.getImgInfo().getSmallImgInfos().size() == 1) {
							ImgInfo imgInfo = commodity.getImgInfo().getSmallImgInfos().get(0);
							if(imgInfo!=null) {
								imgInfo.setHeight(_valueToInteger(height));
								imgInfo.setWidth(_valueToInteger(width));
							}
						}
					}
				}
			}
			value = getValue(resultParam,map, result,GrabCommodity.content);
			if(value != null) {
				commodity.setContent(value.toString());
			}
			mappingToAuthor(resultParam,commodity,map,result,cpId);
			return commodity;
		}catch (Exception e) {
			LOGGER.error("映射对象失败",e);
		}
		return null;
	}

	private static Map<String, Object> _valueToExtendMap(GrabResultParam resultParam, Map<String, Object> result,MappingSchema mappingSchema_ext) {
		if(mappingSchema_ext != null ) {
			Map<String, Object> map = new HashMap<>();
			//直接取值策略生成扩展字段
			if(!Collections.isNullOrEmpty(mappingSchema_ext.getValNames())) {
				for (int i=0;i<mappingSchema_ext.getValNames().size();i++) {
					String mapKey = mappingSchema_ext.getValNames().get(i);
					if(StringUtil.isNotEmpty(mapKey)) {
						Object object = result.get(mapKey);
						if(object!=null) {
							map.put(mapKey,object);
						}
					}
				}
			}
			//通过表达式策略生成扩展字段
			Map<String, String> expressionMap = null;
			if(!StringUtil.isEmpty(mappingSchema_ext.getExpression())) {
				expressionMap = JSON.parseObject(mappingSchema_ext.getExpression(), Map.class);
			}
			if(expressionMap !=null && (!expressionMap.isEmpty())) {
				String serviceId = ExpressionExecutionUtil.CacheSimpleElType.GRABRESULT.getName(resultParam.getGrabId());
				TinyELEvalService service = ExpressionExecutionUtil.getSimpleElService(serviceId);
				if(service == null && result!=null && (!result.isEmpty())) {
					synchronized (CacheSimpleElType.GRABRESULT){
						service = ExpressionExecutionUtil.getSimpleElService(serviceId);
						if(service == null) {
							service = new TinyELEvalService();
							service.setAllowMultiStatement(true); 
							Set<Entry<String, Object>> entries = result.entrySet();
							for (Entry<String, Object> entry : entries) {
								if(entry.getValue() == null) {
									service.regsiterVariant(Object.class, entry.getKey());
								}else {
									service.regsiterVariant(entry.getValue().getClass(), entry.getKey());
								}
							}
							ExpressionExecutionUtil.putSimpleElService(ExpressionExecutionUtil.CacheSimpleElType.GRABRESULT,resultParam.getGrabId(),service);
						}
					}
				}
				Set<Entry<String, String>> set = expressionMap.entrySet();
				for (Entry<String, String> entry : set) {
					Object object = ExpressionExecutionUtil.execution_simpleEl(serviceId,service, entry.getValue(), result);
					map.put(entry.getKey(),object);
				}

			}
			return map;
		}
		return null;
	}
	
	private static Integer _valueToInteger(Object value) {
		if(value instanceof String && StringUtil.isNotEmpty(value.toString())) {
			return Float.valueOf(value.toString()).intValue();
		}else if(value instanceof Long){
			return ((Long)value).intValue();
		}else if(value instanceof Integer){
			return (Integer)value;
		}else if(value instanceof BigDecimal) {
			return ((BigDecimal)value).intValue();
		}
		return null;
	}
	
	private static Long _valueToLong(Object value) {
		if(value instanceof String && StringUtil.isNotEmpty(value.toString())) {
			return Long.valueOf(value.toString());
		}else if(value instanceof Long){
			return ((Long)value);
		}else if(value instanceof Integer){
			return new Long((Integer)value);
		}else if(value instanceof BigDecimal) {
			return ((BigDecimal)value).longValue();
		}
		return null;
	}
	
	private static Long _valueToBigDecimal(Object value) {
		if(value instanceof String && StringUtil.isNotEmpty(value.toString())) {
			return BigDecimal.valueOf(value.toString());
		}else if(value instanceof Long){
			return ((Long)value);
		}else if(value instanceof Integer){
			return new Long((Integer)value);
		}else if(value instanceof BigDecimal) {
			return ((BigDecimal)value).longValue();
		}
		return null;
	}
	
	private static Date _valueToDate(Object value) {
		if( value instanceof Integer ) {
			Long tempValue = new Long( ( Integer )value );
			return new Date( tempValue * 1000 );
		}else if(value instanceof Long){
			Long tempValue=(Long)value;
			if(tempValue<4102416000L){ 
				tempValue=tempValue*1000;
			}
			return new Date(tempValue);
		}else if(value instanceof String){
			return parseDate(value.toString());
		}
		return null;
	}
	
	private static String _arrayToString(Object value,MappingSchema mappingSchema) {
		if(value.getClass().isArray()) {
			int count = Array.getLength(value);
			StringBuffer sBuffer = new StringBuffer();
			for(int i=0 ; i<count;i++) {
				Object object = Array.get(value, i);
				sBuffer.append(object);
				if(i+1<count) {
					sBuffer.append(SPLIT_LIST_CHAR);
				}
			}
			return sBuffer.toString();
		}else if(value instanceof List) {
			List array = (List) value;
			StringBuffer sBuffer = new StringBuffer();
			int i=0;
			for (Object object : array) {
				sBuffer.append(object);
				if(i+1<array.size()) {
					sBuffer.append(SPLIT_LIST_CHAR);
				}
				i++;
			}
			return sBuffer.toString();
		}else {
			//单个对象
			return value.toString();
		}
	}

//	private static void handlerBigImg(Content content, Object value,MappingSchema mappingSchema) {
//		Img img = content.getImgInfo() == null ? new Img():content.getImgInfo();
//		List<ImgInfo> list = img.getBigImgInfos() == null ? new ArrayList<>():img.getBigImgInfos();
//		ImgInfo info = new ImgInfo();
//		String url = value.toString();
//		if(StringUtil.isEmpty(url)) {
//			return;
//		}
//		if(!(url.startsWith("http:") || url.startsWith("https:"))) {
//			url = "http:"+url;
//		}
//		url = url.replaceAll(",", "%2c");
//		info.setUrl(url);
//		list.add(info);
//		img.setBigImgInfos(list);
//		content.setImgInfo(img);
//	}  
	
//	private static void handlerMidImg(Content content, Object value,MappingSchema mappingSchema) {
//		Img img = content.getImgInfo() == null ? new Img():content.getImgInfo();
//		List<ImgInfo> list = img.getMidImgInfos() == null ? new ArrayList<>():img.getMidImgInfos();
//		ImgInfo info = new ImgInfo();
//		String url = value.toString();
//		if(StringUtil.isEmpty(url)) {
//			return;
//		}
//		if(!(url.startsWith("http:") || url.startsWith("https:"))) {
//			url = "http:"+url;
//		}
//		url = url.replaceAll(",", "%2c");
//		info.setUrl(url);
//		list.add(info);
//		img.setMidImgInfos(list);
//		content.setImgInfo(img);
//	}  
	
//	private static void handlerSmallImg(Content content, Object value,MappingSchema mappingSchema) {
//		Img img = content.getImgInfo() == null ? new Img():content.getImgInfo();
//		List<ImgInfo> list = img.getSmallImgInfos() == null ? new ArrayList<>():img.getSmallImgInfos();
//		ImgInfo info = new ImgInfo();
//		String url = value.toString();
//		if(StringUtil.isEmpty(url)) {
//			return;
//		}
//		if(!(url.startsWith("http:") || url.startsWith("https:"))) {
//			url = "http:"+url;
//		}
//		url = url.replaceAll(",", "%2c");
//		info.setUrl(url);
//		list.add(info);
//		img.setSmallImgInfos(list);
//		content.setImgInfo(img);
//	}  
	
	
	
	
	
	/**
	 * 自动组装cpContent对象
	 * @param resultParam
	 * @param map2
	 * @param result
	 * @param cpId
	 * @return
	 */
//	public static CpContent mappingToCpContent(GrabResultParam resultParam, Map<String, MappingSchema> map,Map<String, Object> result, Integer cpId) {
//		try {
//			if(map == null || map.isEmpty() || cpId == null) {
//				return null;
//			}
//			if(result == null || result.isEmpty()) {
//				return null;
//			}
//			if(resultParam == null) {
//				return null;
//			}
//			CpContent cpContent = new CpContent();
//			cpContent.setCpId(cpId);
//			Object value = getValue(resultParam,map, result,GrabCommodity.cpEntityId);
//			if(value != null) {
//				cpContent.setCpEntityId(value.toString());
//			}
//			value =getValue(resultParam,map, result,GrabCommodity.status);
//			if(value != null) {
//				cpContent.setCp_status(value.toString());
//			}
//			value = getValue(resultParam,map, result,GrabCommodity.type);
//			if(value != null) {
//				cpContent.setCp_contentType(value.toString());
//			}
//			value = getValue(resultParam,map, result,GrabCommodity.title);
//			if(value != null) {
//				String string = value.toString();
//				cpContent.setCp_title(string.substring(0, Math.min(string.length(), 170)));
//			}
//			value = getValue(resultParam,map, result,GrabCommodity.category);
//			if(value != null) {
//				String string = value.toString();
//				cpContent.setCp_category(string.substring(0, Math.min(string.length(), 170)));
//			}
//			value = getValue(resultParam,map, result,GrabCommodity.tag);
//			if(value != null) {
//				String string = value.toString();
//				cpContent.setCp_tag(string.substring(0, Math.min(string.length(), 170)));
//			}
//			value = getValue(resultParam,map, result,GrabCommodity.h5_url);
//			if(value != null) {
//				cpContent.setCp_url(value.toString());
//			}
//			value = getValue(resultParam,map, result,GrabCommodity.publish_time);
//			if(value != null) {
//				cpContent.setPublishTime(_valueToDate(value));
//			}
//			cpContent.setCreateTime(new Date());
//			cpContent.setCp_content(JSON.toJSONString(result));
//			return cpContent;
//		}catch (Exception e) {
//			LOGGER.error("映射对象失败",e);
//		}
//		return null;
//	}


	/**
	 * 待组装的Author对象属性
	 * @author Roger
	 *
	 */
	public static class GrabAuthorKey{
		public static final String id="author.id";
		public static final String cpAuthorId="author.cpAuthorId";
		public static final String name="author.name";
		public static final String desc="author.desc";
		public static final String followCount="author.followCount";
		public static final String img="author.img";
		public static final String homeUrl="author.homeUrl";
		public static final String status="author.status";
		public static final String videoCount="author.videoCount";
		public static final String articleCount="author.articleCount";
		public static final String hot="author.hot";
		public static final String recommendStar="author.recommendStar";
		public static final String contentSign="author.contentSign";
		public static final String openType="author.openType";
	}

	/**
	 * 自动组装Content对象
	 * @param mappingSchemas
	 * @param result
	 * @return
	 */
//	public static Author mappingToAuthor(GrabResultParam resultParam,Content c,Map<String, MappingSchema> map, Map<String, Object> result,Integer cpId) {
//		try {
//			if(map == null || map.isEmpty() || cpId == null) {
//				return null;
//			}
//			if(result == null || result.isEmpty()) {
//				return null;
//			}
//			if(resultParam == null) {
//				return null;
//			}
//			_addFixedValue(resultParam, result);
//			_replaceMappingValue(resultParam.getMappingValueParams(), result);
//
//			Author author = null;
//
//			Object value = getValue(resultParam,map, result,GrabAuthorKey.cpAuthorId);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setCpAuthorId(value.toString());
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.id);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setId(_valueToInteger(value));
//			}
//			value =getValue(resultParam,map, result,GrabAuthorKey.name);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setName(value.toString());
//				if(c!=null && StringUtil.isEmpty(c.getAuthor())) {
//					c.setAuthor(author.getName());
//				}
//			}else if(c!=null && StringUtil.isNotEmpty(c.getAuthor())) {
//				author = author == null ? new Author():author;
//				author.setName(c.getAuthor());
//			}
//
//			value = getValue(resultParam,map, result,GrabAuthorKey.desc);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setDesc(value.toString());
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.img);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				String url = value.toString();
//				if(!(url.startsWith("http:") || url.startsWith("https:"))) {
//					url = "http:"+url;
//				}
//				author.setImg(url);
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.homeUrl);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setHomeUrl(value.toString());
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.followCount);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setFollowCount(_valueToInteger(value));
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.status);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setStatus(_valueToInteger(value));
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.videoCount);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setVideoCount(_valueToInteger(value));
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.articleCount);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setArticleCount(_valueToInteger(value));
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.hot);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setHot(_valueToInteger(value));
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.recommendStar);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				if(value instanceof String && StringUtil.isNotEmpty(value.toString())) {
//					author.setRecommendStar(Float.valueOf(value.toString()));
//				}else if(value instanceof Long){
//					author.setRecommendStar(((Long)value));
//				}else if(value instanceof Integer){
//					author.setRecommendStar((Integer)value);
//				}else if(value instanceof Float){
//					author.setRecommendStar((Float)value);
//				}
//			}
//			value = getValue(resultParam,map, result,GrabAuthorKey.contentSign);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setContentSign(_valueToInteger(value));
//			}
//			value =getValue(resultParam,map, result,GrabAuthorKey.openType);
//			if(value != null) {
//				author = author == null ? new Author():author;
//				author.setOpenType(_valueToInteger(value));
//			}
//			if(author == null) {
//				return null;
//			}
//			if(c!=null) {
//				c.setUserInfo(author);
//			}
//			author.setCpId(cpId);
//			if(c!=null && c.getCpId() == null) {
//				c.setCpId(cpId);
//			}
//			author.setCreateTime(new Date());
//			return author;
//		}catch (Exception e) {
//			LOGGER.error("映射对象失败",e);
//		}
//		return null;
//	} 

	private static Object getValue(GrabResultParam resultParam,Map<String, MappingSchema> map,Map<String, Object> result,String attribute ) {
		MappingSchema mappingSchema = map.get(attribute);
		if(mappingSchema == null) {
			return null;
		}
		//优先使用多字段顺序选择策略
		Object object = null;
		if(!Collections.isNullOrEmpty(mappingSchema.getValNames())){
			for (int i=0;i<mappingSchema.getValNames().size();i++) {
				String mapKey = mappingSchema.getValNames().get(i);
				if(StringUtil.isNotEmpty(mapKey)) {
					object = result.get(mapKey);
				}
				if(object!=null) {
					return object;
				}
			}
		}else if(StringUtil.isNotEmpty(mappingSchema.getExpression())) {
			//使用表达式取值策略
			String serviceId = ExpressionExecutionUtil.CacheSimpleElType.GRABRESULT.getName(resultParam.getGrabId());
			TinyELEvalService service = ExpressionExecutionUtil.getSimpleElService(serviceId);
			if(service == null && result!=null && (!result.isEmpty())) {
				synchronized (CacheSimpleElType.GRABRESULT){
					service = ExpressionExecutionUtil.getSimpleElService(serviceId);
					if(service == null) {
						service = new TinyELEvalService();
						service.setAllowMultiStatement(true); 
						Set<Entry<String, Object>> entries = result.entrySet();
						for (Entry<String, Object> entry : entries) {
							if(entry.getValue() == null) {
								service.regsiterVariant(Object.class, entry.getKey());
							}else {
								service.regsiterVariant(entry.getValue().getClass(), entry.getKey());
							}
						}
						ExpressionExecutionUtil.putSimpleElService(ExpressionExecutionUtil.CacheSimpleElType.GRABRESULT,resultParam.getGrabId(),service);
					}
				}
			}
			object = ExpressionExecutionUtil.execution_simpleEl(serviceId,service, mappingSchema.getExpression(), result);
		}
		return object;
	}

	/**
	 * 自动组装对象
	 * @param className
	 * @param valMap
	 * @return
	 */
	public static Object setFieldValue(String className, Map<String, Object> valMap,Map<String, MappingSchema> schemaMap) {
		if(StringUtil.isEmpty(className)) {
			return null;
		}
		if(schemaMap == null || schemaMap.isEmpty()) {
			return null;
		}
		try {
			GrabMapping mapping = MAP.get(className);
			if(mapping == null) {
				Class<?> objClass = Class.forName(className);
				if(objClass!=null) {
					mapping = new GrabMapping();
					mapping.setClassName(className);
					mapping.setObjClass(objClass);
					mapping.setMethods(objClass.getMethods());
					mapping.setFields(objClass.getDeclaredFields());
					MAP.put(className, mapping);
				}
			}
			if(valMap!=null && !valMap.isEmpty()) {
				return setFieldValue(mapping, valMap,schemaMap);
			}
			return null;
		} catch (Exception e) {
			LOGGER.error("映射对象失败，className:"+className,e);
		}
		return null;
	}

	/** 
	 * set属性的值到Bean 
	 *  
	 * @param bean 
	 * @param valMap 
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 * @throws SecurityException 
	 * @throws NoSuchMethodException 
	 * @throws InvocationTargetException 
	 * @throws IllegalArgumentException 
	 */  
	private static Object setFieldValue(GrabMapping mapping, Map<String, Object> valMap,Map<String, MappingSchema> schemaMap) throws InstantiationException, IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
		Class<?> cls = mapping.getObjClass();  
		// 取出bean里的所有方法  
		Method[] methods = mapping.getMethods();
		Field[] fields = mapping.getFields();  
		Object bean = cls.newInstance();
		for (Field field : fields) { 
			String  fieldKeyName = field.getName();  
			MappingSchema schema = schemaMap.get(fieldKeyName); 
			if(schema == null) {
				continue;
			}
			Object object = getValue(null,schemaMap, valMap, fieldKeyName); 
			String value = object == null?null:object.toString();
			if(StringUtil.isEmpty(value)) {
				continue;
			}

			String fieldSetName = parSetName(field.getName());  
			if (!checkSetMet(methods, fieldSetName)) {  
				continue;  
			}  
			Method fieldSetMet = cls.getMethod(fieldSetName,field.getType());  
			//String fieldKeyName = parKeyName(field.getName());  
			String fieldType = field.getType().getSimpleName();  
			if ("String".equals(fieldType)) {  
				fieldSetMet.invoke(bean, value);  
			} else if ("Date".equals(fieldType)) {  
				Date temp = parseDate(value);  
				fieldSetMet.invoke(bean, temp);  
			} else if ("Integer".equals(fieldType)  
					|| "int".equals(fieldType)) {  
				Integer intval = Integer.parseInt(value);  
				fieldSetMet.invoke(bean, intval);  
			} else if ("Long".equalsIgnoreCase(fieldType)) {  
				Long temp = Long.parseLong(value);  
				fieldSetMet.invoke(bean, temp);  
			} else if ("Double".equalsIgnoreCase(fieldType)) {  
				Double temp = Double.parseDouble(value);  
				fieldSetMet.invoke(bean, temp);  
			} else if ("Boolean".equalsIgnoreCase(fieldType)) {  
				Boolean temp = Boolean.parseBoolean(value);  
				fieldSetMet.invoke(bean, temp);  
			} else {  
				System.out.println("not supper type" + fieldType);  
			}  
		} 
		return bean;
	}  

	/** 
	 * 格式化string为Date 
	 *  
	 * @param datestr 
	 * @return date 
	 */  
	private static Date parseDate(String datestr) {  
		if (null == datestr || "".equals(datestr)) {  
			return null;  
		}  
		try {  
			String fmtstr = null;  
			if (datestr.indexOf(':') > 0) {  
				fmtstr = "yyyy-MM-dd HH:mm:ss";  
			} else {  
				fmtstr = "yyyy-MM-dd";  
			}  
			SimpleDateFormat sdf = new SimpleDateFormat(fmtstr, Locale.UK);  
			return sdf.parse(datestr);  
		} catch (Exception e) {  
			return null;  
		}  
	}  

	/** 
	 * 日期转化为String 
	 *  
	 * @param date 
	 * @return date string 
	 */  
	private static String fmtDate(Date date) {  
		if (null == date) {  
			return null;  
		}  
		try {  
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",  
					Locale.US);  
			return sdf.format(date);  
		} catch (Exception e) {  
			return null;  
		}  
	}  

	/** 
	 * 判断是否存在某属性的 set方法 
	 *  
	 * @param methods 
	 * @param fieldSetMet 
	 * @return boolean 
	 */  
	private static boolean checkSetMet(Method[] methods, String fieldSetMet) {  
		for (Method met : methods) {  
			if (fieldSetMet.equals(met.getName())) {  
				return true;  
			}  
		}  
		return false;  
	}  

	/** 
	 * 判断是否存在某属性的 get方法 
	 *  
	 * @param methods 
	 * @param fieldGetMet 
	 * @return boolean 
	 */  
	private static boolean checkGetMet(Method[] methods, String fieldGetMet) {  
		for (Method met : methods) {  
			if (fieldGetMet.equals(met.getName())) {  
				return true;  
			}  
		}  
		return false;  
	}  

	/** 
	 * 拼接某属性的 get方法 
	 *  
	 * @param fieldName 
	 * @return String 
	 */  
	private static String parGetName(String fieldName) {  
		if (null == fieldName || "".equals(fieldName)) {  
			return null;  
		}  
		int startIndex = 0;  
		if (fieldName.charAt(0) == '_')  
			startIndex = 1;  
		return "get"  
		+ fieldName.substring(startIndex, startIndex + 1).toUpperCase()  
		+ fieldName.substring(startIndex + 1);  
	}  

	/** 
	 * 拼接在某属性的 set方法 
	 *  
	 * @param fieldName 
	 * @return String 
	 */  
	private static String parSetName(String fieldName) {  
		if (null == fieldName || "".equals(fieldName)) {  
			return null;  
		}  
		int startIndex = 0;  
		if (fieldName.charAt(0) == '_')  
			startIndex = 1;  
		return "set"  
		+ fieldName.substring(startIndex, startIndex + 1).toUpperCase()  
		+ fieldName.substring(startIndex + 1);  
	}  

	/** 
	 * 获取存储的键名称（调用parGetName） 
	 *  
	 * @param fieldName 
	 * @return 去掉开头的get 
	 */  
	private static String parKeyName(String fieldName) {  
		String fieldGetName = parGetName(fieldName);  
		if (fieldGetName != null && fieldGetName.trim() != ""  
				&& fieldGetName.length() > 3) {  
			return fieldGetName.substring(3);  
		}  
		return fieldGetName;  
	}
}
