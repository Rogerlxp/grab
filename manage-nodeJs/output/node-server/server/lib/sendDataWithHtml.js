const fs = require('fs-extra');

module.exports = function(filePath, jsonData, res){
    fs.readFile(filePath, 'utf-8', function(err, data){
        if(err){
            throw err;
        }
        let jsonDataText = JSON.stringify(jsonData);
        data = data.replace(/<body[^>]*>/i, `<body>\n<script>window.serverData = ${jsonDataText};</script>`);
        res.type('html');
        res.send(data);
    });

}