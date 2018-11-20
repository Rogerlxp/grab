const connection = require('../mySql/connection');
const logger = require('./logger');
module.exports = {
    connection,
    query(sqlStr){
        return new Promise((resolve, reject)=>{
            try{
                connection.query(sqlStr, (err, res)=>{
                    if(err){
                        logger.error('exec sql query error: ');
                        logger.error(sqlStr);
                        logger.error(err);
                        reject(err);
                        throw err;
                    }
                    resolve(res);
                });
            }catch(error){
                logger.error('exec sql query error: ');
                logger.error(sqlStr);
                reject(err);
            }
        });
    }
};