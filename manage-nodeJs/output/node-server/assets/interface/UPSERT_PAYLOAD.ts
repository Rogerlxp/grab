interface PAYLOAD{
    dbName: string;
    tableName: string;
    fields: {[key:string]: string|number|null}
};
export default PAYLOAD;