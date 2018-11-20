import {EditorState} from 'draft-js';
import handy from '../lib/handy';
export default function({
    map,
    name,
    state
}:any){
    let defaultState = state || {};
    if(map){
        Object.keys(map).forEach(key=>{
            let field = map[key];
            let defaultValue = field.defaultValue;
            if(defaultValue === undefined){
                if(field.type === 'rich-text'){
                    defaultValue = EditorState.createEmpty();
                }else{
                    defaultValue = '';
                }
            }
            defaultState[key] = defaultValue;
        });
    }
    return function(passState = defaultState, action){
        const actionName = action.type;
        if(/\./.test(actionName)){
            const names = actionName.split('.');
            if(names[0] !== name){
                return passState;
            }
        }
        if(/@@redux/.test(actionName)){
            return passState;
        }
        // console.log('pass state: ', passState);
        let newState = handy.deepClone(passState);
        if(action.key === undefined){
            if(action.value){
                Object.keys(action.value).forEach(key=>{
                    const val = action.value[key];
                    const type = typeof val;
                    // if(key === 'isLoading'){
                    //     console.log('val: ', val);
                    // }
                    if(type === 'object' && val !== null){
                        newState[key] = JSON.parse(JSON.stringify(val));
                    }else{
                        newState[key] = val;
                    }
                });
            }else{
                return newState;
            }
        }else{
            switch(actionName){
                case name + '.setValue':
                    // if(action.key === 'isLoading'){
                    //     console.log('val: ', action.value);
                    // }
                    newState[action.key] = action.value;
                    break;
                default:
                    console.warn('send a unknown action type: ', action.type, ', current name: ', name);
            }
        }
        return newState;
    }
}