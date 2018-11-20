interface FIELDS {[index:number]:{
    name: string;
    keyName?: string;
    placeholder?: string;
    isPrimaryKey?: boolean;
    aliasKeyName?: string;
    valueType?: string;
    link?: {
        prefix: string;
        query: {
            key: string;
            value: string;
        };
        target?: string;
    };
    // form field type: select, text
    type?: string;
    // for select
    options: {
        name: string;
        value: string | number | null;
    }[];
}};
export default FIELDS;