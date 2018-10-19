package com.grab.service.cp.helper;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.grab.common.util.ResultMappingUtil;
import com.grab.domain.content.Commodity;
import com.grab.domain.grab.GrabResultParam;
import com.grab.domain.grab.GrabToken;
import com.grab.domain.grab.MappingSchema;

@Service
public class CommonDataFetcher implements ICPInterface {

	private static final Logger logger = LoggerFactory.getLogger( CommonDataFetcher.class );

	@Override
	public Commodity mappingHandlerCommodity(GrabResultParam resultParam, Map<String, MappingSchema> map,Map<String, Object> result, Integer cpId) {
		return ResultMappingUtil.mappingToCommodity(resultParam,map, result,cpId);
	}

	@Override
	public GrabToken mappingHandlerToken(GrabResultParam grabResultParam, Map<String, Object> result) {
		return ResultMappingUtil.mappingToToken(grabResultParam, result);
	}
}
