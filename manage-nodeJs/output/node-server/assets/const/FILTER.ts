export const ID_TYPES:{
    name:string,
    value:string,
    isDefault?:boolean
}[] = [{
    name: '内容id',
    value: 'mzContentId',
    isDefault: true
}, {
    name: 'cp内容id',
    value: 'cpContentId'
}];

export const CP_SOURCES: {
    name: string,
    value: string,
    isDefault?: boolean
}[] = [{
    name: 'UC',
    value: 'uc'
}, {
    name: '头条',
    value: 'headLine'
}];

export const CATEGORIES:{
    name: string,
    value: string,
    isDefault?: boolean
}[] = [{
    name: '搞笑',
    value: 'fun',
}, {
    name: '科技',
    value: 'technology'
}];

export const STATUSES:{
    name: string,
    value: string,
    isDefault?: boolean
}[] = [{
    name: '上架',
    value: 'onShelf'
}, {
    name: '下架',
    value: 'offShelf'
}];