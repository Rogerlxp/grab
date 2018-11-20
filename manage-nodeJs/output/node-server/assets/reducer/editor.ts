import {EditorState} from 'draft-js';
import reducerFactory from './Factory';
import CONTENT_MAP from '../const/form/CONTENT_MAP';
export default reducerFactory({
    map: CONTENT_MAP,
    name: 'editor',
    state: {}
});