import reducerFactory from './Factory';
export default reducerFactory({
    name: 'contentAlgorithm',
    state: {
        selectedAlgorithm: '',
        conditions: [], // no algorithm
        cpConditions: {}, // with algorithm
        category: {},
        firstCategory: [],
        serverAlgorithmInfo: undefined,
        serverConditions: undefined,
        // no algorithm setting
        orderType: undefined,
        displayStyle: undefined,
        openType: undefined,
        disCount: undefined,
        page: undefined, //1分页，0不分页
    }
});
