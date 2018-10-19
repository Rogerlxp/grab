package com.grab.service.cp.helper;

import java.util.Map;

import com.grab.domain.content.Commodity;
import com.grab.domain.grab.GrabResultParam;
import com.grab.domain.grab.GrabToken;
import com.grab.domain.grab.MappingSchema;

/**
 * CP base 接口
 * @author Roger
 */

public interface ICPInterface {
	Commodity mappingHandlerCommodity(GrabResultParam resultParam, Map<String, MappingSchema> map,Map<String, Object> result, Integer cpId);

	GrabToken mappingHandlerToken(GrabResultParam grabResultParam, Map<String, Object> result);
}
