package com.roger.grab.base.service.cp.helper;

import java.util.Map;

import com.roger.grab.base.domain.content.Commodity;
import com.roger.grab.base.domain.grab.GrabResultParam;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.MappingSchema;


/**
 * CP base 接口
 * @author Roger
 */

public interface ICPInterface {
	Commodity mappingHandlerCommodity(GrabResultParam resultParam, Map<String, MappingSchema> map,Map<String, Object> result, Integer cpId);

	GrabToken mappingHandlerToken(GrabResultParam grabResultParam, Map<String, Object> result);
}
