import reducerFactory from './Factory';

let defaultFilterState = {
    keywordValue: '',
    idTypeValue: '',
    idValue: '',
    cpSourceValue: '',
    categoryValue: '',
    startTimeValue: '',
    endTimeValue: '',
    statusValue: '',
    crawlUrlValue: '',
};
let filter = function(state = defaultFilterState, action){
    let newState = Object.assign({}, state);
    switch(action.type){
        case 'setFilterValue':
            newState[action.key] = action.value;
            break;
        default:
            return newState;
    }
    return newState;
}
export default filter;