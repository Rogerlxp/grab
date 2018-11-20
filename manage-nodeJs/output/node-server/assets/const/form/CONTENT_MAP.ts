export default {
    title: {
        name: '标题',
        type: 'text',
        placeholder: '请输入文章标题',
        isRequired: true
    },
    subtitle: {
        name: '副标题',
        type: 'text',
        placeholder: '请输入副标题',
        isRequired: false
    },
    author: {
        name: '作者',
        type: 'text',
        placeholder: '请输入文章作者',
        isRequired: false
    },
    category: {
        name: '归类',
        type: 'text',
        placeholder: '请输入文章归类，例如：娱乐',
        isRequired: false,
    },
    tags: {
        name: '标签',
        type: 'text',
        placeholder: '请输入文章标签，以英文逗号“,”分隔，例如：搞笑,猎奇',
        isRequired: false
    },
    keywords: {
        name: '关键字',
        type: 'text',
        placeholder: '请输入文章关键字，以英文逗号“,”分隔，例如：王宝强',
        isRequired: false
    },
    type: {
        name: '文章内型',
        type: 'select',
        options: [{
            name: '图文',
            value: 'images_text'
        },{
            name: '文本',
            value: 'text'
        }],
        placeholder: '选择文章类型'
    },
    state: {
        name: '状态',
        type: 'select',
        options: [{
            name: '上架',
            value: 'activated',
        }, {
            name: '下架',
            value: 'unactivated'
        }],
        placeholder: '选择文章上下架状态'
    },
    images: {
        name: '图片',
        type: 'images'
    },
    brief: {
        name: '简介',
        placeholder: '请输入文章简介',
        type: 'textarea'
    },
    mainContent: {
        name: '文章内容',
        placeholder: '文章的主内容',
        type: 'rich-text',
        isRequired: true
    }
}