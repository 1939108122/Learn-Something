import { GLOBAL_MESSAGE_TYPE_LIST } from './constant';

export const commonProps = {
    // 消息类型
    type: {
        type: String,
        default: 'common',
        validator: value => GLOBAL_MESSAGE_TYPE_LIST.includes(value)
    },
    // 是否必读
    required: {
        type: Boolean,
        default: false
    },
    // 标题
    title: {
        type: String,
        default: ''
    },
    // 内容
    content: {
        type: String,
        default: ''
    },
    // 消息时间
    time: {
        type: String,
        default: ''
    },
    // 渲染 html 文本
    dangerouslyUseHTMLString: {
        type: Boolean,
        default: false
    },
    // 自定义样式类
    customClass: {
        type: String,
        default: ''
    },
    // 是否显示查看操作
    showView: {
        type: Boolean,
        default: true
    },

    // 点击关闭「外部函数」
    externalClose: Function,
    // 点击查看「外部函数」
    externalView: Function,
    // 提示初始化「外部函数」
    externalShow: Function
};
