/**
 *
 */
package com.roger.grab.base.common.util;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Array;
import java.util.*;

/**
 * @author zhanglun
 *
 */
public class ListUtils extends org.apache.commons.collections.ListUtils {
	
	/**
	 * 返回List第一个元素,如果为null就返回null
	 * @param list
	 * @return
	 */
	public static <T> T getListFirst( List<T> list ) {
		if( ListUtils.isNotEmpty( list ) ) {
			return list.get( 0 );
		}
		return null;
	}
	
	public static int size( Object[] list ) {
		if( list == null ) {
			return 0;
		} else {
			return list.length;
		}
	}

	public static int size( List<?> list ) {
		if( list == null ) {
			return 0;
		} else {
			return list.size();
		}
	}

	public static List<String> uniq( List<String> list ) {
		if( list == null ) {
			return null;
		}
		List<String> result = new ArrayList<String>();
		for( String str : list ) {
			if( !result.contains( str ) ) {
				result.add( str );
			}
		}
		return result;
	}

	public static boolean isNotEmpty( List<?> list ) {
		if( list == null || list.isEmpty() ) {
			return false;
		} else {
			return true;
		}
	}

	public static boolean isEmpty( List<?> list ) {
		if( list == null || list.isEmpty() ) {
			return true;
		} else {
			return false;
		}
	}

	public static List<String> toStringResult( List<String> list ) {
		if( list == null || list.isEmpty() ) {
			return null;
		}
		return list;
	}

	public static String[] defaultStrings( String[] strs ) {
		if( strs == null ) {
			return new String[ 0 ];
		}
		return strs;
	}

	public static <T> List<T> defaultList( List<T> list ) {
		if( list == null ) {
			return new ArrayList<T>();
		}
		return list;
	}

	public static List<?> noNull( List<?> list ) {
		if( list == null || list.isEmpty() ) {
			return null;
		}
		// 删除空记录
		Iterator<?> iterator = list.iterator();
		while( iterator.hasNext() ) {
			Object next = iterator.next();
			if( next == null ) {
				iterator.remove();
			}
		}
		return list;
	}

	public static List<String> toList( Set<String> set ) {
		if( set == null || set.isEmpty() ) {
			return null;
		}
		List<String> list = new ArrayList<String>();
		// Iterator<String> iterator = set.iterator();
		// while (iterator.hasNext()) {
		// list.add(iterator.next());
		// }
		for( String str : set ) {
			list.add( str );
		}
		return list;
	}

	public static <KEYTYPE> Set<KEYTYPE> toSet( List<KEYTYPE> list ) {
		if( list == null || list.isEmpty() ) {
			return null;
		}
		Set<KEYTYPE> set = new LinkedHashSet<KEYTYPE>();
		for( KEYTYPE element : list ) {
			set.add( element );
		}
		return set;
	}

	public static Set<Integer> toIntSet( List<Integer> list ) {
		if( list == null || list.isEmpty() ) {
			return null;
		}
		Set<Integer> set = new LinkedHashSet<Integer>();
		for( Integer element : list ) {
			set.add( element );
		}
		return set;
	}

	public static List<Integer> toIntList( int num ) {
		List<Integer> list = new ArrayList<Integer>();
		list.add( num );
		return list;
	}

	public static List<Integer> toIntList( String content ) {
		if( StringUtils.isEmpty( content ) ) {
			return null;
		}
		String[] strs = StringUtils.split( content, "," );
		List<Integer> list = new ArrayList<Integer>();
		for( String str : strs ) {
			int num = Integer.parseInt( str.trim() );
			list.add( num );
		}
		return list;
	}

	public static List<String> toList( String content ) {
		if( StringUtils.isEmpty( content ) ) {
			return null;
		}
		String[] strs = StringUtils.split( content, "," );
		List<String> list = new ArrayList<String>();
		for( String str : strs ) {
			list.add( str );
		}
		return list;
	}

	public static List<String> toList( String content, boolean trim ) {
		if( StringUtils.isEmpty( content ) ) {
			return null;
		}
		if( !trim ) {
			return toList( content );
		}
		content = content.trim();
		String[] strs = StringUtils.split( content, "," );
		List<String> list = new ArrayList<String>();
		for( String str : strs ) {
			str = str.trim();
			list.add( str );
		}
		return list;
	}

	public static List<Integer> toIntList( Set<String> members ) {
		if( members == null || members.isEmpty() ) {
			return null;
		}
		List<Integer> result = new ArrayList<Integer>();
		Iterator<String> iterator = members.iterator();
		while( iterator.hasNext() ) {
			String str = iterator.next();
			Integer newsId = Integer.parseInt( str );
			result.add( newsId );
		}
		return result;
	}

	public static String[] getIntKeys( String prefix, Set<Integer> idSet ) {
		String[] keys = new String[ idSet.size() ];
		int index = 0;
		for( Integer id : idSet ) {
			keys[ index ] = prefix + ":" + id;
			index++;
		}
		return keys;
	}

	public static String[] getKeys( String prefix, Set<String> usernameSet ) {
		String[] keys = new String[ usernameSet.size() ];
		int index = 0;
		for( String username : usernameSet ) {
			keys[ index ] = prefix + ":" + username;
			index++;
		}
		return keys;
	}

	public static String[] toStringArray( int[] nums ) {
		if( nums == null ) {
			return null;
		}

		String[] fields = new String[ nums.length ];
		int index = 0;
		for( Integer num : nums ) {
			fields[ index ] = Integer.toString( num );
			index++;
		}
		return fields;
	}

	public static String[] toStringArray( List<Integer> list ) {
		if( isEmpty( list ) ) {
			return null;
		}
		String[] fields = new String[ list.size() ];
		int index = 0;
		for( Integer num : list ) {
			fields[ index ] = Integer.toString( num );
			index++;
		}
		return fields;
	}

	public static String[] toArray( List<String> list ) {
		if( isEmpty( list ) ) {
			return null;
		}
		String[] fields = new String[ list.size() ];
		int index = 0;
		for( String str : list ) {
			fields[ index ] = str;
			index++;
		}
		return fields;
	}

	@SuppressWarnings( "unchecked" )
	public static <T> T[] toArray( Collection<T> _collection, Class<T> _class ) {
		T[] t = ( T[] )Array.newInstance( _class, _collection.size() );
		return _collection.toArray( t );
		//return t;
	}

	public static List<Integer> toIntList( List<String> members ) {
		if( members == null || members.isEmpty() ) {
			return null;
		}
		List<Integer> result = new ArrayList<Integer>();
		Iterator<String> iterator = members.iterator();
		while( iterator.hasNext() ) {
			String str = iterator.next();
			if( str == null ) {
				result.add( null );
			} else {
				int newsId = Integer.parseInt( str );
				result.add( newsId );
			}
		}
		return result;
	}

	public static List<String> makeList( String prefix, int start, int size ) {
		List<String> list = new ArrayList<String>();
		int end = start + size;
		for( int i = start; i < end; i++ ) {
			list.add( prefix + i );
		}
		return list;
	}

	public static List<Long> makeLongList( String content ) {
		String[] strs = StringUtils.split( content, "," );
		List<Long> list = new ArrayList<Long>();
		for( String str : strs ) {
			str = str.trim();
			long num = Long.parseLong( str );
			list.add( num );
		}
		return list;
	}

	public static List<Integer> makeIntList( String content ) {
		String[] strs = StringUtils.split( content, "," );
		List<Integer> list = new ArrayList<Integer>();
		for( String str : strs ) {
			str = str.trim();
			int num = Integer.parseInt( str );
			list.add( num );
		}
		return list;
	}

	public static List<String> makeList( String content ) {
		String[] strs = StringUtils.split( content, "," );
		List<String> list = new ArrayList<String>();
		for( String str : strs ) {
			str = str.trim();
			list.add( str );
		}
		return list;
	}

	public static List<String> toStringList( List<Integer> numList ) {
		List<String> strList = new ArrayList<String>();
		for( Integer num : numList ) {
			strList.add( Integer.toString( num ) );
		}
		return strList;
	}
	
	/**
	 * 获取LIST 分页数据
	 * @param page  第几页
	 * @param rp    每页多少条
	 * @param length  LIST 长度
	 * @return
	 */
	public static int[] operationListPage( int page, int rp, int length ) {
		int[] a = { 0, 0 };
		if( length <= 0 || page <= 0 || rp <= 0 ) {
			return a;
		}

		int start = ( page - 1 ) * rp;
		int end = start + rp;

		if( start > length ) {
			int newStart = length - rp;
			if( newStart < 0 ) {
				a[ 0 ] = 0;
			} else {
				a[ 0 ] = newStart;
			}
		} else {
			a[ 0 ] = start;
		}

		if( end > length ) {
			a[ 1 ] = length;
		} else {
			a[ 1 ] = end;
		}

		return a;
	}

	/**
	 * 将list中为null的数据清除掉
	 */
	public static void cleanNull( List<?> list ) {
		Iterator<?> iterator = list.iterator();
		while( iterator.hasNext() ) {
			Object obj = iterator.next();
			if( obj == null ) {
				iterator.remove();
			}

		}
	}

	public static void main( String[] args ) {
		List<String> list = new ArrayList<>();
		list.add( "ss" );
		list.add( null );
		list.add( "ss" );
		list.add( null );
		cleanNull( list );
		System.out.println( list.size() );
	}
}
