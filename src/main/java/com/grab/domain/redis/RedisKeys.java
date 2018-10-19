package com.grab.domain.redis;

import com.grab.common.util.StringUtil;
import com.grab.enums.grab.ErrorTypeEnum;
import com.grab.enums.grab.HandleProcessEnum;
import com.grab.enums.grab.StatusEnum;

public class RedisKeys {

	/*
	 * 不同的结构类型 请加上通用前缀 Hash: h SortedSet: z HyperLogLog: p List: l Set: s
	 * String: 无
	 */

	// 分key分割粒度
	public static final int SPLIT_SIZE_1000 = 1000;

	// 分key分割粒度
	public static final int SPLIT_SIZE_10000 = 10000;

	/**
	 * 文章相关缓存
	 */
	public static class ContentRedisKey {
		/**
		 * 文章id映射 缓存key
		 * @param index
		 * @return
		 */
		public static String getContentIdMappingKey( int cpId, String cpEntityId ) {
			// 格式: h:id_mapping_{Math.abs( String.format( "%d-%s", cpId, cpEntityId ).hashCode() ) % 10000}_{cpId}_{cpEntityId}
			return String.format( "h:id_mapping_%d_%d_%s", Math.abs( String.format( "%d-%s", cpId, cpEntityId ).hashCode() ) % SPLIT_SIZE_10000, cpId, cpEntityId );
		}

		//		/**
		//		 * cp文章id映射 缓存key 文章详情缓存包含了此缓存
		//		 * @param contentId
		//		 * @return
		//		 */
		//		public static String getCpEntityIdMappingKey( long contentId ) {
		//			// 格式: h:id_mapping_{Math.abs( String.format( "%d-%s", cpId, cpEntityId ).hashCode() ) % 10000}_{cpId}_{cpEntityId}
		//			return String.format( "h:cpid_mapping_%d_%d", Math.abs( String.format( "%d-%s", cpId, cpEntityId ).hashCode() ) % SPLIT_SIZE_10000, contentId );
		//		}

		/**
		 * 文章详情映 缓存key
		 */

		public static final String content_detail_key = "content";

		public static final String content_id_mapping_key = "content:mapping";

		public static final String content_feature_stat_key = "content:feature:stat";

	}

	/**
	 * 作者相关缓存
	 */
	public static class AuthorRedisKey {

		// 全量定时任务,处理资讯文章生成作者,当前处理到的id key
		public static final String author_article_all_startid_key = "author_article_all_startid";

		// 增量定时任务,处理资讯文章生成作者,当前处理到的id key
		public static final String author_article_increment_startid_key = "author_article_increment_startid";

		//作者id对应作者详情缓存key
		public static final String author_detail="h:author_detail";

		//内容id对应作者id映射
		public static final String authorid_contentid="authorid:contentid";
		
		/**
		 * 作者名 缓存key
		 * @param index
		 * @return
		 */
		public static String getAuthorNameKey( String authorName ) {
			// 格式: h:author_name_{Math.abs( imei.hashCode() ) % 1000}
			return String.format( "h:author_name_%d", Math.abs( authorName.hashCode() ) % SPLIT_SIZE_1000 );
		}

		// 作者文章增量数 key Format
		public static final String AUTHOR_ARTICLE_INC_KEY_FORMAT = "z:author:content:incr:%d";

		/**
		 * 作者文章增量数 key
		 * @param authorId
		 * @return
		 */
		public static String getAuthorArticleIncKey( int authorId ) {
			return String.format( AUTHOR_ARTICLE_INC_KEY_FORMAT, authorId % SPLIT_SIZE_1000 );
		}

		// 作者视频增量数 key Format
		public static final String AUTHOR_VIDEO_INC_KEY_FORMAT = "z:author:video:incr:%d";

		/**
		 * 作者视频增量数 key
		 * @param authorId
		 * @return
		 */
		public static String getAuthorVideoIncKey( int authorId ) {
			return String.format( AUTHOR_VIDEO_INC_KEY_FORMAT, authorId % SPLIT_SIZE_1000 );
		}
	}

	/**
	 * 数据检测相关缓存
	 */
	public static class DataCheckKey {

		// 数据检测 各cp上次检测到的时间
		public static String getDataCheckStaritTimeKey( int cpId ) {
			return String.format( "data:check:start:time:%d", cpId );
		}
	}

	/**
	 * 缓存过期时间
	 */
	public static class RedisExpire {
		// 3分钟 3*60=180
		public static final int MIN_3 = 180;

		// 1小时 60*60=3600
		public static final int HOUR_1 = 3600;

		// 6小时 60*60*6=3600
		public static final int HOUR_6 = 21600;

		public static final int HOUR_12 = 43200;

		public static final int HOUR_24 = 86400;

		public static final int DAY_10 = 864000;
	}

	/**
	 * 数据检测相关缓存
	 */
	public static class SecurityDataKey {
		// 用户兜底次数
		public static String getSecurityDataCountKey( String imei ) {
			return String.format( "z:data:security:count:%d", Math.abs( imei.hashCode() ) % SPLIT_SIZE_1000 );

		}

		// 兜底数据
		public static String getSecurityDataKey( int page ) {
			return String.format( "h:data:security:%d", page );
		}
	}

	public static class ArticleDuplicateCheck {

		private static final String HASH_CODE_KEY_FORMAT = "m:article:duplicate:check:keyPartition_%d:%d";


		private static final String TOTAL_NODE_SIZE = "s:total:node:size";

		public static String getHashCodeKey( long currentNode, long hashcode ) {
			return String.format( HASH_CODE_KEY_FORMAT,currentNode, hashcode % SPLIT_SIZE_1000 );
		}

		public static String getTotalNodeSize() {
			return TOTAL_NODE_SIZE;
		}

	}

	/**
	 * 短视频相关缓存
	 * @author Roger
	 *
	 */
	public static class ShortVideo {

		// 短视频缓存播放地址时长
		public static final Integer SHORTVIDEO_PLAY_URL_CACHE_TIME = 3600;

		// 
		private static final String SHORTVIDEO_PLAY_URL_CACHE_SET = "shortvideo_play_url_cache_set%s";
		/**
		 *短视频缓存，播放地址过期set
		 * @param authorId
		 * @return
		 */
		public static String getShortVideoCacheSet( String category ) {
			return String.format( SHORTVIDEO_PLAY_URL_CACHE_SET, category );
		}



		/**
		 * 播放地址 key
		 * @param authorId
		 * @return
		 */
		public static String getShortVideoPlayUrl( String videoId ) {
			return String.format( "sv:pu:%s", videoId );
		}

		/**
		 * 视频对象
		 * @param authorId
		 * @return
		 */
		public static String getShortVideoObj( String videoId ) {
			return String.format( "sv:obj:%s", videoId );
		}

	}
	/**
	 * 爬虫缓存
	 * @author Roger
	 *
	 */
	public static class Grab {
		//爬抓队列最大长充
		public static final Integer GRAB_QUEUE_MAX_SIZE = 10000000;
		//爬抓队列
		public static final String GRAB_QUEUE = "GRAB_QUEUE";
		//token key
		public static final String getToken(Integer grabId) { 
			return String.format( "GRAB_T:%s", grabId );
		}
		public static String getToken(Integer tokenGrabId, String tokenUserId) {
			if(StringUtil.isEmpty(tokenUserId)) {
				return getToken(tokenGrabId);
			}
			return String.format( "GRAB_T:%s_%s", tokenGrabId,tokenUserId );
		}
		//ref token count
		public static final String getRefTokenCount(Integer grabId) { 
			return String.format( "GRAB_T_R_C:%s", grabId );
		}


		//爬虫统计计数key
		public static final String getGrabStatisticsKey(String grabId) {
			return String.format( "GRAB:STA:%s", grabId );
		}
		//爬虫统计计数key，按时间段统计
		public static final String getGrabStatisticsKey(String grabId,String time) {
			return String.format( "GRAB:STA:%s_%s", grabId,time );
		}

		//爬虫统计计数field
		public static final String getGrabStatisticsField(StatusEnum statusEnum,HandleProcessEnum handleProcessEnum,ErrorTypeEnum errorTypeEnum) {
			String name = null;
			if(errorTypeEnum!=null) {
				name = String.valueOf(errorTypeEnum.getId());
			}
			if(name == null && handleProcessEnum !=null) {
				name =String.valueOf(handleProcessEnum.getId());
			}
			if(name == null) {
				name = "";
			}
			return String.format( "%s:%s", statusEnum.getName(),name);
		}

		public static final String GRAB="GRAB_S";
		public static final String GRAB_SIGN="GRAB:SIGN";
		public static final String GRAB_MAPPING="GRAB_MAPPING_S";
		public static final String PARAM_CONFIG="PARAM_CONFIG";
		public static final String PARAM_MAPPING="PARAM_MAPPING";

	}

	/**
	 * id相关相关缓存
	 */
	public static class IdSignRedisKey {
		/**
		 * id生成器 服务器占位值 缓存key
		 * @return
		 */
		public static String getLastSignKey() {
			return "lastSign";
		}

		/**
		 * id生成器 服务器占位值当前ip 缓存key
		 * @param index
		 * @return
		 */
		public static String getIpBySignKey(int sign) {
			return String.format("signIp_%d", sign) ;
		}
	}

	/**
	 * 新转码规则相关缓存
	 */
	public static class FunctionRedisKey {
		/**
		 * 最后配置版本 缓存key
		 * @return
		 */
		public static String getLastVersionKey() {
			return "function_version";
		}

		/**
		 * 转码配置 缓存key
		 * @return
		 */
		public static String getFunctionConfigKey(long version) {
			return String.format("function_config_%d", version);
		}
	}

	public static class ParamterKey{
		public static String getSensitiveTripMapKey(){
			return "SENSITIVE_TRIPMAP_KEY";
		}
	}

	/**
	 * cp接口Token相关缓存
	 */
	public static class CpTokenRedisKey {
		public static String getCpTokenRedisKey( int cpId, String biz ) {
			return String.format("cpToken_%d_%s", cpId, biz);
		}
	}

	/**
	 * 数据接入相关统计key
	 * @param yyyyMMdd
	 * @param dataAccessStat
	 * @return
	 */
	public static String getDataAccessStatisticsKey( String yyyyMMdd, String dataAccessStatType ) {
		//		 z:article_stat_{date}_{type} {cp}
		return String.format("z:article_stat_%s_%s", yyyyMMdd, dataAccessStatType);
	}

	/**
	 * 头条虚拟用户token key
	 * @return
	 */
	public static String getTouTiaoTokenKey() {
		return String.format("h:toutiao_token");
	}

	/**
	 * 用户下发的视频 检测状态 key
	 * @return
	 */
	public static String getCheckStatusKey(int cpId, String cpEntityId) {
		// checkstatus_2_111111  20180615121212_1";
		return String.format("checkstatus_%d_%s", cpId, cpEntityId);
	}

//	/**
//	 * 用户下发的视频  key(按天分key保存,第二天定时任务检测状态)
//	 * @return
//	 */
//	public static String getIssueContentKey(String yyMMdd, int cpId, String cpEntityId) {
//		// issue_content_180628_1";
//		return String.format("issue_content_%s_%d", yyMMdd, Math.abs( String.format( "%d_%s", cpId, cpEntityId ).hashCode() ) % SPLIT_SIZE_1000);
//	}
	
	/**
	 * 用户下发的视频  key
	 * @return
	 */
	public static String getIssueContentKey() {
		return String.format("issue_content");
	}

//	/**
//	 * 用户下发的视频  key(按天分key保存,第二天定时任务检测状态)
//	 * @return
//	 */
//	public static String getIssueContentKey(String yyMMdd, int num) {
//		// issue_content_180628_1";
//		return String.format("issue_content_%s_%d", yyMMdd, num);
//	}
	
	/**
	 * 英威诺精品文章接口参数 key
	 * @return
	 */
	public static String getInvenoFineArticelParamKey() {
		return "inveno_fine_artice_param";
	}
}
