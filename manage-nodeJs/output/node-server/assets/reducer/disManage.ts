import reducerFactory from './Factory';
export default reducerFactory({
    name: 'disManage',
    state: {
        firstCategory: [],
        conditions: [],
        disInfo: {
            FCHANNEL_ID: '',
            FID: '',
            FNAME: '',
            FDISPLAY_STYLE: 3,
            FORDER: '',
            FOPEN_TYPE: '',
            FDIS_COUNT: '',
            FPAGE: '',
        },
        list: [],
        editingStyle: {
            position: '',
            openType: '',
            displayStyle: ''
        }
    }
});
