package com.roger.grab.manage.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.roger.grab.base.common.util.ListUtils;
import com.roger.grab.base.domain.grab.GrabParamString;
import com.roger.grab.base.domain.grab.SignSchemaString;
import com.roger.grab.base.service.grab.IGrabService;
import com.roger.grab.manage.constant.ApiUrl;
import com.roger.grab.manage.model.BaseResultModel;


/**
 * 内容控制器
 * @author Roger
 */
@RestController
public class GrabSignController {
	private static final Logger LOGGER = LoggerFactory.getLogger( GrabSignController.class );

	@Autowired
	private IGrabService grabService;
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_SIGN_LIST )
	@ResponseBody
	public BaseResultModel list(SignSchemaString signSchemaString) {
		List<SignSchemaString> list = grabService.findSignSchemaString(signSchemaString);
		return new BaseResultModel(list);
	}

	@RequestMapping( value = ApiUrl.BIZ_GRAB_SIGN_DETAIL )
	@ResponseBody
	public BaseResultModel detail( Integer signId) {
		SignSchemaString signSchemaString = grabService.getSignSchemaString(signId);
		return new BaseResultModel(signSchemaString);
	}

	@RequestMapping( value = ApiUrl.BIZ_GRAB_SIGN_UPDATE )
	@ResponseBody
	public BaseResultModel update(@RequestBody SignSchemaString signSchemaString ) {
		if(signSchemaString.getId()==null) {
			return add(signSchemaString);
		}
		grabService.updateSignSchemaString(signSchemaString);
		//找出签名相关grab
		List<Integer> updateSignGrabIds = new ArrayList<>();
		GrabParamString g = new GrabParamString();
		g.setSignId(signSchemaString.getId());
		List<GrabParamString> list = grabService.findGrabParam(g);
		if(ListUtils.isNotEmpty(list)) {
			for (GrabParamString temp : list) {
				updateSignGrabIds.add(temp.getId());
			}
		}
		//相关签名的grab也更新缓存
		if(ListUtils.isNotEmpty(updateSignGrabIds)) {
			for (Integer integer : updateSignGrabIds) {
				grabService.refCache(integer);
			}
		}
		BaseResultModel result = new BaseResultModel();
		result.setValue( true );
		return result;
	}
	

	@RequestMapping( value = ApiUrl.BIZ_GRAB_SIGN_DEL )
	@ResponseBody
	public BaseResultModel del( Integer signId ) {
		grabService.deleteSignSchemaString(signId);
		BaseResultModel result = new BaseResultModel();
		result.setValue( true );
		return result;
	}
	
	
	@RequestMapping( value = ApiUrl.BIZ_GRAB_SIGN_ADD )
	@ResponseBody
	public BaseResultModel add(@RequestBody SignSchemaString signSchemaString ) {
		BaseResultModel result = new BaseResultModel();
		if(signSchemaString.getId()!=null) {
			return update(signSchemaString);
		}
		grabService.addGrabSign(signSchemaString);
		result.setValue( signSchemaString.getId() );
		return result;
	}
}
