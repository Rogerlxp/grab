package com.roger.grab.base.service.grab;

import java.util.List;
import java.util.Map;

import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabErrorCode;
import com.roger.grab.base.domain.grab.GrabModel;
import com.roger.grab.base.domain.grab.GrabModelField;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabParamString;
import com.roger.grab.base.domain.grab.GrabResultParam;
import com.roger.grab.base.domain.grab.GrabResultParamString;
import com.roger.grab.base.domain.grab.GrabSite;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.GrabTriggerParam;
import com.roger.grab.base.domain.grab.SignSchemaString;
import com.roger.grab.base.domain.grab.TokenSchema;
import com.roger.grab.base.enums.grab.ErrorTypeEnum;
import com.roger.grab.base.enums.grab.HandleProcessEnum;
import com.roger.grab.base.enums.grab.StatusEnum;



/**
 * 
 * @author Roger
 *
 */
public interface IGrabService {
	/**
	 * 获取全部异常配置
	 * @return
	 */
	List<GrabErrorCode> getErrorCode();
	/**
	 * 爬抓配置ID
	 * @param grabId
	 * @return
	 */
	GrabParam getGrabParam(Integer grabId);
	/**
	 * 
	 * @param grabIds
	 * @return
	 */
	List<GrabParam> getGrabParam(List<Integer> grabIds);
	/**
	 * 新建爬抓
	 * @param grabParamString
	 * @return
	 */
	int addGrabParam(GrabParamString grabParamString);
	/**
	 * 新建签名
	 * @param grabParamString
	 * @return
	 */
	int addGrabSign(SignSchemaString signSchemaString);
	
	/**
	 * 新增字段映射
	 * @param schemaString
	 * @return
	 */
	boolean addGrabResultString(GrabResultParamString schemaString);
	/**
	 * 爬抓site配置
	 * @param siteId
	 * @return
	 */
	GrabSite getGrabSite(Integer siteId);
	/**
	 * 结果映射配置
	 * @param grabId
	 * @return
	 * @throws GrabException 
	 */
	GrabResultParam getGrabResultParam(Integer grabId) throws GrabException;
	/**
	 * 管理查询列表
	 * @param grabParamString
	 * @return
	 */
	List<GrabParamString> findGrabParam(GrabParamString grabParamString);
	/**
	 * 管理查询列表
	 * @param grabResultParamString
	 * @return
	 */
	List<GrabResultParamString> findGrabResultString(GrabResultParamString grabResultParamString);
	/**
	 * 管理查询列表
	 * @param signSchemaString
	 * @return
	 */
	List<SignSchemaString> findSignSchemaString(SignSchemaString signSchemaString);
	/**
	 * 后台修改配置
	 * @param grabParamString
	 */
	void updateGrabParam(GrabParamString grabParamString);
	/**
	 * 后台修改配置
	 * @param grabResultParamString
	 */
	void updateGrabResultString(GrabResultParamString grabResultParamString);
	/**
	 * 后台修改配置
	 * @param signSchemaString
	 */
	void updateSignSchemaString(SignSchemaString signSchemaString);
	/**
	 * 后台删除配置
	 * @param id
	 */
	void deleteGrabParam(Integer id);
	/**
	 * 后台删除配置
	 * @param grabId
	 */
	void deleteGrabResultString(Integer grabId);
	/**
	 * 后台删除配置
	 * @param id
	 */
	void deleteSignSchemaString(Integer id);
	
	/**
	 * 添加爬抓
	 * @param grabTriggerParam
	 * @throws Exception 
	 */
	void pushGrab(GrabTriggerParam grabTriggerParam) throws Exception;
	/**
	 * 添加有优先级的爬抓
	 * @param grabTriggerParam
	 * @param priority
	 * @throws Exception 
	 */
	void pushGrab(GrabTriggerParam grabTriggerParam,Integer priority) throws Exception;
	/**
	 * 爬抓队列中获取任务
	 * @return
	 */
	GrabTriggerParam pollGrab();
	/**
	 * 清空爬抓队列
	 */
	void resetGrabQueue();
	/**
	 * 判断爬抓是否属于重复
	 * @param grabTriggerParam
	 * @return
	 */
	boolean isDuplicate(GrabTriggerParam grabTriggerParam);
	/**
	 * 获取待爬抓任务数
	 * @return
	 */
	int getGrabQueueSize();
	/**
	 * 获取已处理任务数
	 * @return
	 */
	int getAllGrabSize();
	/**
	 * 记录异常日志
	 * @param e
	 */
	void addLog(Integer grabId,HandleProcessEnum handleProcessEnum,ErrorTypeEnum errorTypeEnum,Integer dataStatusCode,String message,Throwable e);
	/**
	 * 计数
	 * @param grabId
	 * @param handleProcessEnum
	 * @param errorTypeEnum
	 * @param statusEnum
	 */
	void statistics(Integer grabId,HandleProcessEnum handleProcessEnum,ErrorTypeEnum errorTypeEnum,StatusEnum statusEnum);
	/**
	 * 本地获取token
	 * @param tokenGrabId
	 * @return
	 * @throws GrabException 
	 */
	GrabToken getGrabToken(TokenSchema tokenSchema,Map<String, Object> values) throws GrabException;
	/**
	 * token写入本地
	 * @param tokenGrabId
	 * @param grabToken
	 */
	void addGrabToken(Integer tokenGrabId, String tokenUserId, GrabToken token);
	/**
	 * 重新生成本地token
	 * @param tokenGrabId
	 * @return 
	 */
	boolean refGrabToken(Integer tokenGrabId);
	/**
	 * 获取单个grabParamString
	 * @param grabId
	 * @return
	 */
	GrabParamString getGrabParamString(Integer grabId);
	/**
	 * 获取单个SignSchemaString
	 * @param signId
	 * @return
	 */
	SignSchemaString getSignSchemaString(Integer signId);
	/**
	 * 获取单个GrabResultParamString
	 * @param grabId
	 * @return
	 */
	GrabResultParamString getGrabResultParamString(Integer grabId);
	/**
	 * 获取模型字段
	 * @param modelId
	 * @return
	 */
	List<GrabModelField> getModelFields(Integer modelId);
	/**
	 * 获取模型
	 * @return
	 */
	List<GrabModel> getModels();
	/**
	 * 更新缓存
	 * @param grabId
	 * @return
	 */
	boolean refCache(Integer grabId);
}
