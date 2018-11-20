import PATH_NAME_MAP from '../const/PATH_NAME_MAP';
import SITE_INFO from '../const/SITE_INFO';
import { Transfer } from 'antd';
const Moment = require('moment');
const URI = require('urijs');
export default {
    setTitle(props){
        let match = props.location.pathname.match(/[^\/]+$/);
        let name = match[0];
        console.log('current: ', name);
        if(name){
            const reg = new RegExp('^' + name + '$', 'i');
            const foundLink = PATH_NAME_MAP.find(each=>reg.test(each.keyName));
            let title = SITE_INFO.name;
            if(foundLink){
                title = foundLink.name + SITE_INFO.tabNameDivider + SITE_INFO.name;
            }
            window.document.title = title;
        }
    },
    isMeizuUrl(url){
        const uri = new URI(url);
        const protocol = uri.protocol();
        if(/https?/.test(protocol) === false){
            // this is not a valid url
            return null;
        }
        const domain = uri.domain();
        return /mzres|meizu/.test(domain);
    },
    // only used for copy enumerate property.
    copyObj(obj){
        return JSON.parse(JSON.stringify(obj));
    },
    isFile(file){
        let isFile = false;
        if(file.type && file.name && file.lastModifiedDate && file.size && file.lastModified){
            isFile = true;
        }
        return isFile;
    },
    isValuePath(keyName){
        return /\.|(\[[\]]*\])/.test(keyName);
    },
    isEmpty(value){
        if(value === 0){
            return true;
        }
        if(!value){
            return true;
        }
        if(Array.isArray(value)){
            return !value.length;
        }
        const type = typeof value;
        if(type === 'object'){
            return !Object.keys(value).length;
        }
        return false;
    },
    typeOf(value){
        return ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    },
    applyObjByPath(obj, path, value){
        const pathArr = path.split(/[\.\[]/).filter(each=>!!each);
        const train = [];
        for(let i = 0; i < pathArr.length; i++){
            let key = pathArr[i];
            let type = 'object';
            const rightBraceIndex = key.indexOf(']');
            if(~rightBraceIndex){
                key = key.replace(']', '');
                if(key === ''){
                    type = 'array';
                    key = undefined;
                }else if(/^('|")/.test(key)){
                    // key is type of string
                    key = key.replace(/'|"/g, '');
                }else{
                    type = 'array';
                    // key is type of number
                    key = +key;
                }
            }
            train.push({
                type,
                key
            });
        }
        let target = obj;
        for(let i = 0; i < train.length;i++){
            const cur = train[i];
            const next = train[i + 1];
            const targetType = this.typeOf(target);
            // console.log('target: ', JSON.stringify(target));
            // console.log('cur: ', cur);
            // console.log('index : ', i);
            if(cur.type === 'array'){
                if(targetType !== 'array'){
                    target = [];
                }
                let applyType;
                if(cur.key === undefined){
                    applyType = 'push';
                }else{
                    applyType = 'assignment';
                }
                if(next){
                    if(next.type === 'object'){
                        if(applyType === 'push'){ // array
                            const l = target.length;
                            if(!target[l]){
                                target[l] = {};
                            }
                            target = target[l];
                        }else if(applyType === 'assignment'){
                            if(!target[cur.key]){
                                target[cur.key] = {};
                            }
                            target = target[cur.key];
                        }
                    }else{
                        throw new Error('the next target of array can only be object');
                    }
                }else{
                    target.push(value);
                }
            }else if(cur.type === 'object'){
                if(targetType !== 'object'){
                    target = {};
                }
                if(next){
                    if(next.type === 'object'){
                        if(!target[cur.key]){
                            target[cur.key] = {};
                        }
                        target = target[cur.key];
                    }else if(next.type === 'array'){
                        if(Array.isArray(target[cur.key]) === false){
                            target[cur.key] = [];
                        }
                        target = target[cur.key];
                    }
                }else{
                    target[cur.key] = value;
                }
            }
        }
        // console.log('final object: ', obj);
    },
    getValueByPath(obj, path){
        if(!obj){
            return undefined;
        }
        let val;
        const pathArr = path.split(/[\.\[]/);
        for(let i = 0; i < pathArr.length; i++){
            let key = pathArr[i];
            const rightBraceIndex = key.indexOf(']');
            if(~rightBraceIndex){
                key = key.replace(']', '');
                if(/^('|")/.test(key)){
                    key = key.replace(/'|"/g, '');
                    // key is type of string
                }else{
                    // key is type of number
                    key = +key;
                }
            }
            if(i === 0){
                val = obj[key];
            }else{
                val = val[key];
            }
            if(!val){
                break;
            }
        }
        return val;
    },
    isJsonValue(val){
        if(typeof val !== 'string'){
            return false;
            // throw new Error('"isJsonValue" function can only detect string whether json or not.');
        }
        // only detect array or object type json.
        if(/[\{\[][^\}\]]*[\}\]]/.test(val)){
            try{
                JSON.parse(val);
                return true;
            }catch{
                return false;
            }
        }else{
            return false;
        }
    },
    adjustValueType(val){
        if(typeof val !== 'string'){
            return val;
        }
        if(val === 'null'){
            return null;
        }
        if(val === 'true'){
            return true;

        }
        if(val === 'false'){
            return false;
        }
        if(val === 'undefined'){
            return undefined;
        }
        if(val === ''){
            return '';
        }
        if(/[^\d]/.test(val) === false){
            // this value may bigger than Number.MAX_SAFE_INTEGER.
            const v = (+val);
            if(v < Number.MAX_SAFE_INTEGER){
                val = v;
            }
        }
        return val;
    },
    deepClone(obj){
        // console.log('deep clone: ', obj);
        // This is a heavy function. Do not add business logic here.
        if(!obj){
            throw new Error('Can not copy empty variable.');
        }
        if(typeof obj !== 'object'){
            throw new Error('Can not copy variable which is not an object');
        }
        let newObj;
        if(Array.isArray(obj)){
            newObj = [];
        }else{
            newObj = {};
        }
        const copy = function(target, origin){
            if(!origin){
                return;
            }
            if(Array.isArray(origin)){
                target = [];
                for(let i = 0; i < origin.length; i++){
                    if(origin[i] === undefined){
                        continue;
                    }
                    if(origin[i] && typeof origin[i] === 'object'){
                        copy(target[i], origin[i]);
                    }else{
                        target[i] = origin[i];
                    }
                }
                return;
            }else if(typeof origin === 'number'){
                target = origin;
            }else if(typeof origin === 'string'){
                target = origin;
            }else if(typeof origin === 'object'){
                if(!target){
                    target = {};
                }
                // console.log('target: ', target);
                // console.log('origin: ', origin);
                target = Object.assign(target, origin);
                const keys = Object.keys(origin);
                for(const key of keys){
                    if(origin && typeof origin[key] === 'object'){
                        // console.log('parent: ', target[key]);
                        copy(target[key], origin[key]);
                    }
                }
            }
        }
        copy(newObj, obj);
        return newObj;
    },
    transferIntToBitIndex(intValue){
        // refer: https://stackoverflow.com/questions/9939760/how-do-i-convert-an-integer-to-binary-in-javascript
        const bitValue = (intValue >>> 0).toString(2);
        return bitValue.split('').reverse().map((each, index)=>{
            if(each === '0'){
                return false;
            }
            return index;
        }).filter(each=>each!==false);
    },
    transferIndexToBit(indexArray){
        const bitArray = new Array();
        indexArray.forEach(each=>{
            bitArray[each] = 1;
        });
        for(let i = 0; i < bitArray.length; i++){
            if(bitArray[i] !== 1){
                bitArray[i] = 0;
            }
        }
        return parseInt(bitArray.reverse().join(''),2);
    },
    makeDayStartTime(){
        const dayStartTime = new Moment();
        dayStartTime.hour(0);
        dayStartTime.minutes(0);
        dayStartTime.seconds(0);
        return dayStartTime;
    },
    makeDayEndTime(){
        const dayEndTime = new Moment();
        dayEndTime.hour(23);
        dayEndTime.minutes(59);
        dayEndTime.seconds(59);
        return dayEndTime;
    }
}