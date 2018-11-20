const elasticsearch = require('elasticsearch');
const productionIp = '172.16.185.49:9300';
const developmentIp = '172.16.185.49:9100';

const elasticsearchLib = {
    client: null,
    init(){
        elasticsearchLib.client = new elasticsearch.Client({
            host: global.setting.isPrd ? productionIp : developmentIp,
            log: 'trace'
        });
        // client.ping({
        //     requestTimeout: 30000,
        //   }, function (error) {
        //         if (error) {
        //             console.error('elasticsearch cluster is down!');
        //         } else {
        //             console.log('All is well');
        //         }
        //   });
    }
}
module.exports = elasticsearchLib;