package com.roger.grab.manage.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.roger.grab.base.common.framework.SpringContextUtil;
import com.roger.grab.base.common.util.StringUtil;
import com.roger.grab.base.domain.content.CP;
import com.roger.grab.base.service.cp.ICpService;
import com.roger.grab.base.service.cp.helper.ICPInterface;
import com.roger.grab.manage.constant.ApiUrl;
import com.roger.grab.manage.model.BaseResultModel;


/**
 * 内容控制器
 * @author Roger
 */
@RestController
public class CpController {
	private static final Logger LOGGER = LoggerFactory.getLogger( CpController.class );

	@Autowired
	private ICpService cpService;

	@Autowired
	private SpringContextUtil springContextUtil;

	@RequestMapping( value = ApiUrl.BIZ_CP_LIST )
	@ResponseBody
	public BaseResultModel list(CP cp ) {
		List<CP> list = cpService.find(cp);
		return new BaseResultModel(list);
	}

	@RequestMapping( value = ApiUrl.BIZ_CP_DETAIL )
	@ResponseBody
	public BaseResultModel detail( Integer cpId) {
		CP cp = cpService.get(cpId);
		return new BaseResultModel(cp);
	}

	@RequestMapping( value = ApiUrl.BIZ_CP_UPDATE )
	@ResponseBody
	public BaseResultModel update(@RequestBody CP cp ) {
		BaseResultModel result = new BaseResultModel();
		try {
			checkCp(cp);
			cpService.update(cp);
			result.setValue( true );
		}catch (Exception e) {
			result.setValue(false);
			result.setCode(0);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@RequestMapping( value = ApiUrl.BIZ_CP_ADD )
	@ResponseBody
	public BaseResultModel add(@RequestBody CP cp ) {
		BaseResultModel result = new BaseResultModel();
		try {
			checkCp(cp);
			cpService.add(cp);
			result.setValue( true );
		}catch (Exception e) {
			result.setValue(false);
			result.setCode(0);
			result.setMessage(e.getMessage());
		}
		return result;
	}


	@RequestMapping( value = ApiUrl.BIZ_CP_DEL )
	@ResponseBody
	public BaseResultModel del( Integer cpId ) {
		cpService.del(cpId);
		BaseResultModel result = new BaseResultModel();
		result.setValue( true );
		return result;
	}

	private void checkCp(CP cp) throws Exception {
		Class c1 = null;
		try {
			//无Cp处理类时，使用通用处理
			if(StringUtil.isEmpty(cp.getClass_path())) {
				return;
			}
			c1 = Class.forName(cp.getClass_path());
		} catch (Exception e) {
			throw new Exception(String.format("初使化CP：【%s】失败，未找到相应类：【%s】,CP:[%s]", cp.getCpId(), cp.getClass_path(), cp), e);
		}
		if (!ICPInterface.class.isAssignableFrom(c1)) {
			throw new Exception(String.format("cpId:[%s]，配置错误，未实现ICPInterface 接口,path:[%S]", cp.getCpId(), cp.getClass_path()));
		}
		Map<String, ICPInterface> cp_services = (Map<String, ICPInterface>) springContextUtil.getType(c1);
		if (cp_services == null || cp_services.isEmpty()) {
			throw new Exception(String.format("cpId:[%s]，配置错误，未找到相关实现类 ,path:[%S]", cp.getCpId(), cp.getClass_path()));
		}
	}

}
