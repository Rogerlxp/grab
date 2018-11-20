package com.roger.grab.manage.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.roger.grab.base.common.util.StringUtil;
import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabParamString;
import com.roger.grab.base.domain.grab.GrabSite;
import com.roger.grab.base.domain.grab.SignSchemaString;
import com.roger.grab.base.service.grab.IGrabService;
import com.roger.grab.manage.constant.ApiUrl;
import com.roger.grab.manage.model.BaseResultModel;
import com.roger.grab.manage.service.GrabTrialService;

/**
 * 内容控制器
 * @author Roger
 */
@RestController
public class GrabController {
	private static final Logger LOGGER = LoggerFactory.getLogger( GrabController.class );

	@Autowired
	private IGrabService grabService;
	@Autowired
	private GrabTrialService grabTrialService;
    @Autowired
    private RedisTemplate redisTemplate;
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_LIST )
	@ResponseBody
	public BaseResultModel list(GrabParamString grabParamString) {
		List<GrabParamString> list = grabService.findGrabParam(grabParamString);
		return new BaseResultModel(list);
	}

	@RequestMapping( value = ApiUrl.BIZ_GRAB_DETAIL )
	@ResponseBody
	public BaseResultModel detail( Integer grabId) {
		GrabParamString grabParamString = grabService.getGrabParamString(grabId);
		return new BaseResultModel(grabParamString);
	}

	@RequestMapping( value = ApiUrl.BIZ_GRAB_UPDATE )
	@ResponseBody
	public BaseResultModel update( @RequestBody GrabParamString grabParamString ) {
		if(grabParamString.getId() ==null) {
			return add(grabParamString);
		}
		BaseResultModel result = new BaseResultModel();
		try {
			grabTrialService.createExtract(grabParamString);
		}catch (GrabException e) {
			result.setCode(e.getErrorTypeEnum().getId());
			result.setMessage(e.getMessage());
		}
		grabService.updateGrabParam(grabParamString);
		grabService.refCache(grabParamString.getId());
		result.setValue( true );
		return result;
	}
	

	@RequestMapping( value = ApiUrl.BIZ_GRAB_DEL )
	@ResponseBody
	public BaseResultModel del( Integer grabId ) {
		grabService.deleteGrabParam(grabId);
		BaseResultModel result = new BaseResultModel();
		result.setValue( true );
		return result;
	}
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_ADD )
	@ResponseBody
	public BaseResultModel add(@RequestBody GrabParamString grabParamString) {
		BaseResultModel result = new BaseResultModel();
		if(grabParamString.getId()!=null) {
			return update(grabParamString);
		}
		try {
			grabTrialService.createExtract(grabParamString);
		}catch (GrabException e) {
			result.setCode(e.getErrorTypeEnum().getId());
			result.setMessage(e.getMessage());
		}
		grabService.addGrabParam(grabParamString);
		result.setValue( grabParamString.getId() );
		return result;
	}
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_TEST )
	@ResponseBody
	public BaseResultModel test(@RequestBody Map<String, Object> params) {
		BaseResultModel result = new BaseResultModel();
		try {
			Object object = params.get("signSchemaString");
			SignSchemaString signSchemaString = object == null?null:JSON.parseObject(object.toString(),SignSchemaString.class);
			object = params.get("grabParamString");
			GrabParamString grabParamString =object == null?null:JSON.parseObject(object.toString(),GrabParamString.class);
			object = params.get("grabSite");
			GrabSite grabSite =object == null?null:JSON.parseObject(object.toString(),GrabSite.class);
			String string = grabTrialService.getEntityOriginal(signSchemaString, grabParamString, grabSite);
			result.setValue(string);
		}catch (GrabException e) {
			result.setCode(0);
			result.setMessage(e.getMessage());
		}
		return result;
	}
	
	@RequestMapping( value = ApiUrl.BIZ_REDIS_DEL )
	@ResponseBody
	public BaseResultModel redisDel(String key) {
		BaseResultModel result = new BaseResultModel();
		try {
			if(StringUtil.isNotEmpty(key)) {
				String[] keys = key.split(",");
				List<String> keyArray = new ArrayList<>();
				for (String string : keys) {
					keyArray.add(string);
					redisTemplate.delete(string);
				}
			}
			result.setValue(true);
		}catch (Exception e) {
			result.setCode(0);
			result.setMessage(e.getMessage());
		}
		return result;
	}
	
}
