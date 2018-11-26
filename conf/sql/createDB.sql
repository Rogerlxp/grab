/*
SQLyog Enterprise - MySQL GUI v6.53 RC
MySQL - 5.5.9-log : Database - GRAB
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`GRAB` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `GRAB`;

/*Table structure for table `T_CP` */

DROP TABLE IF EXISTS `T_CP`;

CREATE TABLE `T_CP` (
  `FID` smallint(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'CPID',
  `FCPNAME` varchar(256) NOT NULL COMMENT 'CP名称',
  `FENNAME` varchar(256) NOT NULL COMMENT 'CP英文简称',
  `FURL` varchar(200) DEFAULT '' COMMENT '内容源URL',
  `FICO_URL` varchar(200) DEFAULT '' COMMENT '内容源图标',
  `FEXPRESSIONS` varchar(1000) DEFAULT '' COMMENT '新闻内容正则表达式',
  `FSTATUS` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 未发布，1 已发布',
  `FTYPE` int(11) NOT NULL DEFAULT '0' COMMENT '源提供内容的类型',
  `FAUTOMATIC_CAPTURE` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 手动发布;1 自动发布',
  `FDESCRIPTION` varchar(200) DEFAULT '' COMMENT '源描述',
  `FUPDATE_TIME` datetime NOT NULL DEFAULT '1970-01-01 00:00:00' COMMENT '改修时间',
  `FCREATE_TIME` datetime NOT NULL DEFAULT '1970-01-01 00:00:00' COMMENT '创建时间',
  `FLEVEL` smallint(6) NOT NULL DEFAULT '1' COMMENT '内容源星级',
  `FCLASS_PATH` varchar(128) DEFAULT NULL COMMENT '接口类路径（统一入库时使用）',
  `FINSERT_TYPE` int(4) NOT NULL DEFAULT '1' COMMENT '入库类型 , 位表示：1表示入，0表示不入，第1位：CP库，第2位：内容库，第3位：作者库',
  `FSUPPORT_BIZ` int(4) NOT NULL DEFAULT '1' COMMENT '该CP支持的业务 , 位表示：1表示支持，0表示不支持，第1位：支持全部，第2位：资讯，第3位 , 浏览器，第4位：趣视频',
  PRIMARY KEY (`FID`),
  KEY `IDX_FSUPPORT_BIZ` (`FSUPPORT_BIZ`)
) ENGINE=InnoDB AUTO_INCREMENT=906 DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_CP` */

insert  into `T_CP`(`FID`,`FCPNAME`,`FENNAME`,`FURL`,`FICO_URL`,`FEXPRESSIONS`,`FSTATUS`,`FTYPE`,`FAUTOMATIC_CAPTURE`,`FDESCRIPTION`,`FUPDATE_TIME`,`FCREATE_TIME`,`FLEVEL`,`FCLASS_PATH`,`FINSERT_TYPE`,`FSUPPORT_BIZ`) values (1,'test','test','','','',0,0,0,'test','2018-11-22 11:38:17','2018-11-22 11:38:17',1,NULL,1,1),(905,'wish','wish','','','',1,0,0,'','2018-11-12 15:15:05','2018-11-12 15:15:05',1,NULL,1,1);

/*Table structure for table `T_GRAB` */

DROP TABLE IF EXISTS `T_GRAB`;

CREATE TABLE `T_GRAB` (
  `FID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '爬抓ID',
  `FNAME` varchar(128) NOT NULL COMMENT '接口名称',
  `FURL` varchar(512) NOT NULL COMMENT '爬抓URL',
  `FMETHOD_TYPE` smallint(4) NOT NULL DEFAULT '1' COMMENT '爬抓方式，1：get,2:post entity is json,3:post entity is map',
  `FPARAM` text COMMENT '参数，可带默认值',
  `FHEAD` text COMMENT 'head',
  `FSIGN_ID` int(10) DEFAULT NULL COMMENT '签名规则',
  `FTOKEN_ID` int(10) DEFAULT NULL COMMENT 'token的爬抓ID',
  `FTOKEN_NAME` varchar(128) DEFAULT NULL COMMENT 'token名称',
  `FUSERTOKENRULE` varchar(128) DEFAULT NULL COMMENT 'token用户标识提取规则',
  `FTOKEN_POSITION` smallint(4) DEFAULT '2' COMMENT 'token添加位置',
  `FRULE` text NOT NULL COMMENT '结果提取规则',
  `FORIGINAL_RULE` text COMMENT '原始提取规则',
  `FSITE_ID` int(10) unsigned DEFAULT NULL COMMENT '站点配置',
  `FCPID` int(4) unsigned NOT NULL COMMENT 'CPID',
  `FCREATE_TIME` datetime DEFAULT NULL,
  `FUPDATE_TIME` datetime DEFAULT NULL,
  PRIMARY KEY (`FID`)
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_GRAB` */

insert  into `T_GRAB`(`FID`,`FNAME`,`FURL`,`FMETHOD_TYPE`,`FPARAM`,`FHEAD`,`FSIGN_ID`,`FTOKEN_ID`,`FTOKEN_NAME`,`FUSERTOKENRULE`,`FTOKEN_POSITION`,`FRULE`,`FORIGINAL_RULE`,`FSITE_ID`,`FCPID`,`FCREATE_TIME`,`FUPDATE_TIME`) values (170,'wish商品按分类爬取','https://www.wish.com/api/feed/get-filtered-feed',3,'{\"paramMap\":{\"offset\":0,\"count\":20,\"request_branded_filter\":false,\"request_categories\":false,\"request_id\":\"tag_53dc186421a86318bdc87f0f\"}}','[{\"headName\":\"cookie\",\"headValue\":\"__utmz=96128154.1534495269.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; cto_lwid=d12b9b1c-fbe4-41d2-bbff-fec566ee57c4; bsid=e00693542f50442f806f9463022436d6; __utma=96128154.1057994720.1534495269.1534495269.1534730933.2; sweeper_session=\\\"2|1:0|10:1534730954|15:sweeper_session|84:MjE1YjE3MDgtNDhjNi00ZWY0LTk4YjAtYmM1ZDkzNDhjNjFjMjAxOC0wOC0yMCAwMjowOToxMS4zMzM2OTc=|9286b3235b57ac0bab478ef742cff7ac5e22cb6c80ea21cbfbae18d3098f82c5\\\"; sessionRefreshed_5b76edb4489ca116acbac0a2=true; G_ENABLED_IDPS=google; __stripe_mid=56fe552c-6a6e-482c-b73b-83e797a88951; __stripe_sid=271f804e-3bd9-4475-a2cc-7fea7159ce68; _xsrf=2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981; _timezone=-8; sweeper_uuid=6af38aeb19b24bd394bf9a9adf2c52c4; _ga=GA1.2.1057994720.1534495269; _gid=GA1.2.252976855.1534745984; _gat_gtag_UA_27166730_24=1\"},{\"headName\":\"origin\",\"headValue\":\"https://www.wish.com\"},{\"headName\":\"referer\",\"headValue\":\"https://www.wish.com/feed/tag_53dc186421a86318bdc87f0f\"},{\"headName\":\"user-agent\",\"headValue\":\"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36\"},{\"headName\":\"x-xsrftoken\",\"headValue\":\"2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981\"}]',NULL,NULL,NULL,NULL,NULL,'{\"grabResultDataStatus\":{\"codeSchema\":{\"expression\":\"$.code\",\"name\":\"code\",\"objectType\":\"OBJECT\"},\"errorCodeMap\":null,\"success\":[\"0\"]},\"jsonpMethod\":null,\"nextUrls\":null,\"resultSchemaTree\":{\"nextNode\":{\"nextNode\":null,\"params\":[{\"expression\":\"$.contest_selected_picture\",\"name\":\"img\",\"objectType\":\"OBJECT\"},{\"expression\":\"$.id\",\"name\":\"id\",\"objectType\":\"OBJECT\"}],\"schema\":{\"expression\":\"$.data.products\",\"name\":\"img\",\"objectType\":\"LIST\"},\"spread\":false},\"params\":[],\"schema\":{\"expression\":\"$\",\"name\":\"ruselt\",\"objectType\":\"OBJECT\"},\"spread\":true},\"type\":\"JSON\"}','{\"baseRule\":\"$.data.products[*]\",\"params\":[{\"name\":\"img\",\"rule\":\"$.data.products[*].contest_selected_picture\"},{\"name\":\"id\",\"rule\":\"$.data.products[*].id\"}]}',NULL,1,'2018-08-28 18:41:58','2018-11-12 15:51:24'),(171,'wish商品按分类爬取','https://www.wish.com/api/feed/get-filtered-feed',3,'{\"paramMap\":{\"offset\":0,\"count\":20,\"request_branded_filter\":false,\"request_categories\":false,\"request_id\":\"tag_53dc186421a86318bdc87f0f\"}}','[{\"headName\":\"cookie\",\"headValue\":\"__utmz=96128154.1534495269.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; cto_lwid=d12b9b1c-fbe4-41d2-bbff-fec566ee57c4; bsid=e00693542f50442f806f9463022436d6; __utma=96128154.1057994720.1534495269.1534495269.1534730933.2; sweeper_session=\\\"2|1:0|10:1534730954|15:sweeper_session|84:MjE1YjE3MDgtNDhjNi00ZWY0LTk4YjAtYmM1ZDkzNDhjNjFjMjAxOC0wOC0yMCAwMjowOToxMS4zMzM2OTc=|9286b3235b57ac0bab478ef742cff7ac5e22cb6c80ea21cbfbae18d3098f82c5\\\"; sessionRefreshed_5b76edb4489ca116acbac0a2=true; G_ENABLED_IDPS=google; __stripe_mid=56fe552c-6a6e-482c-b73b-83e797a88951; __stripe_sid=271f804e-3bd9-4475-a2cc-7fea7159ce68; _xsrf=2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981; _timezone=-8; sweeper_uuid=6af38aeb19b24bd394bf9a9adf2c52c4; _ga=GA1.2.1057994720.1534495269; _gid=GA1.2.252976855.1534745984; _gat_gtag_UA_27166730_24=1\"},{\"headName\":\"origin\",\"headValue\":\"https://www.wish.com\"},{\"headName\":\"referer\",\"headValue\":\"https://www.wish.com/feed/tag_53dc186421a86318bdc87f0f\"},{\"headName\":\"user-agent\",\"headValue\":\"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36\"},{\"headName\":\"x-xsrftoken\",\"headValue\":\"2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981\"}]',NULL,NULL,NULL,NULL,NULL,'{\"grabResultDataStatus\":{\"codeSchema\":{\"expression\":\"$.code\",\"name\":\"code\",\"objectType\":\"OBJECT\"},\"errorCodeMap\":{},\"success\":[\"0\"]},\"resultSchemaTree\":{\"nextNode\":{\"params\":[{\"expression\":\"$.contest_selected_picture\",\"name\":\"img\",\"objectType\":\"OBJECT\"},{\"expression\":\"$.id\",\"name\":\"id\",\"objectType\":\"OBJECT\"}],\"schema\":{\"expression\":\"$.data.products\",\"name\":\"img\",\"objectType\":\"LIST\"},\"spread\":false},\"params\":[],\"schema\":{\"expression\":\"$\",\"name\":\"ruselt\",\"objectType\":\"OBJECT\"},\"spread\":true},\"type\":\"JSON\"}','{\"baseRule\":\"$.data.products[*]\",\"params\":[{\"name\":\"img\",\"rule\":\"$.data.products[*].contest_selected_picture\"},{\"name\":\"id\",\"rule\":\"$.data.products[*].id\"}]}',NULL,1,'2018-08-29 11:09:56','2018-11-22 14:42:51'),(172,'wish商品按分类爬取','https://www.wish.com/api/feed/get-filtered-feed',3,'{\"paramMap\":{\"offset\":0,\"count\":20,\"request_branded_filter\":false,\"request_categories\":false,\"request_id\":\"tag_53dc186421a86318bdc87f0f\"}}','[{\"headName\":\"cookie\",\"headValue\":\"__utmz=96128154.1534495269.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; cto_lwid=d12b9b1c-fbe4-41d2-bbff-fec566ee57c4; bsid=e00693542f50442f806f9463022436d6; __utma=96128154.1057994720.1534495269.1534495269.1534730933.2; sweeper_session=\\\"2|1:0|10:1534730954|15:sweeper_session|84:MjE1YjE3MDgtNDhjNi00ZWY0LTk4YjAtYmM1ZDkzNDhjNjFjMjAxOC0wOC0yMCAwMjowOToxMS4zMzM2OTc=|9286b3235b57ac0bab478ef742cff7ac5e22cb6c80ea21cbfbae18d3098f82c5\\\"; sessionRefreshed_5b76edb4489ca116acbac0a2=true; G_ENABLED_IDPS=google; __stripe_mid=56fe552c-6a6e-482c-b73b-83e797a88951; __stripe_sid=271f804e-3bd9-4475-a2cc-7fea7159ce68; _xsrf=2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981; _timezone=-8; sweeper_uuid=6af38aeb19b24bd394bf9a9adf2c52c4; _ga=GA1.2.1057994720.1534495269; _gid=GA1.2.252976855.1534745984; _gat_gtag_UA_27166730_24=1\"},{\"headName\":\"origin\",\"headValue\":\"https://www.wish.com\"},{\"headName\":\"referer\",\"headValue\":\"https://www.wish.com/feed/tag_53dc186421a86318bdc87f0f\"},{\"headName\":\"user-agent\",\"headValue\":\"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36\"},{\"headName\":\"x-xsrftoken\",\"headValue\":\"2|59fb7a24|9715ca3d935a1a704940372dfaf2b9be|1534745981\"}]',NULL,NULL,NULL,NULL,NULL,'{\"grabResultDataStatus\":{\"codeSchema\":{\"expression\":\"$.code\",\"name\":\"code\",\"objectType\":\"OBJECT\"},\"errorCodeMap\":{},\"success\":[\"2\"]},\"resultSchemaTree\":{\"params\":[{\"expression\":\"$.data.products[*].contest_selected_picture\",\"name\":\"img\",\"objectType\":\"LIST\"},{\"expression\":\"$.data.products[*].id\",\"name\":\"id\",\"objectType\":\"LIST\"}],\"schema\":{\"expression\":\"$\",\"name\":\"ruselt\",\"objectType\":\"OBJECT\"},\"spread\":false},\"type\":\"JSON\"}','{\"baseRule\":\"$.data.items[*]\",\"params\":[{\"name\":\"img\",\"rule\":\"$.data.products[*].contest_selected_picture\"},{\"name\":\"id\",\"rule\":\"$.data.products[*].id\"}]}',NULL,1,'2018-11-12 15:50:49','2018-11-23 17:28:12'),(173,'联系人','http://home.meizu.cn/home.php?mod=space&uid=1',1,'{\"paramMap\":{\"uid\":1}}',NULL,NULL,NULL,NULL,NULL,NULL,'{\"grabResultDataStatus\":{\"codeSchema\":{\"expression\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[3]/text()\",\"name\":\"code\",\"objectType\":\"OBJECT\"},\"errorCodeMap\":null,\"success\":[\"gender_\"]},\"jsonpMethod\":null,\"nextUrls\":[{\"grabId\":173,\"paramSchemas\":[{\"elRule\":\"return  Integer.valueOf(uid.toString())+1;\",\"expression\":null,\"name\":\"uid\",\"objectType\":null}],\"priority\":null,\"schemas\":null}],\"resultSchemaTree\":{\"nextNode\":null,\"params\":[{\"expression\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[1]/text()\",\"name\":\"name\",\"objectType\":\"OBJECT\"},{\"expression\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[2]/text()\",\"name\":\"phone\",\"objectType\":\"OBJECT\"},{\"expression\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[5]/text()\",\"name\":\"job\",\"objectType\":\"OBJECT\"},{\"expression\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[6]/text()\",\"name\":\"num\",\"objectType\":\"OBJECT\"},{\"expression\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[7]/text()\",\"name\":\"department\",\"objectType\":\"OBJECT\"}],\"schema\":{\"expression\":\"/\",\"name\":\"ruselt\",\"objectType\":\"OBJECT\"},\"spread\":false},\"type\":\"HTML\"}','{\"baseRule\":\"/\",\"params\":[{\"name\":\"name\",\"rule\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[1]/text()\"},{\"name\":\"phone\",\"rule\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[2]/text()\"},{\"name\":\"job\",\"rule\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[5]/text()\"},{\"name\":\"num\",\"rule\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[6]/text()\"},{\"name\":\"department\",\"rule\":\"//div[@class=\'pbm mbm bbda cl\']/ul/li[7]/text()\"}]}',NULL,1,'2018-11-23 18:16:49','2018-11-26 11:51:22');

/*Table structure for table `T_GRAB_ERROR_CODE` */

DROP TABLE IF EXISTS `T_GRAB_ERROR_CODE`;

CREATE TABLE `T_GRAB_ERROR_CODE` (
  `FID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FTYPE` int(11) DEFAULT '5' COMMENT '处理类型，对应ErrorTypeEnum，5：异常无需处理',
  `FDESC` varchar(512) DEFAULT NULL COMMENT '异常状态描述',
  PRIMARY KEY (`FID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_GRAB_ERROR_CODE` */

insert  into `T_GRAB_ERROR_CODE`(`FID`,`FTYPE`,`FDESC`) values (1,4,'刷新token'),(2,8,'没有更多了');

/*Table structure for table `T_GRAB_LOG` */

DROP TABLE IF EXISTS `T_GRAB_LOG`;

CREATE TABLE `T_GRAB_LOG` (
  `FID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FGRABID` int(11) NOT NULL COMMENT '爬抓ID',
  `FPROCESS_TYPE` smallint(6) DEFAULT NULL COMMENT '过程，对应HandleProcessEnum',
  `FERROR_TYPE` smallint(6) DEFAULT NULL COMMENT '异常类型，对应ErrorTypeEnum',
  `FDATA_CODE` int(10) DEFAULT NULL COMMENT '数据异常时对应code',
  `FMESSAGE` varchar(512) DEFAULT NULL COMMENT '异常信息',
  `FCREATE_TIME` datetime DEFAULT NULL COMMENT '写入时间',
  PRIMARY KEY (`FID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_GRAB_LOG` */

insert  into `T_GRAB_LOG`(`FID`,`FGRABID`,`FPROCESS_TYPE`,`FERROR_TYPE`,`FDATA_CODE`,`FMESSAGE`,`FCREATE_TIME`) values (1,170,2,2,NULL,'返回非正常http code,code:403','2018-11-12 15:53:06'),(2,173,3,6,NULL,'返回code为null','2018-11-26 12:51:50'),(3,173,3,6,NULL,'返回code为null','2018-11-26 12:53:11'),(4,173,3,6,NULL,'返回code为null','2018-11-26 12:56:14'),(5,173,3,6,NULL,'返回code为null','2018-11-26 12:58:02');

/*Table structure for table `T_GRAB_MAPPING` */

DROP TABLE IF EXISTS `T_GRAB_MAPPING`;

CREATE TABLE `T_GRAB_MAPPING` (
  `FID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FGRABID` int(11) NOT NULL COMMENT '爬抓定义ID',
  `FMAPPINGSCHEMA` text COMMENT '字段映射',
  `FFIXED_VALUE` text COMMENT '添加固定值,如CPID，TYPE',
  `FMAPPING_VALUE` text COMMENT '对应映射mapping',
  `FMODEID` int(11) NOT NULL COMMENT '模型ID，对应EntityTypeEnum',
  `FCREATE_TIME` date DEFAULT NULL,
  `FUPDATE_TIME` date DEFAULT NULL,
  PRIMARY KEY (`FID`),
  UNIQUE KEY `NewIndex1` (`FGRABID`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_GRAB_MAPPING` */

insert  into `T_GRAB_MAPPING`(`FID`,`FGRABID`,`FMAPPINGSCHEMA`,`FFIXED_VALUE`,`FMAPPING_VALUE`,`FMODEID`,`FCREATE_TIME`,`FUPDATE_TIME`) values (109,170,'[{\"keyName\":\"img\",\"valNames\":[\"img\"]},{\"keyName\":\"id\",\"valNames\":[\"id\"]}]',NULL,NULL,2,'2018-08-28','2018-08-28'),(111,173,'[]',NULL,NULL,4,'2018-11-23','2018-11-23');

/*Table structure for table `T_GRAB_MAPPING_FIELD` */

DROP TABLE IF EXISTS `T_GRAB_MAPPING_FIELD`;

CREATE TABLE `T_GRAB_MAPPING_FIELD` (
  `FID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '字段ID',
  `FMODEID` int(10) unsigned NOT NULL COMMENT '对应模型ID',
  `FFIELD` varchar(32) NOT NULL COMMENT '字段名称',
  `FTYPE` varchar(32) DEFAULT NULL COMMENT '字段类型',
  `FDESC` varchar(128) DEFAULT NULL COMMENT '字段描述',
  PRIMARY KEY (`FID`),
  UNIQUE KEY `NewIndex1` (`FMODEID`,`FFIELD`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_GRAB_MAPPING_FIELD` */

insert  into `T_GRAB_MAPPING_FIELD`(`FID`,`FMODEID`,`FFIELD`,`FTYPE`,`FDESC`) values (34,1,'token','字符串','token'),(35,1,'expires','整型','到期时间，单位秒'),(36,2,'id','字符串','商品ID'),(37,2,'cpId','整型','CP'),(38,2,'name','字符串','名称'),(39,2,'desc','字符串','描述'),(40,2,'img','字符串','导购图片'),(41,2,'detail_img','字符串列表','详情图片'),(42,2,'ori_price','BigDecimal','原价'),(43,2,'real_price','BigDecimal','实价'),(44,2,'ori_price_us','BigDecimal','原价按美元计'),(45,2,'real_price_us','BigDecimal','实价按美元计'),(46,2,'shipping_price','BigDecimal','运费'),(47,2,'shipping_price_us','BigDecimal','运费按美元计'),(48,2,'inventory','整型','库存'),(49,2,'sales','整型','销量'),(50,2,'comment','整型','评论数量'),(51,2,'positive','整型','正面评价占比'),(52,2,'cpCategroyId','字符串','分类'),(53,2,'mer_id','字符串','商户ID'),(54,2,'cpCreateTime','日期','CP入库时间'),(55,2,'cpUpdateTime','日期','CP更新时间'),(56,3,'mer_id','字符串','商品ID'),(57,3,'mer_cpId','整型','CP'),(58,3,'mer_name','字符串','名称'),(59,3,'mer_desc','字符串','描述'),(60,3,'mer_img','字符串','商户封面'),(62,3,'mer_sales','整型','销量'),(63,3,'mer_count','整型','商户商品数量'),(64,3,'mer_comment','整型','商户评论数量'),(65,3,'mer_positive','整型','商户正面评论占比'),(68,3,'mer_cpCreateTime','日期','CP入库时间'),(69,3,'mer_cpUpdateTime','日期','CP更新时间'),(70,3,'mer_cpCategroyId','字符串','分类'),(72,2,'mer_name','字符串','商户名称'),(73,2,'mer_desc','字符串','商户描述'),(74,2,'mer_img','字符串','商户封面'),(75,2,'mer_cpCategroyId','字符串','商户分类'),(76,2,'mer_sales','整型','商户销量'),(77,2,'mer_count','整型','商户商品数量'),(78,2,'mer_comment','整型','商户评论数量'),(79,2,'mer_positive','整型','商户正面评论占比'),(80,2,'mer_cpCreateTime','日期','商户CP入库时间'),(81,2,'mer_cpUpdateTime','日期','商户CP更新时间'),(82,3,'mer_extMap','Map','扩展字段'),(83,2,'extMap','Map','扩展字段'),(84,2,'mer_extMap','Map','商户扩展字段');

/*Table structure for table `T_GRAB_MAPPING_MODE` */

DROP TABLE IF EXISTS `T_GRAB_MAPPING_MODE`;

CREATE TABLE `T_GRAB_MAPPING_MODE` (
  `FID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '模型ID',
  `FCLASS_BEAN` varchar(128) DEFAULT NULL COMMENT '对应实体',
  `FDESC` varchar(128) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`FID`),
  UNIQUE KEY `NewIndex1` (`FCLASS_BEAN`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_GRAB_MAPPING_MODE` */

insert  into `T_GRAB_MAPPING_MODE`(`FID`,`FCLASS_BEAN`,`FDESC`) values (1,'com.roger.grab.base.domain.grab.GrabToken','CP token 模型'),(2,'com.roger.grab.base.domain.grab.Commodity','商品类'),(3,'com.roger.grab.base.domain.grab.Merchant','商户类'),(4,NULL,'MAP原样返回');

/*Table structure for table `T_GRAB_SIGN` */

DROP TABLE IF EXISTS `T_GRAB_SIGN`;

CREATE TABLE `T_GRAB_SIGN` (
  `FID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '签名规则ID',
  `FCPID` int(10) NOT NULL COMMENT 'CPID',
  `FREMARK` varchar(128) NOT NULL COMMENT '备注名称',
  `FNAME` varchar(128) NOT NULL COMMENT '签名后参数名',
  `FTYPE` smallint(4) NOT NULL DEFAULT '1' COMMENT '签名类型，1：MD5，2：SHA1',
  `FPOSITION` smallint(4) NOT NULL DEFAULT '2' COMMENT '签名串添加位置，1：head,2:URL,3:entity',
  `FSIGN_ORDER_TYPE` smallint(4) NOT NULL DEFAULT '1' COMMENT '签名字符串生成顺序：1：指定，2：按参数key正序，3：按参数Key逆序，4：按value正序，按value逆序',
  `FPARAM` text NOT NULL COMMENT '签名参数列表',
  `FSINGLE_PARAM_FORMAT` varchar(128) NOT NULL COMMENT '单个签名串格式，如{key}={value}',
  `FBEGIN` varchar(128) DEFAULT NULL COMMENT '开始串',
  `FEND` varchar(128) DEFAULT NULL COMMENT '结束串',
  `FSPLICE` varchar(128) DEFAULT NULL COMMENT '中间拼接串',
  `FSIGNKEY` varchar(512) DEFAULT NULL COMMENT 'sign用的key参与参数排序时',
  `FHAS_LAST_SPLICE` smallint(4) NOT NULL DEFAULT '0' COMMENT '是否保留最后拼接字符',
  `FCREATE_TIME` datetime DEFAULT NULL,
  `FUPDATE_TIME` datetime DEFAULT NULL,
  PRIMARY KEY (`FID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_GRAB_SIGN` */

/*Table structure for table `T_GRAB_TASK` */

DROP TABLE IF EXISTS `T_GRAB_TASK`;

CREATE TABLE `T_GRAB_TASK` (
  `FID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FGRABID` int(10) unsigned NOT NULL COMMENT '爬抓ID',
  `FPARAM` text COMMENT '爬抓参数',
  `FSPACE` int(10) NOT NULL COMMENT '间隔时长，单位秒',
  `FNEXT_RUN_TIME` int(11) DEFAULT '0' COMMENT '下次运行时间',
  `FLAST_RUN_TIME` int(11) DEFAULT NULL COMMENT '上次运行时间',
  `FSTATUS` smallint(4) NOT NULL DEFAULT '0' COMMENT '状态：1：运行，2：停用',
  `FCREATE_TIME` datetime DEFAULT NULL COMMENT '创建时间',
  `FUPDATE_TIME` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`FID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Data for the table `T_GRAB_TASK` */

insert  into `T_GRAB_TASK`(`FID`,`FGRABID`,`FPARAM`,`FSPACE`,`FNEXT_RUN_TIME`,`FLAST_RUN_TIME`,`FSTATUS`,`FCREATE_TIME`,`FUPDATE_TIME`) values (1,173,'{\"uid\":3}',3600,1543211827,1543208227,1,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
