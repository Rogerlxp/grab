module.exports = function(n, cb){
    let travelNode = function(node, callback){
        callback(node);
        if(Array.isArray(node.children) && node.children.length){
            node.children.forEach(child=>{
                travelNode(child, callback);
            });
        }
    }
    travelNode(n, cb);
};