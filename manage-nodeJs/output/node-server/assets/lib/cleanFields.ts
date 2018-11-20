import store from '../reducer';
const shortid = require('shortid');
export default function(isCleanAll){
    const fields = this.props.fields;
    const editingFields = this.props.editingFields;
    for(const field of fields){
        const keyName = field.keyName || field.aliasKeyName;
        if(!keyName){
            continue;
        }
        if(field.uneditable){
            continue;
        }
        const val = editingFields[keyName];
        if(isCleanAll || val === undefined){
            if(field.defaultValue !== undefined){
                field.value = field.defaultValue;
                // console.log('set default value: ' + field.value);
            }else{
                field.value = undefined;
                // console.log('no default value: ' + keyName);
            }
        }
        if(field.type === 'wysiwyg'){
            field._key = shortid.generate();
            // console.log(field);
        }
        store.dispatch({
            type: 'fields.setValue',
            key: keyName,
            value: field.value
        });
    }
    store.dispatch({
        type: 'table.setValue',
        key: 'fields',
        value: fields
    });
}