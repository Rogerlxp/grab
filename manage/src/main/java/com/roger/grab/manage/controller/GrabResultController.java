package com.roger.grab.manage.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.roger.grab.base.common.util.ListUtils;
import com.roger.grab.base.common.util.StringUtil;
import com.roger.grab.base.common.util.TokenUtil;
import com.roger.grab.base.domain.content.Commodity;
import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabErrorCode;
import com.roger.grab.base.domain.grab.GrabModelField;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabParamString;
import com.roger.grab.base.domain.grab.GrabResult;
import com.roger.grab.base.domain.grab.GrabResultParam;
import com.roger.grab.base.domain.grab.GrabResultParamString;
import com.roger.grab.base.domain.grab.GrabSite;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.SignSchemaString;
import com.roger.grab.base.enums.grab.ErrorTypeEnum;
import com.roger.grab.base.service.cp.helper.CPHelper;
import com.roger.grab.base.service.cp.helper.ICPInterface;
import com.roger.grab.base.service.grab.IGrabService;
import com.roger.grab.manage.constant.ApiUrl;
import com.roger.grab.manage.model.BaseResultModel;
import com.roger.grab.manage.service.GrabTrialService;

/**
 * 内容控制器
 * @author Roger
 */
@RestController
public class GrabResultController {
	private static final Logger LOGGER = LoggerFactory.getLogger( GrabResultController.class );

	@Autowired
	private IGrabService grabService;
	@Autowired
	private GrabTrialService grabTrialService;
    @Autowired
    private CPHelper cpHelper;
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_LIST )
	@ResponseBody
	public BaseResultModel list(GrabResultParamString grabResultParamString) {
		List<GrabResultParamString> list = grabService.findGrabResultString(grabResultParamString);
		return new BaseResultModel(list);
	}

	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_DETAIL )
	@ResponseBody
	public BaseResultModel detail( Integer grabId) {
		GrabResultParamString grabResultParamString = grabService.getGrabResultParamString(grabId);
		return new BaseResultModel(grabResultParamString);
	}

	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_UPDATE )
	@ResponseBody
	public BaseResultModel update(@RequestBody GrabResultParamString grabResultParamString ) {
		if(grabResultParamString.getGrabId() == null) {
			BaseResultModel result = new BaseResultModel();
			result.setMessage("grabId is null");
			result.setCode(0);
			return result;
		}
		if(grabResultParamString.getId() == null ){
			GrabResultParamString old = grabService.getGrabResultParamString(grabResultParamString.getGrabId());
			if( null != old && old.getId() > 0 ){
				// 已存在结果转换配置
				grabResultParamString.setId(old.getId());
			}
		}
		if(grabResultParamString.getId() == null) {
			return add(grabResultParamString);
		}
		grabService.updateGrabResultString(grabResultParamString);
		grabService.refCache(grabResultParamString.getGrabId());
		BaseResultModel result = new BaseResultModel();
		result.setValue( true );
		return result;
	}
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_DEL )
	@ResponseBody
	public BaseResultModel del( Integer grabId ) {
		grabService.deleteGrabResultString(grabId);
		BaseResultModel result = new BaseResultModel();
		result.setValue( true );
		return result;
	}
	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_ADD )
	@ResponseBody
	public BaseResultModel add(@RequestBody GrabResultParamString grabResultParamString) {
		BaseResultModel result = new BaseResultModel();
		if(grabResultParamString.getGrabId() == null) {
			result.setMessage("grabId is null");
			result.setCode(0);
			return result;
		}
		if(grabResultParamString != null) {
			if(grabResultParamString.getId() == null) {
				grabService.addGrabResultString(grabResultParamString);
			}else {
				return update(grabResultParamString);
			}
		}
		result.setValue( grabResultParamString.getGrabId() );
		return result;
	}
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_ADD_ALL )
	@ResponseBody
	@Transactional
	public BaseResultModel add(@RequestBody Map<String, Object> params) throws GrabException {
		Object object = params.get("signSchemaString");
		SignSchemaString signSchemaString = object == null?null:JSON.parseObject(object.toString(),SignSchemaString.class);
		object = params.get("grabParamString");
		GrabParamString grabParamString =object == null?null:JSON.parseObject(object.toString(),GrabParamString.class);
		object = params.get("grabSite");
		GrabSite grabSite =object == null?null:JSON.parseObject(object.toString(),GrabSite.class);
		object = params.get("grabResultParamString");
		GrabResultParamString grabResultParamString = object == null?null:JSON.parseObject(object.toString(),GrabResultParamString.class);
		
		Integer signId = null;
		List<Integer>updateSignGrabIds = new ArrayList<>();
		if(signSchemaString!=null) {
			if(signSchemaString.getId() == null) {
				signId = grabService.addGrabSign(signSchemaString);
			}else {
				signId = signSchemaString.getId();
				grabService.updateSignSchemaString(signSchemaString);
				//找出签名相关grab
				GrabParamString g = new GrabParamString();
				g.setSignId(signId);
				List<GrabParamString> list = grabService.findGrabParam(grabParamString);
				if(ListUtils.isNotEmpty(list)) {
					for (GrabParamString temp : list) {
						updateSignGrabIds.add(temp.getId());
					}
				}
			}
		}
		
		Integer grabId = null;
		if(grabParamString !=null) {
			grabTrialService.createExtract(grabParamString);
			if(grabParamString.getSignId() == null) {
				grabParamString.setSignId(signId);
			}
			if(grabParamString.getId()==null) {
				grabId = grabService.addGrabParam(grabParamString);
			}else {
				grabService.updateGrabParam(grabParamString);
				grabId = grabParamString.getId();
			}
		}
		
		if(grabResultParamString != null) {
			if(grabResultParamString.getGrabId() == null) {
				grabResultParamString.setGrabId(grabId);
			}
			if(grabResultParamString.getId() == null) {
				grabService.addGrabResultString(grabResultParamString);
			}else {
				grabService.updateGrabResultString(grabResultParamString);
			}
		}
		
		grabService.refCache(grabId);
		
		//相关签名的grab也更新缓存
		if(ListUtils.isNotEmpty(updateSignGrabIds)) {
			for (Integer integer : updateSignGrabIds) {
				grabService.refCache(integer);
			}
		}
		BaseResultModel result = new BaseResultModel();
		result.setValue( grabId );
		return result;
	}
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_MODEL )
	@ResponseBody
	public BaseResultModel getAllModel() {
		BaseResultModel result = new BaseResultModel();
		result.setValue( grabService.getModels());
		return result;
	}
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_MODEL_GET )
	@ResponseBody
	public BaseResultModel getModel(Integer modelId) {
		List<GrabModelField> fields = grabService.getModelFields(modelId);
		BaseResultModel result = new BaseResultModel();
		result.setValue( fields );
		return result;
	}
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_ERROR_GET )
	@ResponseBody
	public BaseResultModel getErrorCodes() {
		List<GrabErrorCode> list = grabService.getErrorCode();
		BaseResultModel result = new BaseResultModel();
		result.setValue( list );
		return result;
	}
	
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_RESULT_TEST )
	@ResponseBody
	public BaseResultModel test(@RequestBody Map<String, Object> params) {
		BaseResultModel result = new BaseResultModel();
		
		Object object = params.get("signSchemaString");
		SignSchemaString signSchemaString = object == null?null:JSON.parseObject(object.toString(),SignSchemaString.class);
		object = params.get("grabParamString");
		GrabParamString grabParamString =object == null?null:JSON.parseObject(object.toString(),GrabParamString.class);
		object = params.get("grabSite");
		GrabSite grabSite =object == null?null:JSON.parseObject(object.toString(),GrabSite.class);
		object = params.get("grabResultParamString");
		GrabResultParamString grabResultParamString = object == null?null:JSON.parseObject(object.toString(),GrabResultParamString.class);
		
		if(grabResultParamString == null) {
			result.setCode(0);
			result.setMessage("grabResultParam 参数为null");
			return result;
		}
		GrabResultParam grabResultParam = new GrabResultParam();
		grabResultParam.setEntityType(grabResultParamString.getEntityTypeEnum());
		grabResultParam.setGrabId(grabResultParamString.getGrabId());
		grabResultParam.setMappingSchemas(grabResultParamString.getMappingSchemas());
		grabResultParam.setFixedValueParam(grabResultParamString.getFixedValueParam());
		grabResultParam.setMappingValueParams(grabResultParamString.getMappingValueParams());
		try {
			GrabResult grabResult = grabTrialService.getEntity(signSchemaString, grabParamString, grabSite);
			if(grabResult ==null || (grabResult.getResult() == null && ListUtils.isEmpty(grabResult.getArrayResult()))) {
				throw new GrabException(ErrorTypeEnum.CONFIG,null, "无数据返回", null, null);
			}
			ICPInterface cpInterface = cpHelper.getCPInterface(grabParamString.getCpId());
			if(cpInterface == null) {
				throw new GrabException(ErrorTypeEnum.CONFIG,null, "未配置相应CP", null, null);
			}
			if(grabResultParam.getEntityType() == null) {
				throw new GrabException(ErrorTypeEnum.CONFIG,null, "未配置相应返回映射类型", null, null);
			}
			switch (grabResultParam.getEntityType()) {
			case TOKEN:
				if(grabResult.getResult()!=null) {
					GrabParam grabParam = new GrabParam(grabParamString);
					GrabToken token = cpInterface.mappingHandlerToken(grabResultParam,grabResult.getResult());
					String tokenUserId = TokenUtil.getTokenUserId(params, grabParam.getTokenSchema().getUserTokenRule());
					if(StringUtil.isEmpty(tokenUserId)) {
						//未取到用户唯一标识
						result.setMessage("用户token获取失败，未取用户唯一标识");
						return result;
					}
					if(token != null && grabParam.getId()!=null) {
						grabService.addGrabToken(grabParam.getId(),tokenUserId,token);
					}
					result.setValue(token);
					return result;
				}
				break;
			case COMMODITY:
				List<Commodity> list = new ArrayList<Commodity>();
				if(grabResult.getResult()!=null) {
					Commodity commodity= cpInterface.mappingHandlerCommodity(grabResultParam,grabResultParam.getMappingSchemaMap(), grabResult.getResult(),grabResult.getCpId());
					list.add(commodity);
				}
				if(ListUtils.isNotEmpty(grabResult.getArrayResult())) {
					for (GrabResult temp: grabResult.getArrayResult()) {
						Commodity content= cpInterface.mappingHandlerCommodity(grabResultParam,grabResultParam.getMappingSchemaMap(), temp.getResult(),grabResult.getCpId());
						list.add(content);
					}
				}
				result.setValue(list);
				return result;
			case MAP:
				List<Map<String, Object>> mapList = new ArrayList<Map<String, Object>>();
				if(grabResult.getResult()!=null) {
					mapList.add(grabResult.getResult());
				}
				if(ListUtils.isNotEmpty(grabResult.getArrayResult())) {
					for (GrabResult temp: grabResult.getArrayResult()) {
						mapList.add(temp.getResult());
					}
				}
				result.setValue(mapList);
				return result;
			default:
				throw new GrabException(ErrorTypeEnum.CONFIG,null, "配置返回映射类型不支持", null, null);
			}

		}catch (GrabException e) {
			result.setCode(0);
			result.setMessage(e.getMessage());
		}
		return result;
	}
}
