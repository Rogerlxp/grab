package com.roger.grab.task.pipeline;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.roger.grab.base.common.framework.ILog;
import com.roger.grab.base.common.framework.LogFactory;
import com.roger.grab.base.domain.content.Commodity;
import com.roger.grab.base.domain.grab.GrabResult;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.MappingSchema;
import com.roger.grab.base.enums.grab.FieldConstant;
import com.roger.grab.base.service.cp.helper.CPHelper;
import com.roger.grab.base.service.cp.helper.ICPInterface;
import com.roger.grab.base.service.grab.IGrabService;

import us.codecraft.webmagic.ResultItems;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.pipeline.Pipeline;


/**
 * @author Roger@meizu.com
 */
@Service("grabPipeline")
public class GrabPipeline implements Pipeline {
	
    private static final ILog    LOGGER    = LogFactory.getLog(GrabPipeline.class);

    @Autowired
    private IGrabService grabService;
    @Autowired
    private CPHelper cpHelper;
    
    @Override
    public void process(ResultItems resultItems, Task task) {
    	GrabResult result = resultItems.get(FieldConstant.RESULT);
    	if(result ==null || (result.getResult() == null && CollectionUtils.isEmpty(result.getArrayResult()))) {
    		return ;
    	}
    	if(result.getGrabResultParam() == null || result.getGrabResultParam().getEntityType() == null) {
    		return;
    	}
    	ICPInterface cpInterface = cpHelper.getCPInterface(result.getCpId());
		if(cpInterface == null) {
			//抛出异常
		}
    	switch (result.getGrabResultParam().getEntityType()) {
		case TOKEN:
			GrabToken token = cpInterface.mappingHandlerToken(result.getGrabResultParam(), result.getResult());
			if(token!=null) {
				//不支持用户token 仅支持通用CP token
				grabService.addGrabToken(result.getGrabResultParam().getGrabId(), null,token);
			}
			break;
		case COMMODITY:
			if(CollectionUtils.isEmpty(result.getGrabResultParam().getMappingSchemas())) {
				return;
			}
			List<Commodity> commodities = new ArrayList<>();
			Map<String, MappingSchema> auth_map = new HashMap<>();
			result.getGrabResultParam().getMappingSchemas().stream().forEach(schema -> auth_map.put(schema.getKeyName(), schema));
			Commodity commodity = cpInterface.mappingHandlerCommodity(result.getGrabResultParam(),auth_map, result.getResult(),result.getCpId());
			if(commodity!=null) {
				commodities.add(commodity);
			}
			if(!CollectionUtils.isEmpty(result.getArrayResult())) {
				for ( GrabResult r : result.getArrayResult()) {
					commodity = cpInterface.mappingHandlerCommodity(result.getGrabResultParam(),auth_map, r.getResult(),result.getCpId());
					if(commodity!=null) {
						commodities.add(commodity);
					}
				}
			}
			if(!CollectionUtils.isEmpty(commodities)) {
				for (Commodity r : commodities) {
					
				}
			}
			break;
		default:
			break;
		}
    }
}
