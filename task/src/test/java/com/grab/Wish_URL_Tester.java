package com.grab;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;

import com.alibaba.fastjson.JSON;
import com.roger.grab.base.common.util.GrabRuleUtil;
import com.roger.grab.base.common.util.RequestParamHandleUtil;
import com.roger.grab.base.domain.grab.GrabExtractElement;
import com.roger.grab.base.domain.grab.GrabParam;
import com.roger.grab.base.domain.grab.GrabParam.Param;
import com.roger.grab.base.domain.grab.GrabParamString;
import com.roger.grab.base.domain.grab.GrabParamString.OriginalParam;
import com.roger.grab.base.domain.grab.GrabResultDataStatus;
import com.roger.grab.base.domain.grab.ParamSchema;
import com.roger.grab.base.domain.grab.Schema;
import com.roger.grab.base.domain.grab.SchemaTree;
import com.roger.grab.base.domain.grab.UrlHead;
import com.roger.grab.base.enums.grab.MethodTypeEnum;
import com.roger.grab.base.enums.grab.ObjectTypeEnum;
import com.roger.grab.base.enums.grab.TextTypeEnum;


/**
 * 
 * @author Roger
 *
 */
public class Wish_URL_Tester  {
	
	private List<String> paramNames() {
		List<String> list = new ArrayList<>();
		list.add("count");
		list.add("offset");
		list.add("request_categories");
		list.add("request_id");
		list.add("request_branded_filter");
		return list;
	}
	
	public GrabParam getGrab() throws Exception {
		GrabParam grabParam = new GrabParam();
		OriginalParam originalExtract = new OriginalParam();
		grabParam.setGrabExtractElement(grabExtractElementL(originalExtract));
		grabParam.setMethodType(MethodTypeEnum.POST_MAP_PARA	);
		grabParam.setParamSchema(commonParamSchema());
		grabParam.setCpId(102);
		grabParam.setUrl("https://www.wish.com/api/feed/get-filtered-feed");
		GrabParamString grabParamString = new GrabParamString(grabParam);
		grabParamString.setName("test wish");
		grabParamString.setOriginalParam(originalExtract);
//		Assert.assertEquals( true,grabService.addGrabParam(grabParamString));
		return grabParam;
//		grabParamString.setId(91);
//		grabService.updateGrabParam(grabParamString);
	}
	
	private GrabExtractElement grabExtractElementL(OriginalParam originalExtract) throws Exception {
		GrabExtractElement grabExtractElement = new GrabExtractElement();
		grabExtractElement.setType(TextTypeEnum.JSON);
		grabExtractElement.setResultSchemaTree(schemaTree_getdelete(originalExtract));
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

	private SchemaTree schemaTree_getdelete(OriginalParam originalExtract) throws Exception {
		List<Param> resultGrabParam = new ArrayList<Param>();
		Param p16 = new Param();
		p16.setName("products");
		p16.setRule("$.data.products[0:-1]");
		resultGrabParam.add(p16);
		String baseRule ="";
		originalExtract.setParams(resultGrabParam);
		originalExtract.setBaseRule(baseRule);
		SchemaTree resultValueParam = GrabRuleUtil.createJsonSchemaTree(resultGrabParam,baseRule);
		return resultValueParam;
	}
	
	private ParamSchema commonParamSchema() {
		ParamSchema  paramSchema = new ParamSchema();
		Map<String, Object> param = new HashMap<String, Object>();
		
    	param.put("count", 20);
    	param.put("offset", 0);
    	param.put("request_categories", false);
    	param.put("request_id","tag_53dc186421a86318bdc87f0f");
    	param.put("request_branded_filter",false);

    	paramSchema.setParamMap(param);
		return paramSchema;
	}

	public static void main(String[] arg) throws Exception {
		Wish_URL_Tester tester = new Wish_URL_Tester();
		GrabParam grabParam = tester.getGrab();
		PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
		HttpClient httpClient = HttpClients.custom().setConnectionManager(cm).build();
		HttpPost httpPost = new HttpPost(grabParam.getUrl());
		Map<String, String> headers = new HashMap<>();
		
		List<UrlHead> headerList = new ArrayList();
		
		UrlHead cookie = new UrlHead();
		cookie.setHeadName("cookie");
		cookie.setHeadValue("__utmz=96128154.1534495269.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; cto_lwid=d12b9b1c-fbe4-41d2-bbff-fec566ee57c4; bsid=e00693542f50442f806f9463022436d6; __utma=96128154.1057994720.1534495269.1534495269.1534730933.2; sweeper_session=\"2|1:0|10:1534730954|15:sweeper_session|84:MjE1YjE3MDgtNDhjNi00ZWY0LTk4YjAtYmM1ZDkzNDhjNjFjMjAxOC0wOC0yMCAwMjowOToxMS4zMzM2OTc=|9286b3235b57ac0bab478ef742cff7ac5e22cb6c80ea21cbfbae18d3098f82c5\"; sessionRefreshed_5b76edb4489ca116acbac0a2=true; G_ENABLED_IDPS=google; __stripe_mid=56fe552c-6a6e-482c-b73b-83e797a88951; __stripe_sid=271f804e-3bd9-4475-a2cc-7fea7159ce68; _xsrf=2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981; _timezone=-8; sweeper_uuid=6af38aeb19b24bd394bf9a9adf2c52c4; _ga=GA1.2.1057994720.1534495269; _gid=GA1.2.252976855.1534745984; _gat_gtag_UA_27166730_24=1");
		headerList.add(cookie);

		UrlHead origin = new UrlHead();
		origin.setHeadName("origin");
		origin.setHeadValue("https://www.wish.com");
		headerList.add(origin);
		
		UrlHead referer = new UrlHead();
		referer.setHeadName("referer");
		referer.setHeadValue("https://www.wish.com/feed/tag_53dc186421a86318bdc87f0f");
		headerList.add(referer);

		UrlHead agent = new UrlHead();
		agent.setHeadName("user-agent");
		agent.setHeadValue("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
		headerList.add(agent);
		
		UrlHead xsrftoken = new UrlHead();
		xsrftoken.setHeadName("x-xsrftoken");
		xsrftoken.setHeadValue("2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981");
		headerList.add(xsrftoken);

		grabParam.setHeads(JSON.toJSONString(headerList));
		
		RequestParamHandleUtil.addHead(headers,httpPost,grabParam);
		RequestParamHandleUtil.addEntity_httpPost(httpPost,grabParam);
		
		Header[] cookies =httpPost.getHeaders("cookie");
		for (Header header : cookies) {
			System.out.println(header.getValue());
		}
		System.out.println("__utmz=96128154.1534495269.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; cto_lwid=d12b9b1c-fbe4-41d2-bbff-fec566ee57c4; bsid=e00693542f50442f806f9463022436d6; __utma=96128154.1057994720.1534495269.1534495269.1534730933.2; sweeper_session=\"2|1:0|10:1534730954|15:sweeper_session|84:MjE1YjE3MDgtNDhjNi00ZWY0LTk4YjAtYmM1ZDkzNDhjNjFjMjAxOC0wOC0yMCAwMjowOToxMS4zMzM2OTc=|9286b3235b57ac0bab478ef742cff7ac5e22cb6c80ea21cbfbae18d3098f82c5\"; sessionRefreshed_5b76edb4489ca116acbac0a2=true; G_ENABLED_IDPS=google; __stripe_mid=56fe552c-6a6e-482c-b73b-83e797a88951; __stripe_sid=271f804e-3bd9-4475-a2cc-7fea7159ce68; _xsrf=2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981; _timezone=-8; sweeper_uuid=6af38aeb19b24bd394bf9a9adf2c52c4; _ga=GA1.2.1057994720.1534495269; _gid=GA1.2.252976855.1534745984; _gat_gtag_UA_27166730_24=1");
		Header[] origins =httpPost.getHeaders("origin");
		for (Header header : origins) {
			System.out.println(header.getValue());
		}
		System.out.println("https://www.wish.com");
		Header[] referers =httpPost.getHeaders("referer");
		for (Header header : referers) {
			System.out.println(header.getValue());
		}
		System.out.println("https://www.wish.com/feed/tag_53dc186421a86318bdc87f0f");
		Header[] agents =httpPost.getHeaders("user-agent");
		for (Header header : agents) {
			System.out.println(header.getValue());
		}
		System.out.println("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
		Header[] xsrftokens =httpPost.getHeaders("x-xsrftoken");
		for (Header header : xsrftokens) {
			System.out.println(header.getValue());
		}
		System.out.println("2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981");
		HttpResponse httpResponse = httpClient.execute(httpPost);
		System.out.println(EntityUtils.toString(httpResponse.getEntity(), Charset.forName("UTF-8")));
	}
	
	
}