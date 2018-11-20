import validator from 'validator';

export default function(field, value){
    if(field.isRequired){
        if(!value){
            return '必需填写：' + field.name;
        }
    }
    if(field.checkType){
        switch (field.checkType){
            case 'url':
                let isValidUrl = validator.isURL(value, {
                    require_protocol: false
                });
                if(isValidUrl === false){
                    return '“' + field.name + '”' + '不符合类型：' + field.checkType;
                }
                break;
        }
    }
}