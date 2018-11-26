package com.grab;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.CollectionUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.alibaba.fastjson.JSON;
import com.roger.grab.base.common.httpClient.GrabHttpClient;
import com.roger.grab.base.common.util.GrabRuleUtil;
import com.roger.grab.base.common.util.ResultMappingUtil;
import com.roger.grab.base.common.util.StringUtil;
import com.roger.grab.base.domain.exception.GrabException;
import com.roger.grab.base.domain.grab.GrabExtractElement;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabParam.Param;
import com.roger.grab.base.domain.grab.GrabParamString;
import com.roger.grab.base.domain.grab.GrabParamString.OriginalParam;
import com.roger.grab.base.domain.grab.GrabResult;
import com.roger.grab.base.domain.grab.GrabResultDataStatus;
import com.roger.grab.base.domain.grab.GrabResultParamString;
import com.roger.grab.base.domain.grab.GrabSite;
import com.roger.grab.base.domain.grab.GrabToken;
import com.roger.grab.base.domain.grab.GrabTriggerParam;
import com.roger.grab.base.domain.grab.MappingSchema;
import com.roger.grab.base.domain.grab.NextUrlParamSchema;
import com.roger.grab.base.domain.grab.NextUrlSchema;
import com.roger.grab.base.domain.grab.ParamSchema;
import com.roger.grab.base.domain.grab.Schema;
import com.roger.grab.base.domain.grab.SchemaTree;
import com.roger.grab.base.domain.grab.UrlHead;
import com.roger.grab.base.domain.redis.RedisKeys;
import com.roger.grab.base.enums.grab.EntityTypeEnum;
import com.roger.grab.base.enums.grab.MethodTypeEnum;
import com.roger.grab.base.enums.grab.ObjectTypeEnum;
import com.roger.grab.base.enums.grab.TextTypeEnum;
import com.roger.grab.base.service.grab.IGrabService;
import com.roger.grab.task.consumer.Grab;
import com.roger.grab.task.producer.GrabGeneratorHandler;

/**
 * 
 * @author Roger
 *
 */
public class MeizuHome extends GrabTester {
	
	@Autowired
	private IGrabService grabService;
	@Autowired
	private Grab grab;
	@Autowired
	private GrabGeneratorHandler grabGeneratorHandler;
	
	@Autowired
	private RedisTemplate redisTemplate;
	
	@Test
	public void cleanCache() throws GrabException {
		Integer grabId = 173;
		grabService.refCache(grabId);
	}
	
	@Test
	public void cleanCaches() throws GrabException {
		Integer[] grabIds = {173};
		for (Integer grabId : grabIds) {
			grabService.refCache(grabId);
		}
	}
	
	
	@Test
	public void addUser() throws Exception {
		GrabParam grabParam = new GrabParam();
		OriginalParam originalExtract = new OriginalParam();
		grabParam.setGrabExtractElement(grabExtractElementL(originalExtract));
		grabParam.setMethodType(MethodTypeEnum.GET);
		grabParam.setParamSchema(commonParamSchema());
		grabParam.getParamSchema().getParamMap().put("uid", 1);

		grabParam.setCpId(1);
		grabParam.setUrl("http://home.meizu.cn/home.php?mod=space&uid=1");
		GrabParamString grabParamString = new GrabParamString(grabParam);
		grabParamString.setName("联系人");
		grabParamString.setOriginalParam(originalExtract);
		
//		Assert.assertEquals( true,grabService.addGrabParam(grabParamString)>0);
		grabParamString.setId(173);
		grabService.updateGrabParam(grabParamString);
		grabService.refCache(173);
	}
	
	private GrabExtractElement grabExtractElementL(OriginalParam originalExtract) throws Exception {
		GrabExtractElement grabExtractElement = new GrabExtractElement();
		grabExtractElement.setType(TextTypeEnum.HTML);
		grabExtractElement.setResultSchemaTree(schemaTree_Cateogry(originalExtract));
		
		GrabResultDataStatus grabResultDataStatus = new GrabResultDataStatus();
		Schema codeSchema = new Schema();
		codeSchema.setName("code");
		codeSchema.setObjectType(ObjectTypeEnum.OBJECT);
		codeSchema.setExpression("//div[@class='pbm mbm bbda cl']/ul/li[3]/text()");
		grabResultDataStatus.setCodeSchema(codeSchema);
//		grabResultDataStatus.setErrorCodeMap(errorCodeMap);
		Set<String>success = new HashSet<>();
		success.add("gender_");
		grabResultDataStatus.setSuccess(success);
		grabExtractElement.setGrabResultDataStatus(grabResultDataStatus);

		List<NextUrlSchema> nextUrls = new ArrayList<>();
		NextUrlSchema schema = new NextUrlSchema();
		nextUrls.add(schema);
		schema.setGrabId(173);
		List<NextUrlParamSchema> paramSchemas = new ArrayList<>();
		NextUrlParamSchema urlParamSchema = new NextUrlParamSchema();
		paramSchemas.add(urlParamSchema);
		urlParamSchema.setName("uid");
		urlParamSchema.setElRule("return  Integer.valueOf(uid.toString())+1;");
		schema.setParamSchemas(paramSchemas);
		grabExtractElement.setNextUrls(nextUrls);
		
		return grabExtractElement;
	}

	private SchemaTree schemaTree_Cateogry(OriginalParam originalExtract) throws Exception {
		List<Param> resultGrabParam = new ArrayList<Param>();
		Param name = new Param();
		name.setName("name");
		name.setRule("//div[@class='pbm mbm bbda cl']/ul/li[1]/text()");
		resultGrabParam.add(name);
		
		Param phone = new Param();
		phone.setName("phone");
		phone.setRule("//div[@class='pbm mbm bbda cl']/ul/li[2]/text()");
		resultGrabParam.add(phone);
		
		Param job = new Param();
		job.setName("job");
		job.setRule("//div[@class='pbm mbm bbda cl']/ul/li[5]/text()");
		resultGrabParam.add(job);
		
		Param num = new Param();
		num.setName("num");
		num.setRule("//div[@class='pbm mbm bbda cl']/ul/li[6]/text()");
		resultGrabParam.add(num);
		
		Param department = new Param();
		department.setName("department");
		department.setRule("//div[@class='pbm mbm bbda cl']/ul/li[7]/text()");
		resultGrabParam.add(department);
		
		originalExtract.setParams(resultGrabParam);
		originalExtract.setBaseRule("/");
		SchemaTree resultValueParam = GrabRuleUtil.createHtmlSchemaTree(originalExtract.getParams(),originalExtract.getBaseRule());
		return resultValueParam;
	}

	private ParamSchema commonParamSchema() {
		ParamSchema  paramSchema = new ParamSchema();
		Map<String, Object> param = new HashMap<String, Object>();
    	paramSchema.setParamMap(param);
		return paramSchema;
	}


	private List<String> createList(String string){
		List<String> list = new ArrayList<>();
		list.add(string);
		return list;
	}
	
	@Test
	public void addMapping() {
		List<MappingSchema> list = new ArrayList<>();
		GrabResultParamString mappingSchemaString = new GrabResultParamString();
		mappingSchemaString.setModeId(EntityTypeEnum.MAP.getId());
		mappingSchemaString.setMappings(JSON.toJSONString(list));
		mappingSchemaString.setGrabId(173);
		
		grabService.addGrabResultString(mappingSchemaString);
	}
	
	private HashMap<String, Object> getCommonParam(){
		HashMap<String, Object> paramMap = new HashMap<String, Object>();
		return paramMap;
	}
	
	@Test
	public void doGet() throws Exception {
		for(int i=1;i<10000;i++) {
			try {
				Integer grabId = 173;
				GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
				grabTriggerParam.setId(grabId);
				grabTriggerParam.setParamMap(getCommonParam());
				grabTriggerParam.getParamMap().put("uid", 5);

				GrabParam grabParam = grabService.getGrabParam(grabId);
				GrabSite grabSite = grabService.getGrabSite(grabParam.getSiteId());

				GrabToken token = null;
				if(grabParam.getTokenSchema()!=null) {
					token = grabService.getGrabToken(grabParam.getTokenSchema(),grabTriggerParam.getParamMap());
				}

				grabTriggerParam.getParamMap().put("uid", i);
				GrabResult result = GrabHttpClient.doHttp(grabTriggerParam,grabParam,grabSite,token);
				if(result !=null) {
					if(result.getResult()!=null && result.getResult().get("name")!=null && StringUtil.isNotEmpty(result.getResult().get("name").toString())) {
						System.out.println(JSON.toJSONString(result.getResult()));
					}
				}
				Thread.sleep(100);
			}catch (Exception e) {
				// TODO: handle exception
			}
		}
	}
	
	@Test
	public void runGrab() throws Exception {
		GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
		grabTriggerParam.setId(173);
		grabTriggerParam.setParamMap(getCommonParam());
		grabService.pushGrab(grabTriggerParam);
		grab.grabRun();
	}
	
	@Test
	public void task() throws Exception {
		grabGeneratorHandler.run();
		grab.grabRun();
		Thread.sleep(1000000);
	}
	
}