const validator = require('validator');
const URI = require('urijs');
module.exports = function(fields, payload){
    return new Promise(resolve=>{
        let res = {
            isValid: false,
            message: ''
        };
        let keys = Object.keys(payload);
        for(let key of keys){
            let item = payload[key];
            let field = fields.find(each=>each.keyName === key);
            if(!field){
                res.message = `Can not find this field(${key}) in sql table definitions.`;
                resolve(res);
                return;
            }
            if(field.isRequired && ['', null, undefined].includes(item)){
                res.message = `'${key}' is required, now the value is: ${item}`;
                resolve(res);
                return;
            }
            if(field.uneditable && !field.isForceSend){
                res.message = 'This field can not be edited: ' + field.keyName;
                resolve(res);
                return;
            }
            if(field.validType === 'host'){
                if(typeof item !== 'string'){
                    res.message = 'This field must be a string: ' + field.keyName;
                    resolve(res);
                    return;
                }else{
                    if(validator.isFQDN(item)){
                        continue;
                    }else{
                        if(validator.isURL(item)){
                            const uri = new URI(item);
                            const host = uri.hostname();
                            if(host){
                                payload[key] = host;
                            }else{
                                res.message = 'Can not find a valid host in this field: ' + field.keyName;
                                resolve(res);
                                return;
                            }
                        }else{
                            res.message = 'This field value must be a host type: ' + field.keyName;
                            resolve(res);
                            return;
                        }
                    }
                }
            }
            if(field.notNull && item === undefined){
                if(field.defaultValue === undefined){
                    if(field.type === 'string'){
                        payload[key] = '';
                    }else if(field.type === 'number'){
                        payload[key] = 0;
                    }else{
                        res.message = `This field can not be null, please specify a default value or a value type.`;
                        resolve(res);
                        return;
                    }
                }else{
                    payload[key] = field.defaultValue;
                }
            }
            // if(item === null){
            //     continue;
            // }
            // let valueType = typeof item;
            // const validTypes = ['string', 'number'];
            // if(validTypes.includes(valueType) === false){
            //     res.message = 'Field value only accept "string" and "number" variable type: ' + key + ' is ' + typeof item;
            //     resolve(res);
            //     return;
            // }
        }
        res.isValid = true;
        res.fields = payload;
        resolve(res);
    });
}