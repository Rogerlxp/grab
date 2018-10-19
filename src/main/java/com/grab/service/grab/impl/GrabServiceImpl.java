package com.grab.service.grab.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;

import org.assertj.core.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.grab.common.framework.ILog;
import com.grab.common.framework.LogFactory;
import com.grab.common.util.StringUtil;
import com.grab.common.util.TokenUtil;
import com.grab.dao.mapping.GrabBaseMapper;
import com.grab.dao.mapping.GrabErrorLogMapper;
import com.grab.dao.mapping.GrabMapper;
import com.grab.dao.mapping.GrabMappingMapper;
import com.grab.dao.mapping.GrabSignMapper;
import com.grab.dao.redis.GrabDao;
import com.grab.dao.redis.GrabMappingDao;
import com.grab.domain.exception.GrabException;
import com.grab.domain.grab.ExpiryMap;
import com.grab.domain.grab.GrabErrorCode;
import com.grab.domain.grab.GrabErrorLog;
import com.grab.domain.grab.GrabModel;
import com.grab.domain.grab.GrabModelField;
import com.grab.domain.grab.GrabParam;
import com.grab.domain.grab.GrabParamString;
import com.grab.domain.grab.GrabResultParam;
import com.grab.domain.grab.GrabResultParamString;
import com.grab.domain.grab.GrabSite;
import com.grab.domain.grab.GrabToken;
import com.grab.domain.grab.GrabTriggerParam;
import com.grab.domain.grab.SignSchemaString;
import com.grab.domain.grab.TokenSchema;
import com.grab.domain.redis.RedisKeys;
import com.grab.enums.grab.ErrorTypeEnum;
import com.grab.enums.grab.HandleProcessEnum;
import com.grab.enums.grab.StatusEnum;
import com.grab.service.grab.IGrabService;

/**
 * 
 * @author Roger
 *
 */
@Service("GrabServiceImpl")
public class GrabServiceImpl implements IGrabService{
    private static final ILog LOGGER = LogFactory.getLog(GrabServiceImpl.class);
    public static final SimpleDateFormat FORMAT_HOUR = new SimpleDateFormat("yyMMdd_HH");
    public static final SimpleDateFormat FORMAT_DATE = new SimpleDateFormat("yyMMdd");
    
    public static final int DATE_EXPIRE_LENGHT = 10*24*3600;
    public static final int HOUR_EXPIRE_LENGHT = 48*3600;
    
    @Autowired
    private RedisTemplate redisTemplate;
	@Autowired
	@Qualifier("GrabDao")
	private GrabMapper grabMapper;
	@Autowired
	private GrabSignMapper grabSignMapper;
	@Autowired
	private GrabBaseMapper grabBaseMapper;
	@Autowired
	private GrabErrorLogMapper grabErrorLogMapper;
	@Autowired
	@Qualifier("GrabMappingDao")
	private GrabMappingMapper grabMappingMapper;
	private static final ExpiryMap<Integer, String> GrabParamMap = new ExpiryMap<Integer, String>(300000);//本地保存5分钟
	private static final ExpiryMap<Integer, String> GrabResultParamMap = new ExpiryMap<Integer, String>(300000);//本地保存5分钟
	private static final int TOKEN_EXPRESS = 604800;
	
	@Override
	public List<GrabErrorCode> getErrorCode() {
		return grabBaseMapper.getErrorCodes();
	}
	
	@Override
	public List<GrabModelField> getModelFields(Integer modelId) {
		return grabBaseMapper.getModelFields(modelId);
	}
	
	@Override
	public List<GrabModel> getModels() {
		return grabBaseMapper.getModels();
	}

	@Override
	public GrabParam getGrabParam(Integer grabId) {
		String value = GrabParamMap.get(grabId);
		if(value != null) {
			return JSON.parseObject(value, GrabParam.class);
		}
		if(grabId!=null && grabId > 0) {
			GrabParamString grabParamString = grabMapper.get(grabId);
			if(grabParamString != null) {
				GrabParam grabParam = new GrabParam(grabParamString);
				GrabParamMap.put(grabId, JSON.toJSONString(grabParam,SerializerFeature.WriteMapNullValue));
				return grabParam;
			}
		}
		return null;
	}
	
	@Override
	public List<GrabParam> getGrabParam(List<Integer> grabIds) {
		if(!Collections.isNullOrEmpty(grabIds)) {
			List<GrabParamString> grabParamStrings = grabMapper.getList(grabIds);
			if(!Collections.isNullOrEmpty(grabParamStrings)) {
				List<GrabParam> grabParams = new ArrayList<>();
				for (GrabParamString gs : grabParamStrings) {
					grabParams.add( new GrabParam(gs));
				}
				return grabParams;
			}
		}
		return null;
	}
	
	@Override
	public GrabResultParam getGrabResultParam(Integer grabId) throws GrabException {
		String value = GrabResultParamMap.get(grabId);
		if(value != null) {
			return JSON.parseObject(value, GrabResultParam.class);
		}
		GrabResultParamString mappingSchemaString = grabMappingMapper.get(grabId);
		if(mappingSchemaString == null) {
			return null;
		}
		if(mappingSchemaString.getEntityTypeEnum() == null) {
			throw new GrabException(ErrorTypeEnum.CONFIG, null, "映射对象配置不正确", null, grabId);
		}
		GrabResultParam grabResultParam = new GrabResultParam();
		grabResultParam.setEntityType(mappingSchemaString.getEntityTypeEnum());
		grabResultParam.setGrabId(grabId);
		grabResultParam.setMappingSchemas(mappingSchemaString.getMappingSchemas());
		grabResultParam.setFixedValueParam(mappingSchemaString.getFixedValueParam());
		grabResultParam.setMappingValueParams(mappingSchemaString.getMappingValueParams());
		GrabResultParamMap.put(grabId, JSON.toJSONString(grabResultParam));
		return grabResultParam;
	}
	
	@Override
	public boolean refCache(Integer grabId) {
		grabMapper.delCache(grabId);
		grabMappingMapper.delCache(grabId);
		return true;
	}
	
	@Override
	public GrabParamString getGrabParamString(Integer grabId) {
		return grabMapper.get(grabId);
	}

	@Override
	public SignSchemaString getSignSchemaString(Integer signId) {
		return grabSignMapper.get(signId);
	}
	
	@Override
	public GrabResultParamString getGrabResultParamString(Integer grabId) {
		return grabMappingMapper.get(grabId);
	}
	
	@Override
	public int addGrabParam(GrabParamString grabParamString) {
		return grabMapper.add(grabParamString);
	}

	@Override
	public int addGrabSign(SignSchemaString signSchemaString) {
		return grabSignMapper.add(signSchemaString);
	}
	
	@Override
	public boolean addGrabResultString(GrabResultParamString schemaString) {
		return grabMappingMapper.add(schemaString) > 0;
	}
	
	public List<GrabParamString> findGrabParam(GrabParamString grabParamString){
		return grabMapper.find(grabParamString);
	}
	
	public List<GrabResultParamString> findGrabResultString(GrabResultParamString grabResultParamString){
		return grabMappingMapper.find(grabResultParamString);
	}
	
	public List<SignSchemaString> findSignSchemaString(SignSchemaString signSchemaString){
		return grabSignMapper.find(signSchemaString);
	}
	
	public void updateGrabParam(GrabParamString grabParamString) {
		grabMapper.update(grabParamString);
	}
	
	public void updateGrabResultString(GrabResultParamString grabResultParamString) {
		grabMappingMapper.update(grabResultParamString);
	}
	
	public void updateSignSchemaString(SignSchemaString signSchemaString) {
		grabSignMapper.update(signSchemaString);
	}
	
	public void deleteGrabParam(Integer id) {
		grabMapper.del(id);
	}
	
	public void deleteGrabResultString(Integer grabId) {
		grabMappingMapper.del(grabId);
	}
	
	public void deleteSignSchemaString(Integer id) {
		grabSignMapper.del(id);
	}
	

	@Override
	public void pushGrab(GrabTriggerParam grabTriggerParam) throws Exception {
		ListOperations<String, String> listOper = redisTemplate.opsForList();
		Long size =listOper.size(RedisKeys.Grab.GRAB_QUEUE);
		if(size !=null && size > RedisKeys.Grab.GRAB_QUEUE_MAX_SIZE) {
			throw new Exception("添加失败，爬抓队列已经满！");
		}
		listOper.leftPush(RedisKeys.Grab.GRAB_QUEUE, JSON.toJSONString(grabTriggerParam));
	}

	@Override
	public GrabTriggerParam pollGrab() {
		ListOperations<String, String> listOper = redisTemplate.opsForList();
		String string = listOper.rightPop(RedisKeys.Grab.GRAB_QUEUE);
		if(StringUtil.isEmpty(string)) {
			return null;
		}
		try {
			return JSON.parseObject(string, GrabTriggerParam.class);
		}catch (Exception e) {
			LOGGER.error("爬抓队列数据解析失败，json:"+string,e);
		}
		return null;
	}

	@Override
	public void pushGrab(GrabTriggerParam grabTriggerParam, Integer priority) throws Exception {
		//暂不支持优先级，后续支持
		pushGrab(grabTriggerParam);
	}

	GrabSite grabSite = null;
	@Override
	public GrabSite getGrabSite(Integer siteId) {
		// TODO Auto-generated method stub
		if(grabSite == null) {
			GrabSite grabSite = new GrabSite();
			grabSite.setCharset("UTF-8");
			return grabSite;
		}
		return grabSite;
	}

	@Override
	public void resetGrabQueue() {
		redisTemplate.delete(RedisKeys.Grab.GRAB_QUEUE);
	}

	@Override
	public boolean isDuplicate(GrabTriggerParam grabTriggerParam) {
		return false;
	}

	@Override
	public int getGrabQueueSize() {
		ListOperations<String, String> listOper = redisTemplate.opsForList();
		Long size =listOper.size(RedisKeys.Grab.GRAB_QUEUE);
		if(size == null) {
			return 0;
		}
		return size.intValue();
	}

	@Override
	public int getAllGrabSize() {
		//暂不支持已爬抓计数，后续支持
		return 0;
	}

	@Override
	public void addLog(Integer grabId, HandleProcessEnum handleProcessEnum, ErrorTypeEnum errorTypeEnum,Integer dataStatusCode, String message, Throwable e) {
		try {
			if(grabId == null) {
				return ;
			}
			statistics(grabId, handleProcessEnum, errorTypeEnum, StatusEnum.ERROR);
			GrabErrorLog log = new GrabErrorLog();
			log.setGrabId(grabId);
			if(handleProcessEnum != null) {
				log.setProcessType(handleProcessEnum.getId());
			}
			if(errorTypeEnum != null) {
				log.setErrorType(errorTypeEnum.getId());
			}
			log.setDataCode(dataStatusCode);
			if(StringUtil.isEmpty(message)) {
				message = e.getMessage();
			}
			if(message!=null) {
				int len = Math.min(170, message.length());
				log.setMessage(message.substring(0, len));
			}
			grabErrorLogMapper.add(log);
		} catch (Exception exception) {
			LOGGER.error("调用错误日志记录失败！",e);
		}
	}

	@Override
	public void statistics(Integer grabId, HandleProcessEnum handleProcessEnum, ErrorTypeEnum errorTypeEnum,StatusEnum statusEnum) {
		try {
			if(grabId == null || statusEnum == null) {
				return;
			}
			Date date = new Date();
			String key = RedisKeys.Grab.getGrabStatisticsKey(grabId.toString());
			byte[] key_byte = redisTemplate.getKeySerializer().serialize(key);
			String date_key = RedisKeys.Grab.getGrabStatisticsKey(grabId.toString(),FORMAT_DATE.format(date));
			byte[] date_key_byte = redisTemplate.getKeySerializer().serialize(date_key);
			String hour_key = RedisKeys.Grab.getGrabStatisticsKey(grabId.toString(),FORMAT_HOUR.format(date));
			byte[] hour_key_byte = redisTemplate.getKeySerializer().serialize(hour_key);
			String field = RedisKeys.Grab.getGrabStatisticsField(statusEnum,handleProcessEnum, errorTypeEnum);
			byte[] field_byte = redisTemplate.getKeySerializer().serialize(field);

			Calendar c1 = new GregorianCalendar();
			c1.set(Calendar.HOUR_OF_DAY, 0);
			c1.set(Calendar.MINUTE, 0);
			c1.set(Calendar.SECOND, 0);
			long date_expire = c1.getTimeInMillis()/1000+DATE_EXPIRE_LENGHT;
			Calendar c2 = new GregorianCalendar();
			c2.set(Calendar.MINUTE, 0);
			c2.set(Calendar.SECOND, 0);
			long hour_expire = c2.getTimeInMillis()/1000+HOUR_EXPIRE_LENGHT;
			
			
			RedisCallback<List<Object>> pipelineCallback = new RedisCallback<List<Object>>() {  
	            @Override  
	            public List<Object> doInRedis(RedisConnection pl) throws DataAccessException {  
	                pl.openPipeline();  
	              //整个计数
					pl.hIncrBy(key_byte, field_byte, 1);
					//按天计数，有效期10天
					pl.hIncrBy(date_key_byte, field_byte, 1);
					pl.expireAt(key_byte, date_expire);
					//按小时，有效期2天
					pl.hIncrBy(hour_key_byte, field_byte, 1);
					pl.expireAt(key_byte, hour_expire);
	                return pl.closePipeline();  
	            }  
	              
	        };  
	        redisTemplate.execute(pipelineCallback);
		} catch (Exception e) {
			LOGGER.error("调用计数失败！",e);
		}
	}

	@Override
	public GrabToken getGrabToken(TokenSchema tokenSchema,Map<String, Object> values) throws GrabException {
		if(tokenSchema == null || tokenSchema.getTokenGrabId() == null) {
			return null;
		}
		Integer tokenGrabId = tokenSchema.getTokenGrabId();
		String tokenUserId = TokenUtil.getTokenUserId(values, tokenSchema.getUserTokenRule());
		if(StringUtil.isNotEmpty(tokenSchema.getUserTokenRule())) {
			//用户token
			if(StringUtil.isEmpty(tokenUserId)) {
				throw new GrabException(ErrorTypeEnum.CONFIG, null, "用户token所需唯一标识不存在，无法获取token", null, null);
			}
		}
		Object obj = redisTemplate.opsForValue().get(RedisKeys.Grab.getToken(tokenGrabId,tokenUserId));
		String tokenString = obj == null ? null :obj.toString();
		GrabToken token = null;
		if(StringUtil.isEmpty(tokenString)) {
			if(StringUtil.isNotEmpty(tokenSchema.getUserTokenRule())) {
				//用户token
				throw new GrabException(ErrorTypeEnum.REF_TOKEN, null, "用户token不存在", null, null);
			}
			GrabParam tokenGrabParam = getGrabParam(tokenGrabId);
			if(tokenGrabParam == null) {
				throw new GrabException(ErrorTypeEnum.CONFIG, null, "配置token grab不存在,grab id is "+tokenGrabId, null, null);
			}
			GrabResultParam tokengrabResultParam = getGrabResultParam(tokenGrabId);
			if(tokengrabResultParam == null) {
				throw new GrabException(ErrorTypeEnum.CONFIG, null, "配置token映射不存在,grab id is "+tokenGrabId, null, null);
			}
			token = TokenUtil.getToken(tokenGrabParam,tokengrabResultParam);
			if(token !=null) {
				//添加至缓步存
				addGrabToken(tokenGrabId,tokenUserId,token);
			}
		}else {
			token = new GrabToken();
			token.setToken(tokenString);
		}
		return token;
	}
	
	@Override
	public void addGrabToken(Integer tokenGrabId, String tokenUserId, GrabToken grabToken) {
		if(tokenGrabId == null  || grabToken == null || StringUtil.isEmpty(grabToken.getToken())) {
			return;
		}
		//有过期时间
		if(grabToken.getExpires()!=null) {
			long now = (System.currentTimeMillis()/1000);
			int express = (int) (grabToken.getExpires()-now);
			if(express > 0) {
				redisTemplate.opsForValue().set(RedisKeys.Grab.getToken(tokenGrabId,tokenUserId),grabToken.getToken(),express);
				return;
			}
		}
		redisTemplate.opsForValue().set(RedisKeys.Grab.getToken(tokenGrabId,tokenUserId),grabToken.getToken(),TOKEN_EXPRESS);
	}
	
	@Override
	public boolean refGrabToken(Integer tokenGrabId) {
		if(tokenGrabId == null) {
			return false;
		}
		Object obj = redisTemplate.opsForValue().get(RedisKeys.Grab.getRefTokenCount(tokenGrabId));
		String count = obj == null?null:obj.toString();
		try {
			if(!StringUtil.isEmpty(count)) {
				Integer c = Integer.valueOf(count);
				//最多重试10次，避免死循环
				if(c>10) {
					return false;
				}
			}
			
			String reftokenCount = RedisKeys.Grab.getRefTokenCount(tokenGrabId);
			byte[] reftokenCount_byte = redisTemplate.getKeySerializer().serialize(reftokenCount);
			
			RedisCallback<List<Object>> pipelineCallback = new RedisCallback<List<Object>>() {  
	            @Override  
	            public List<Object> doInRedis(RedisConnection pl) throws DataAccessException {  
	                pl.openPipeline();  
					pl.incr(reftokenCount_byte);
					pl.expireAt(reftokenCount_byte, 3600);
					pl.del(redisTemplate.getKeySerializer().serialize(RedisKeys.Grab.getToken(tokenGrabId)));
	                return pl.closePipeline();  
	            }  
	              
	        };  
	        redisTemplate.execute(pipelineCallback);
			return true;
		}catch (Exception e) {
			LOGGER.error("获取token刷新次数出错",e);
		}
		return false;
	}

}
