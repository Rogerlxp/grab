const all = require.context('./', false, /\/[A-Z_]*\.js$/);
let modules = {};
all.keys().forEach(key=>{
    if(/index\.js/.test(key)){
        return;
    }
    let name = key.match(/[\/]([^\/]+)\.js$/)[1];
    modules[name] = all(key);
});
module.exports = modules;