const winston = require('winston');
const {combine, timestamp, prettyPrint, simple, printf} = winston.format;
const path = require('path');
const fs = require('fs-extra');
const logPath = path.join(global.setting.cwd, 'log');
fs.emptyDirSync(logPath);
const errorLogPath = path.join(logPath, 'error.log');
const combinedLogPath = path.join(logPath, 'combined.log');
const exceptionsLogPath = path.join(logPath, 'exceptions.log');

fs.ensureFileSync(errorLogPath);
fs.ensureFileSync(combinedLogPath);
fs.ensureFileSync(exceptionsLogPath);
const logLevels = {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      sql: 4,
      debug: 5
    },
    colors: {
      error: "red",
      warn: "darkred",
      info: "black",
      http: "green",
      sql: "blue",
      debug: "gray"
    }
};
winston.addColors(logLevels);
// const alignedWithColorsAndTime = winston.format.combine(
//     winston.format.colorize(),
//     winston.format.timestamp(),
//     winston.format.align(),
//     winston.format.printf((info) => {
//       const {
//         timestamp, level, message, ...args
//       } = info;

//       const ts = timestamp.slice(0, 19).replace('T', ' ');
//       return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
//     }),
// );
// const timestamp = function(){
//     let date = new Date();
//     const years = date.getFullYear();
//     const months = date.getMonth + 1;
//     const day = date.getDate();
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const seconds = date.getSeconds();
//     return `${years}年${months}月${day}日-${hours}:${minutes}:${seconds}`;
// }
const createOptions = {
    level: 'verbose',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({filename: errorLogPath, level: 'error'}),
        new winston.transports.File({filename: combinedLogPath})
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: exceptionsLogPath })
    ]
};
const logger = winston.createLogger(createOptions);
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (global.setting.isDev) {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
    }));
}
module.exports = logger;