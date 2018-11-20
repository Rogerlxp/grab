import reducerFactory from './Factory';
export default reducerFactory({
    name: 'user',
    state: {
        name: '',
        permissions: []
    }
});