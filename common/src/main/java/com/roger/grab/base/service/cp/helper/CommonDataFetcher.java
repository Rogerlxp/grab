package com.roger.grab.base.service.cp.helper;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.roger.grab.base.common.util.ResultMappingUtil;
import com.roger.grab.base.domain.content.Commodity;
import com.roger.grab.base.domain.grab.GrabResultParam;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.MappingSchema;


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
