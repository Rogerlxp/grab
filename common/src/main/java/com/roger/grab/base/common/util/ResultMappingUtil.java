package com.roger.grab.base.common.util;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import com.roger.grab.base.common.framework.ILog;
import com.roger.grab.base.common.framework.LogFactory;
import com.roger.grab.base.domain.content.Commodity;
import com.roger.grab.base.domain.content.Merchant;
import com.roger.grab.base.domain.grab.GrabMapping;
import com.roger.grab.base.domain.grab.GrabResultParam;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.MappingSchema;
import com.roger.grab.base.domain.grab.MappingValueParam;
import com.roger.grab.base.enums.grab.ParamMappingSelectEnum;
import com.roger.grab.base.common.util.ExpressionExecutionUtil.CacheSimpleElType;


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
		//原价
		public static final String ori_price="ori_price";
		//实际价格
		public static final String real_price="real_price";
		//按美元计原价
		public static final String ori_price_us="ori_price_us";
		//按美元计实际价格
		public static final String real_price_us="real_price_us";
		//运费价格
		public static final String shipping_price="shipping_price";
		//按美元计运费价格
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
		public static final String cpCreateTime="cpCreateTime";
		public static final String cpUpdateTime ="cpUpdateTime";
		public static final String extMap ="extMap";
		
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
				commodity.setImg(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.detail_img);
			if(value != null) {
				MappingSchema mappingSchema = map.get(GrabCommodity.detail_img);
				commodity.setDetail_img(_stringToArray(value.toString(), mappingSchema));
			}
			value = getValue(resultParam,map, result,GrabCommodity.ori_price);
			if(value != null) {
				commodity.setOri_price(_valueToBigDecimal(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.ori_price_us);
			if(value != null) {
				commodity.setOri_price_us(_valueToBigDecimal(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.real_price);
			if(value != null) {
				commodity.setReal_price(_valueToBigDecimal(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.real_price_us);
			if(value != null) {
				commodity.setReal_price_us(_valueToBigDecimal(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.shipping_price);
			if(value != null) {
				commodity.setShipping_price(_valueToBigDecimal(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.shipping_price_us);
			if(value != null) {
				commodity.setShipping_price_us(_valueToBigDecimal(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.inventory);
			if(value != null) {
				commodity.setInventory(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.sales);
			if(value != null) {
				commodity.setSales(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.comment);
			if(value != null) {
				commodity.setComment(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.positive);
			if(value != null) {
				commodity.setPositive(_valueToFloat(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.cpCategroyId);
			if(value != null) {
				commodity.setCpCategroyId(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.cpUpdateTime);
			if(value != null) {
				commodity.setCpUpdateTime(_valueToDate(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.cpCreateTime);
			if(value != null) {
				commodity.setCpCreateTime(_valueToDate(value));
			}
			value = getValue(resultParam,map, result,GrabMerchant.id);
			if(value != null) {
				commodity.setMerchantId(value.toString());
			}
			Merchant merchant = mappingToMerchant(resultParam,map,result,cpId);
			if(merchant!=null) {
				commodity.setMerchant(merchant);
				if(commodity.getCpId()!=null) {
					merchant.setCpId(commodity.getCpId());
				}
			}
			MappingSchema mappingSchema_ext = map.get(GrabCommodity.extMap);
			merchant.setExtMap(_valueToExtendMap(resultParam, result, mappingSchema_ext));

			Date date = new Date();
			commodity.setUpdateTime(date);
			commodity.setCreateTime(date);
			return commodity;
		}catch (Exception e) {
			LOGGER.error("映射对象失败",e);
		}
		return null;
	}
	
	/**
	 * 商户对象字段
	 * @author MEIZU
	 *
	 */
	public static class GrabMerchant{
		public static final String id = "mer_id";
		public static final String cpId = "mer_cpId";
		public static final String name="mer_name";
		public static final String desc = "mer_desc";
		public static final String img = "mer_img";
		//销量
		public static final String sales="mer_sales";
		//商品数量
		public static final String count="mer_count";
		//评论数量
		public static final String comment="mer_comment";
		//正面评价占比
		public static final String positive="mer_positive";
		//分类ID
		public static final String cpCategroyId="mer_cpCategroyId";
		public static final String cpCreateTime="mer_cpCreateTime";
		public static final String cpUpdateTime ="mer_cpUpdateTime";
		
		public static final String extMap ="mer_extMap";
	}
	
	/**
	 * 自动组装商户对象
	 * @param mappingSchemas
	 * @param result
	 * @return
	 */
	public static Merchant mappingToMerchant(GrabResultParam resultParam,Map<String, MappingSchema> map, Map<String, Object> result,Integer cpId) {
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

			Merchant merchant = new Merchant();
			merchant.setCpId(cpId == null?null:cpId.toString());
			Object value = getValue(resultParam, map, result, GrabMerchant.cpId);
			if(value !=null) {
				merchant.setCpId(value.toString());
			}
			value = getValue(resultParam,map, result,GrabMerchant.id);
			if(value != null) {
				merchant.setId(value.toString());
			}
			value = getValue(resultParam,map, result,GrabMerchant.name);
			if(value != null) {
				merchant.setName(value.toString());
			}
			value = getValue(resultParam,map, result,GrabMerchant.desc);
			if(value != null) {
				merchant.setDesc(value.toString());
			}
			value = getValue(resultParam,map, result,GrabMerchant.img);
			if(value != null) {
				merchant.setImg(value.toString());
			}
			value = getValue(resultParam,map, result,GrabMerchant.sales);
			if(value != null) {
				merchant.setSales(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabMerchant.comment);
			if(value != null) {
				merchant.setComment(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabMerchant.count);
			if(value != null) {
				merchant.setCount(_valueToInteger(value));
			}
			value = getValue(resultParam,map, result,GrabMerchant.positive);
			if(value != null) {
				merchant.setPositive(_valueToFloat(value));
			}
			value = getValue(resultParam,map, result,GrabMerchant.cpCategroyId);
			if(value != null) {
				merchant.setCpCategroyId(value.toString());
			}
			value = getValue(resultParam,map, result,GrabCommodity.cpUpdateTime);
			if(value != null) {
				merchant.setCpUpdateTime(_valueToDate(value));
			}
			value = getValue(resultParam,map, result,GrabCommodity.cpCreateTime);
			if(value != null) {
				merchant.setCpCreateTime(_valueToDate(value));
			}
			MappingSchema mappingSchema_ext = map.get(GrabCommodity.extMap);
			merchant.setExtMap(_valueToExtendMap(resultParam, result, mappingSchema_ext));
			
			Date date = new Date();
			merchant.setUpdateTime(date);
			merchant.setCreateTime(date);
			return merchant;
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
	
	private static Float _valueToFloat(Object value) {
		if(value instanceof String && StringUtil.isNotEmpty(value.toString())) {
			return Float.valueOf(value.toString());
		}else if(value instanceof Long){
			return ((Float)value);
		}else if(value instanceof Integer){
			return (Float)value;
		}else if(value instanceof BigDecimal) {
			return (float)((BigDecimal)value).intValue();
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
	
	private static BigDecimal _valueToBigDecimal(Object value) {
		if(value instanceof String && StringUtil.isNotEmpty(value.toString())) {
			return BigDecimal.valueOf(Long.valueOf(value.toString()));
		}else if(value instanceof Long){
			return BigDecimal.valueOf((Long)value);
		}else if(value instanceof Integer){
			return BigDecimal.valueOf((Integer)value);
		}else if(value instanceof BigDecimal) {
			return ((BigDecimal)value);
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
	
	private static List<String> _stringToArray(String value,MappingSchema mappingSchema) {
		if(StringUtil.isEmpty(value)) {
			return null;
		}
		String[] strings = value.split(SPLIT_LIST_CHAR);
		List<String> list = new ArrayList<>();
		for (String string : strings) {
			list.add(string);
		}
		return list;
	}

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
