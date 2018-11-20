import FIELDS from './FIELDS';
interface STATE {
    dbType?: string;
    dbName?: string;
    tableName?: string;
    listUrl: string;
    page:number;
    pageSize:number;
    list:{[key:string]:any}[];
    fields: FIELDS; // fields definition
    total: number;
    editingId: string | number;
    originalFields: any;
    filterList: any;
    sortBy: string;
    sortOrder: string;
    isAbleAddItem: boolean;
    isLoading: boolean;
    isEdited: boolean;
    queryFields?: {[key:string]:any}[];
    contentEditModal?:number;
    getOneContentUrl?:string;
    getOneContentFields?: string[];
    getOneContentIsRedirect?: boolean;
    updateConfig?:any;
    queryType?:string;
}
export default STATE;
