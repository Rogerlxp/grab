import RULE_MAP from '../const/form/RULE_MAP';
import reducerFactor from './Factory';
export default reducerFactor({
    name: 'crawlConfig',
    map: RULE_MAP,
    state: {
        isOpen: false,
        list: []
    }
});