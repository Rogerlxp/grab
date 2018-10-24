package com.roger.grab.base.common.util;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.assertj.core.util.Collections;

import com.roger.grab.base.common.framework.ILog;
import com.roger.grab.base.common.framework.LogFactory;
import com.roger.grab.base.domain.grab.SchemaTree;
import com.roger.grab.base.enums.grab.ObjectTypeEnum;
import com.roger.grab.base.domain.grab.GrabParam.Param;
import com.roger.grab.base.domain.grab.Schema;



public class GrabRuleUtil{
	private static final ILog LOGGER = LogFactory.getLog(GrabRuleUtil.class);
	private static final String SPLIT_ESCAPE = "\\[\\*\\]";
	private static final String SPLIT = "[*]";
	private static final String JSON_BEGIN = "$"; 
	private static final String HTML_BEGIN = "/"; 
	private static final String ATTRIBUTETOLIST_CHAR = ".*";
	
	/**
	 *  将json提取规则格式化
	 * @param resultGrabParam
	 * @param baseRule
	 * @return
	 * @throws Exception
	 */
	public static SchemaTree createJsonSchemaTree(List<Param> resultGrabParam,String baseRule) throws Exception {
		return createJsonSchemaTree(resultGrabParam, baseRule,null);
	}
	
	/**
	 * 将json提取规则格式化
	 * @param resultGrabParam
	 * @param baseRule
	 * @param attributeToList  属性转列表的层级
	 * @return
	 * @throws Exception
	 */
	public static SchemaTree createJsonSchemaTree(List<Param> resultGrabParam,String baseRule,List<String> attributeToList) throws Exception {
		if(!Collections.isNullOrEmpty(resultGrabParam)) {
			SchemaTree base_result = new SchemaTree();
			List<Schema> xpathParams = new ArrayList<Schema>(); 
			Schema base_xpath = new Schema();
			base_xpath.setObjectType(ObjectTypeEnum.OBJECT);
			base_xpath.setExpression(JSON_BEGIN);
			base_xpath.setName("ruselt");
			base_result.setSchema(base_xpath);
			base_result.setParams(xpathParams);
			
			List<String> base_rules = layerRule(baseRule,false);
			String[] rules = new String[base_rules.size()+1];
			base_rules.toArray(rules);
			
			String baseRule_escape = escapeExprSpecialWord(baseRule);
			List<Param> schemaNodeParams = new ArrayList<>();
			
			for (Param param : resultGrabParam) {
				if(StringUtil.isEmpty(param.getRule())) {
					continue;
				}
				String rule = param.getRule();
				boolean hasNext = (!Collections.isNullOrEmpty(base_rules)) && (rule.indexOf(SPLIT)>-1) && (rule.indexOf(baseRule)>-1);
				if(!hasNext) {
					schemaNodeParams.add(param);
					continue;
				}else {
					rules[rules.length-1] = rule.replaceFirst(baseRule_escape, "");
					SchemaTree this_result = base_result;
					for (int i=0;i<rules.length;i++) {
						if(i+1 < rules.length || i == 0) {
							String next_rule = rules[i];
							createNextNode(this_result, next_rule,param.getName());
							this_result = this_result.getNextNode();
						}else {
							addNodeExpression(this_result,rules[i],param,false);
						}
					}
				}
			}
			for(Param param : schemaNodeParams) {
				addSchemaNodeParam(base_result,param.getRule(),param,false);
			}
			if(ListUtils.isNotEmpty(attributeToList)) {
				java.util.Collections.sort(attributeToList,new Comparator<String>(){
					@Override
					public int compare(String o1, String o2) {
						return o2.compareTo(o1);
					}});
				for(String temp:attributeToList) {
					temp = temp.replaceAll(SPLIT_ESCAPE, "");
					handlerAttributeToList(base_result, temp);
				}
			}
			return base_result;
		}
		return null;
	}
	
	private static void handlerAttributeToList(SchemaTree schemaTree,String attribute) throws Exception {
		String rule = schemaTree.getSchema().getExpression();
		String no_expt_rule = escapeExprSpecialWord(rule);
		if(!attribute.startsWith(rule)) {
			//找不到层级
			throw new Exception(String.format("%s属性不在层级化处理中", attribute));
		}
		attribute = attribute.replaceFirst(no_expt_rule, "");
		if(StringUtil.isEmpty(attribute)) {
			rule = rule + ATTRIBUTETOLIST_CHAR;
			schemaTree.getSchema().setExpression(rule);
			return;
		}
		attribute = addBaseLayer(rule, attribute, false);
		if(schemaTree.getNextNode()!=null) {
			handlerAttributeToList(schemaTree.getNextNode(), attribute);
		}
	}

	/**
	 * 将rule路径层级化
	 * @param baseRule
	 * @return
	 */
	private static List<String> layerRule(String baseRule,boolean isHtml) {
		List<String> base_rules = new ArrayList<>();
		if(StringUtil.isNotEmpty(baseRule) && baseRule.indexOf(SPLIT)>-1) {
			String[] rules = baseRule.split(SPLIT_ESCAPE);
			for(int i = 0;i<rules.length;i++) {
				String r = rules[i];
				if(i>0) {
					r = addBaseLayer(rules[i-1],r,isHtml);
				}
				base_rules.add(r);
			}
		}
		return base_rules;
	}
	
	/**
	 * 将html提取规则格式化
	 * @param resultGrabParam
	 * @param baseRule
	 * @return
	 * @throws Exception
	 */
	public static SchemaTree createHtmlSchemaTree(List<Param> resultGrabParam,String baseRule) throws Exception {
		if(!Collections.isNullOrEmpty(resultGrabParam)) {
			SchemaTree base_result = new SchemaTree();
			List<Schema> xpathParams = new ArrayList<Schema>(); 
			Schema base_xpath = new Schema();
			base_xpath.setObjectType(ObjectTypeEnum.OBJECT);
			base_xpath.setExpression(HTML_BEGIN);
			base_xpath.setName("ruselt");
			base_result.setSchema(base_xpath);
			base_result.setParams(xpathParams);
			
			List<String> base_rules = layerRule(baseRule,true);
			String[] rules = new String[base_rules.size()+1];
			base_rules.toArray(rules);
			String baseRule_escape = escapeExprSpecialWord(baseRule);
			List<Param> schemaNodeParams = new ArrayList<>();
			
			for (Param param : resultGrabParam) {
				if(StringUtil.isEmpty(param.getRule())) {
					continue;
				}
				String rule = param.getRule();
				boolean hasNext = (!Collections.isNullOrEmpty(base_rules)) && (rule.indexOf(SPLIT)>-1) && (rule.indexOf(baseRule)>-1);
				if(!hasNext) {
					schemaNodeParams.add(param);
					continue;
				}else {
					rules[rules.length-1] = rule.replaceFirst(baseRule_escape, "");
					SchemaTree this_result = base_result;
					for (int i=0;i<rules.length;i++) {
						if(i+1 < rules.length || i == 0) {
							String next_rule = rules[i];
							createNextNode(this_result, next_rule,param.getName());
							this_result = this_result.getNextNode();
						}else {
							addNodeExpression(this_result,rules[i],param,true);
						}
					}
				}
			}
			for(Param param : schemaNodeParams) {
				addSchemaNodeParam(base_result,param.getRule(),param,true);
			}
			return base_result;
		}
		return null;
	}
	
	/**
	 * 生成下一节点的基础schema expression
	 * @param beforeSchemaExp
	 * @param rule
	 * @return
	 */
	private static String addBaseLayer(String beforeSchemaExp, String rule,boolean isHtml) {
		if(!isHtml) {
			if(rule.startsWith(JSON_BEGIN)) {
				return rule;
			}
			return JSON_BEGIN+rule;
		}else {
			int index = beforeSchemaExp.lastIndexOf(HTML_BEGIN);
			if(index+1==beforeSchemaExp.length()) {
				//第一个节点，其base_rule 为"/"
				return rule;
			}
			if(index < 0) {
				index = 0;
			}
			rule = beforeSchemaExp.substring(index)+rule;
			//html 需替换[*]的下一层级表达方式及补充节点本身（html时会将自）
			rule = rule.replaceAll(SPLIT_ESCAPE, "");
			return rule;
		}
	}

	/**
	 * 将前至属性（基本对象前的属性）加入到相应节点
	 * @param param
	 * @param rule
	 * @param param2
	 * @param b
	 */
	private static void addSchemaNodeParam(SchemaTree baseTree, String rule, Param param, boolean isHtml) {
		boolean selectNext = false;
		if(rule.indexOf(SPLIT)>-1) {
			//展开层级，生成层级base_rule
			 List<String> base_rules = layerRule(rule,isHtml);
			 String[]rules = rule.split(SPLIT_ESCAPE);
			for(int i=0;i<base_rules.size();i++) {
				String r = base_rules.get(i);
				if(baseTree.getNextNode()!=null) {
					//如果在基础层级的同一条分支属性上，则继续向下查找
					if(baseTree.getNextNode().getSchema().getExpression().equalsIgnoreCase(r)) {
						baseTree = baseTree.getNextNode();
						if(i>0) {
							rule = addBaseLayer(base_rules.get(i-1), rule, isHtml);
						}
						rule = rule.replaceFirst(escapeExprSpecialWord(r+SPLIT), "");
						selectNext = true;
					}else {
						break;
					}
				}else {
					break;
				}
			}
		}
		addNodeExpression(baseTree, rule, param, isHtml);
	}

	/**
	 * 生成下一节点
	 * @param base_result
	 * @param rule
	 * @param name
	 * @throws Exception
	 */
	private static void createNextNode(SchemaTree base_result,String rule,String name) throws Exception {
		SchemaTree next_result = base_result.getNextNode();
		if(next_result == null) {
			Schema beforeXpath = new Schema();
			beforeXpath.setObjectType(ObjectTypeEnum.LIST);
			beforeXpath.setName(name);
			beforeXpath.setExpression(rule);
			
			next_result = new SchemaTree();
			next_result.setSchema(beforeXpath);
			next_result.setParams(new ArrayList<Schema>());
			
			base_result.setNextNode(next_result);
			base_result.setSpread(true);
		}else {
			if(next_result.getSchema() == null || StringUtil.isEmpty(next_result.getSchema().getExpression())) {
				LOGGER.error("展开信息不完整！！base:"+base_result+",rule:"+rule);
				throw new Exception();
			}
			if(!rule.toUpperCase().equals(next_result.getSchema().getExpression().toUpperCase())) {
				LOGGER.error("不能同一层级存在多个展开！！base:"+base_result+",rule:"+rule);
				throw new Exception();
			}
		}
	}
	
	/**
	 * 添加当前节点提取的属性
	 * @param base_result
	 * @param rule
	 * @param param
	 * @param isHtml
	 */
	private static void addNodeExpression(SchemaTree base_result,String rule,Param param,boolean isHtml) {
		Schema xpath = new Schema();
		if(param.getObjectType() == null) {
			if(rule.indexOf(SPLIT)>-1) {
				xpath.setObjectType(ObjectTypeEnum.LIST);
			}else {
				xpath.setObjectType(ObjectTypeEnum.OBJECT);
			}
		}else {
			xpath.setObjectType(param.getObjectType());
		}
		xpath.setName(param.getName());
		rule = addBaseLayer(base_result.getSchema().getExpression(),rule,isHtml);
		xpath.setExpression(rule);
		if(Collections.isNullOrEmpty(base_result.getParams())) {
			base_result.setParams(new ArrayList<>());
		}
		base_result.getParams().add(xpath);
	}
	
	/**
	 * 替换转义字符
	 * @param keyword
	 * @return
	 */
	public static String escapeExprSpecialWord(String keyword) {  
	    if (StringUtil.isNotEmpty(keyword)) {  
	        String[] fbsArr = { "\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|" };  
	        for (String key : fbsArr) {  
	            if (keyword.contains(key)) {  
	                keyword = keyword.replace(key, "\\" + key);  
	            }  
	        }  
	    }  
	    return keyword;  
	}  
}
