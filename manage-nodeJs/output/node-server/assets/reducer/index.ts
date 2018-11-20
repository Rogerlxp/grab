import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
const all = require.context('./', false, /\/[a-z][a-zA-Z]*\.ts$/);
let modules = {};
all.keys().forEach(key=>{
    if(/index\.ts/.test(key)){
        return;
    }
    let name = key.match(/[\/]([^\/]+)\.ts$/)[1];
    modules[name] = all(key).default;
});

const reducer = combineReducers(modules);

export default createStore(reducer, applyMiddleware(thunk));