1、使用maven 打包生成zip包
2、将manage-nodeJs-0.0.1-SNAPSHOT-node-server.zip 解压
3、进入解压目录，运行 npm i --production 安装依赖
4、node server/index.js 或者  npm start 运行nodeJs

出现线上模式与开发模式问题（拷贝线上 production 到 开发文件夹 development）
nodeJs数据库配置 out/node-server/server/mysql/connection.js