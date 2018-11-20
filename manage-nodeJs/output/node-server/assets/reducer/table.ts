import reducerFactory from './Factory';
import TABLE_STATE from '../interface/TABLE_STATE';
const state:TABLE_STATE = {
    tableName: '',
    dbName: '',
    list: [],
    page: 1,
    pageSize: 10,
    fields: [],
    total: 0,
    editingId: 0,
    originalFields: {},
    filterList: [],
    sortBy: '',
    sortOrder: '',
    isAbleAddItem: false,
    isLoading: false,
    isEdited: false,
    listUrl: '',
    queryFields: [],
    contentEditModal: 720,
    getOneContentUrl: '',
    getOneContentFields: [],
    getOneContentIsRedirect: false,
    updateConfig: {},
    queryType: ''
};
export default reducerFactory({name: 'table',state});
