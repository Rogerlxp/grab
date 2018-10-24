/**
 * @Title: StringUtil.java
 * @Package com.meizu.reader.utils
 * @Description:
 * @author zhanglun
 * @date 2014-1-9 下午4:16:39
 * @version V1.0
 */
package com.roger.grab.base.common.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

/**
 * @ClassName: StringUtil
 * @Description:
 * @author zhanglun
 * @date 2014-1-9 下午4:16:39
 *
 */
public class StringUtil extends StringUtils {

	private static final String IMG_NAME = "img_";

	/**
	 * 替换屏蔽词
	 *
	 * @param content
	 * @param blockWordSet
	 * @param replacement
	 * @return
	 */
	public static String replaceBlockWord( String content, Set<String> blockWordSet, String replacement ) {
		if( blockWordSet == null ) {
			return content;
		}

		for( String regex : blockWordSet ) {
			Pattern pattern = Pattern.compile( regex, Pattern.CASE_INSENSITIVE );
			Matcher mat = pattern.matcher( content );
			StringBuffer sb = new StringBuffer();
			while( mat.find() ) {
				int start = mat.start();
				int end = mat.end();
				int count = end - start;
				mat.appendReplacement( sb, getReplacementByCount( count, replacement ) );
			}
			mat.appendTail( sb );
			content = sb.toString();
		}
		return content;
	}

	public static String getReplacementByCount( int count, String replacement ) {
		StringBuffer sb = new StringBuffer();
		for( int i = 0; i < count; i++ ) {
			sb.append( replacement );
		}
		return sb.toString();
	}

	public static List<String> getVideoImgList( String content ) {
		String findHtmlImg = "(?i)<embed.*?screenshot=\"(.*?)\".*?>";
		// String findHtmlImg = "(?i)<img.*?src=\"(.*?.[jpg|gif|png])\".*?>";
		List<String> imgList = new ArrayList<String>();
		Pattern pattern = Pattern.compile( findHtmlImg );
		Matcher mat = pattern.matcher( content );
		while( mat.find() ) {
			imgList.add( mat.group( 1 ) );
		}
		return imgList;
	}

	/**
	 * img标签占位符
	 * @param content
	 * @return
	 */
	public static String replaceImgToImgTag( String content ) {
		String regex = "(?i)<img.*?\\s+src.*?>";
		Pattern pattern = Pattern.compile( regex );
		Matcher mat = pattern.matcher( content );
		StringBuffer sb = new StringBuffer();
		int index = 0;
		while( mat.find() ) {
			String imgTag = "<img id=\"" + IMG_NAME + index + "\" class=\"reader_img\" src=\"reader_img_src\" />";
			mat.appendReplacement( sb, imgTag );
			index++;
		}
		mat.appendTail( sb );
		return sb.toString();
	}

	public static String formatContent( String content ) {
		// 这个地方有个特殊字符[　]针对腾讯新闻处理的
		// 处理爱范儿新闻中的[  ] 特殊字符
		// 不能简单的把br标签替换成空字符，很多源就是用br标签分段
		String regex = "(?i)(.*?)</*?\\s*br\\s*/*?>";
		Pattern p = Pattern.compile( regex );
		Matcher m = p.matcher( content );
		StringBuffer sb = new StringBuffer();
		while( m.find() ) {
			// appendReplacement方法中\和$都会被当做特殊字符处理需要转义
			String c = "<p>" + m.group( 1 ).replaceAll( "\\\\", "\\\\\\\\" ).replaceAll( "\\$", "\\\\\\$" ) + "</p>";
			m.appendReplacement( sb, c );
		}
		return m.appendTail( sb ).toString();
		// return m.appendTail(sb).toString().replaceAll("\n",
		// "").replaceAll("\r", "").replaceAll("<p></p>",
		// "").replaceAll("<p>&nbsp;</p>", "").replaceAll("　",
		// "").replaceAll("", "");
	}

	public static String getUuid() {
		String uuid = java.util.UUID.randomUUID().toString();
		uuid = uuid.replaceAll( "\\-", "" );
		return uuid;
	}

	public static String print( String content ) {
		if( StringUtils.isBlank( content ) ) {
			return content;
		}
		if( content.length() > 10 ) {
			return content.substring( 0, 10 );
		}
		return content.substring( 0, content.length() );
	}

	public static String arrayToString( String[] array ) {
		if( array == null || array.length == 0 ) {
			return null;
		}
		StringBuffer sb = new StringBuffer();
		for( String s : array ) {
			sb.append( s + "," );
		}
		return sb.toString();
	}

	public static String arrayToString( long[] array ) {
		if( array == null || array.length == 0 ) {
			return null;
		}
		StringBuffer sb = new StringBuffer();
		for( long s : array ) {
			sb.append( String.valueOf( s ) + "," );
		}
		return sb.toString();
	}

	public static String arrayToString( Long[] array ) {
		if( array == null || array.length == 0 ) {
			return null;
		}
		StringBuffer sb = new StringBuffer();
		for( Long s : array ) {
			sb.append( String.valueOf( s ) + "," );
		}
		return sb.toString();
	}

	public static boolean isStrEndByOneOfThem( String str, String... strArray ) {
		for( String s : strArray ) {
			if( StringUtils.endsWith( str, "." + s ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 字符串拼接
	 * @param s 目标字符串
	 * @param separator 标记符
	 * @param placeholder 占位符
	 * @return
	 */
	public static String placeholderStr( String s, String separator, String placeholder ) {
		if( StringUtils.isEmpty( s ) ) {
			return s;
		}
		if( s.startsWith( separator ) ) {
			s = placeholder + s;
		}
		if( s.endsWith( separator ) ) {
			s = s + placeholder;
		}

		return s;
	}

	/**
	 * 验证站位字符串是否为空
	 * @param s 目标字符串
	 * @param placeholder 占位符
	 * @return
	 */
	public static boolean validatePlaceholderEmpty( String s, String placeholder ) {
		if( StringUtil.isEmpty( s ) || placeholder.equals( s ) ) {
			return true;
		}

		return false;
	}
	
	/**
	 * 判断是否是正整数
	 * @param str
	 * @return
	 */
	public static boolean isNumber(String str){
		try{
			long num = Long.parseLong( str );
			if(num>0){
				return true;
			}
		}catch(Exception e){
			return false;
		}
		return false;
		
//		if(StringUtil.isEmpty( str )){
//			return false;
//		}
//		
//        Pattern pattern = Pattern.compile("[0-9]*");
//        Matcher isNum = pattern.matcher(str);
//        if( !isNum.matches() ){
//            return false;
//        }
//        return true;
	}
	
	public static List<String> strToList( String str, String separator, boolean isTrim ) {
		List<String> list = new ArrayList<String>();
		
		if( StringUtils.isEmpty( str ) ) {
			return list;
		}
		String[] arc = str.split( separator );
		
		for( String string : arc ) {
			if( isTrim ) {
				list.add( string.trim() );
			} else {
				list.add( string );
			}
		}
		
		return list;
	}
	
	public static List<Integer> strToIntegerList( String str, String separator, boolean isTrim ) {
		List<Integer> list = new ArrayList<Integer>();
		
		if( StringUtils.isEmpty( str ) ) {
			return list;
		}
		String[] arc = str.split( separator );
		
		for( String string : arc ) {
			if( isTrim ) {
				list.add( Integer.parseInt( string.trim() ) );
			} else {
				list.add( Integer.parseInt( string ) );
			}
		}
		
		return list;
	}
	
	public static List<Long> strToLongList( String str, String separator, boolean isTrim ) {
		List<Long> list = new ArrayList<Long>();
		
		if( StringUtils.isEmpty( str ) ) {
			return list;
		}
		String[] arc = str.split( separator );
		
		for( String string : arc ) {
			if( isTrim ) {
				list.add( Long.parseLong( string.trim() ) );
			} else {
				list.add( Long.parseLong( string ) );
			}
		}
		
		return list;
	}
	
	public static String fomartBaiduArticleImg( String img ){
		StringBuffer sb = new StringBuffer("");
		if(StringUtils.isEmpty(img)){
			return "";
		}
		
		int imgCount = 0;
		String [] arr = img.split("\\|");
		for (String str : arr) {
			String[] arr2 = str.split(",");
			for (String str2 : arr2) {
				String str2Trim = str2.trim();
				if(str2Trim.startsWith("http") || str2Trim.startsWith("HTTP")){
					if(imgCount==0){
						sb.append(str2Trim);
					}else{
						sb.append(",").append(str2Trim);
					}
					imgCount++;
				}
			}
		}
		
		return sb.toString();
	}
	
	public static String getFirstArticleImg( String img ){
		if(StringUtils.isEmpty(img)){
			return "";
		}
		
		String[] imgArr = img.split(",");
		for (String str : imgArr) {
			String strTrim = str.trim();
			if(strTrim.startsWith("http") || strTrim.startsWith("HTTP")){
				return strTrim;
			}
		}
		
		return "";
	}

}
