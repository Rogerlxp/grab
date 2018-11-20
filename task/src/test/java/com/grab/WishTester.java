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
import com.roger.grab.task.Grab;

/**
 * 
 * @author Roger
 *
 */
public class WishTester extends GrabTester {
	
	@Autowired
	private IGrabService grabService;
	@Autowired
	private Grab grab;
	@Autowired
	private RedisTemplate redisTemplate;
	
	@Test
	public void refCache() throws GrabException {
		Integer grabId = 170;
		grabService.refCache(grabId);
		grabService.getGrabParam(grabId);
		grabService.getGrabResultParam(grabId);
		
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		grabId = 171;
		grabService.refCache(grabId);
		grabService.getGrabParam(grabId);
		grabService.getGrabResultParam(grabId);
		
		System.out.println(redisTemplate.opsForValue().get("grab:170"));
		System.out.println(redisTemplate.opsForValue().get("grab:171"));
		System.out.println(redisTemplate.opsForZSet().size(RedisKeys.Grab.GRAB+"~keys"));
		System.out.println(redisTemplate.opsForZSet().size(RedisKeys.Grab.GRAB_MAPPING+"~keys"));
		
		try {
			Thread.sleep(6000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		System.out.println(redisTemplate.opsForValue().get("grab:170"));
		System.out.println(redisTemplate.opsForValue().get("grab:171"));
		System.out.println(redisTemplate.opsForZSet().size(RedisKeys.Grab.GRAB+"~keys"));
		System.out.println(redisTemplate.opsForZSet().size(RedisKeys.Grab.GRAB_MAPPING+"~keys"));
		System.out.println(grabService.getGrabParam(grabId));
		
	}
	
	@Test
	public void cleanCache() throws GrabException {
		Integer grabId = 170;
		grabService.refCache(grabId);
	}
	
	@Test
	public void cleanCaches() throws GrabException {
		Integer[] grabIds = {169,170,171,172};
		for (Integer grabId : grabIds) {
			grabService.refCache(grabId);
		}
	}
	
	
	@Test
	public void addCommodify() throws Exception {
		GrabParam grabParam = new GrabParam();
		OriginalParam originalExtract = new OriginalParam();
		grabParam.setGrabExtractElement(grabExtractElementL("addCommodify",originalExtract));
		grabParam.setMethodType(MethodTypeEnum.POST_MAP_PARA);
		grabParam.setParamSchema(commonParamSchema());
		grabParam.getParamSchema().getParamMap().put("count", 20);
    	grabParam.getParamSchema().getParamMap().put("offset", 0);
    	grabParam.getParamSchema().getParamMap().put("request_categories", false);
    	grabParam.getParamSchema().getParamMap().put("request_id","tag_53dc186421a86318bdc87f0f");
    	grabParam.getParamSchema().getParamMap().put("request_branded_filter",false);

		grabParam.setCpId(1);
		grabParam.setUrl("https://www.wish.com/api/feed/get-filtered-feed");
		GrabParamString grabParamString = new GrabParamString(grabParam);
		grabParamString.setName("wish商品按分类爬取");
		grabParamString.setOriginalParam(originalExtract);
		List<UrlHead> headers = new ArrayList();
		
		UrlHead cookie = new UrlHead();
		cookie.setHeadName("cookie");
		cookie.setHeadValue("__utmz=96128154.1534495269.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; cto_lwid=d12b9b1c-fbe4-41d2-bbff-fec566ee57c4; bsid=e00693542f50442f806f9463022436d6; __utma=96128154.1057994720.1534495269.1534495269.1534730933.2; sweeper_session=\"2|1:0|10:1534730954|15:sweeper_session|84:MjE1YjE3MDgtNDhjNi00ZWY0LTk4YjAtYmM1ZDkzNDhjNjFjMjAxOC0wOC0yMCAwMjowOToxMS4zMzM2OTc=|9286b3235b57ac0bab478ef742cff7ac5e22cb6c80ea21cbfbae18d3098f82c5\"; sessionRefreshed_5b76edb4489ca116acbac0a2=true; G_ENABLED_IDPS=google; __stripe_mid=56fe552c-6a6e-482c-b73b-83e797a88951; __stripe_sid=271f804e-3bd9-4475-a2cc-7fea7159ce68; _xsrf=2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981; _timezone=-8; sweeper_uuid=6af38aeb19b24bd394bf9a9adf2c52c4; _ga=GA1.2.1057994720.1534495269; _gid=GA1.2.252976855.1534745984; _gat_gtag_UA_27166730_24=1");
		headers.add(cookie);

		UrlHead origin = new UrlHead();
		origin.setHeadName("origin");
		origin.setHeadValue("https://www.wish.com");
		headers.add(origin);
		
		UrlHead referer = new UrlHead();
		referer.setHeadName("referer");
		referer.setHeadValue("https://www.wish.com/feed/tag_53dc186421a86318bdc87f0f");
		headers.add(referer);

		UrlHead agent = new UrlHead();
		agent.setHeadName("user-agent");
		agent.setHeadValue("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
		headers.add(agent);
		
		UrlHead xsrftoken = new UrlHead();
		xsrftoken.setHeadName("x-xsrftoken");
		xsrftoken.setHeadValue("2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981");
		headers.add(xsrftoken);

		grabParamString.setHeads(JSON.toJSONString(headers));
		
//		Assert.assertEquals( true,grabService.addGrabParam(grabParamString)>0);
		grabParamString.setId(170);
		grabService.updateGrabParam(grabParamString);
		grabService.refCache(170);
	}
	
	private GrabExtractElement grabExtractElementL(String name,OriginalParam originalExtract) throws Exception {
		GrabExtractElement grabExtractElement = new GrabExtractElement();
		grabExtractElement.setType(TextTypeEnum.JSON);
		if(name.equals("addCommodify")) {
			grabExtractElement.setResultSchemaTree(schemaTree_Cateogry(originalExtract));
		}
		GrabResultDataStatus grabResultDataStatus = new GrabResultDataStatus();
		Schema codeSchema = new Schema();
		codeSchema.setName("code");
		codeSchema.setObjectType(ObjectTypeEnum.OBJECT);
		codeSchema.setExpression("$.code");
		grabResultDataStatus.setCodeSchema(codeSchema);
//		grabResultDataStatus.setErrorCodeMap(errorCodeMap);
		Set<String>success = new HashSet<>();
		success.add("0");
		grabResultDataStatus.setSuccess(success);
		grabExtractElement.setGrabResultDataStatus(grabResultDataStatus);
		return grabExtractElement;
	}

	private SchemaTree schemaTree_Cateogry(OriginalParam originalExtract) throws Exception {
		List<Param> resultGrabParam = new ArrayList<Param>();
		Param img = new Param();
		img.setName("img");
		img.setRule("$.data.products[*].contest_selected_picture");
		resultGrabParam.add(img);
		Param id = new Param();
		id.setName("id");
		id.setRule("$.data.products[*].id");
		resultGrabParam.add(id);
		String baseRule ="$.data.products[*]";
		originalExtract.setParams(resultGrabParam);
		originalExtract.setBaseRule(baseRule);
		SchemaTree resultValueParam = GrabRuleUtil.createJsonSchemaTree(resultGrabParam,baseRule);
		return resultValueParam;
	}
	
	
	

	private SchemaTree schemaTree(OriginalParam originalExtract) throws Exception {
		String baseRule ="$.data[*]";
		originalExtract.setParams(resultGrabParam());
		originalExtract.setBaseRule(baseRule);
		SchemaTree resultValueParam = GrabRuleUtil.createJsonSchemaTree(originalExtract.getParams(),baseRule);
		return resultValueParam;
	}
	
	private List<Param> resultGrabParam() {
		List<Param> resultGrabParam = new ArrayList<Param>();
		Param p1 = new Param();
		p1.setName("cpEntityId");
		p1.setRule("$.data[*].video_id");

		Param p2 = new Param();
		p2.setName("title");
		p2.setRule("$.data[*].title");
		
		Param p14 = new Param();
		p14.setName("tags");
		p14.setRule("$.data[*].tags");
		
		Param p16 = new Param();
		p16.setName("category");
		p16.setRule("$.data[*].category_name");
		
		Param p3 = new Param();
		p3.setName("weight");
		p3.setRule("$.data[*].is_choice");
		
		Param p9 = new Param();
		p9.setName("shareUrl");
		p9.setRule("$.data[*].h5_url");
		
		Param p8 = new Param();
		p8.setName("image_url");
		p8.setRule("$.data[*].image");
		
		Param p5 = new Param();
		p5.setName("duration");
		p5.setRule("$.data[*].duration");
		
		Param p15 = new Param();
		p15.setName("authorId");
		p15.setRule("$.data[*].provider.id");
		
		Param p4 = new Param();
		p4.setName("authorName");
		p4.setRule("$.data[*].provider.name");
		
		Param p11 = new Param();
		p11.setName("authorImage");
		p11.setRule("$.data[*].provider.avatar");

		Param p7 = new Param();
		p7.setName("publishTime");
		p7.setRule("$.data[*].publish_date");
		
		
		Param p12 = new Param();
		p12.setName("like");
		p12.setRule("$.data[*].like_count");

		Param p17 = new Param();
		p17.setName("playCounts");
		p17.setRule("$.data[*].play_count");
	

		resultGrabParam.add(p1);
		resultGrabParam.add(p2);
		resultGrabParam.add(p3);
		resultGrabParam.add(p4);
		resultGrabParam.add(p5);
		resultGrabParam.add(p7);
		resultGrabParam.add(p8);
		resultGrabParam.add(p9);
		resultGrabParam.add(p11);
		resultGrabParam.add(p12);
		resultGrabParam.add(p14);
		resultGrabParam.add(p15);
		resultGrabParam.add(p16);
		resultGrabParam.add(p17);
		return resultGrabParam;
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
		MappingSchema img = new MappingSchema();
		img.setKeyName(ResultMappingUtil.GrabCommodity.img);
		img.setValNames(createList("img"));

		MappingSchema id = new MappingSchema();
		id.setValNames(createList("id"));
		id.setKeyName(ResultMappingUtil.GrabCommodity.id);

		List<MappingSchema> list = new ArrayList<>();
		list.add(img);
		list.add(id);
		
		GrabResultParamString mappingSchemaString = new GrabResultParamString();
		mappingSchemaString.setModeId(EntityTypeEnum.COMMODITY.getId());
		mappingSchemaString.setMappings(JSON.toJSONString(list));
		mappingSchemaString.setGrabId(170);
		
		
		grabService.addGrabResultString(mappingSchemaString);
	}
	
	private HashMap<String, Object> getCommonParam(){
		HashMap<String, Object> paramMap = new HashMap<String, Object>();
		return paramMap;
	}
	
	@Test
	public void doGet() throws Exception {
		Integer grabId = 170;
		GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
		grabTriggerParam.setId(grabId);
		grabTriggerParam.setParamMap(getCommonParam());

		GrabParam grabParam = grabService.getGrabParam(grabId);
		GrabSite grabSite = grabService.getGrabSite(grabParam.getSiteId());
		
		GrabToken token = null;
		if(grabParam.getTokenSchema()!=null) {
			token = grabService.getGrabToken(grabParam.getTokenSchema(),grabTriggerParam.getParamMap());
		}
		GrabResult result = GrabHttpClient.doHttp(grabTriggerParam,grabParam,grabSite,token);
		if(result !=null) {
			if(result.getResult()!=null) {
				System.out.println(JSON.toJSONString(result.getResult()));
			}
			if(!CollectionUtils.isEmpty(result.getArrayResult())) {
				System.out.println("返回列表：");
				for (GrabResult r : result.getArrayResult()) {
					System.out.println(JSON.toJSONString(r.getResult()));
				}
			}
		}
	}
	
	@Test
	public void runGrab() throws Exception {
		GrabTriggerParam grabTriggerParam = new GrabTriggerParam();
		grabTriggerParam.setId(170);
		grabTriggerParam.setParamMap(getCommonParam());
		grabService.pushGrab(grabTriggerParam);
		grab.grabRun();
	}
	
}