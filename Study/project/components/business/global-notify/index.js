/**
 * 全局提示
 * 关联文档：@/components/business/global-notify/readme.md
 */

import Vue from 'vue';
import store from '@/store/index.js';
import GlobalNotify from '@/components/business/global-notify/index.vue';
import ReadingRequired from '@/components/business/global-notify/reading-required.vue';

let instance = null;
// 全局提示「非必读」
const GlobalNotifyConstructor = Vue.extend(GlobalNotify);
// 全局提示「必读」
const ReadingRequiredConstructor = Vue.extend(ReadingRequired);

// 非必读消息
const initInstance = params => {
    instance = new GlobalNotifyConstructor({
        el: document.createElement('div'),
        data: {
            close: () => Notify.hide()
        },
        propsData: { ...params }
    });
    document.body.appendChild(instance.$el);
};

// 必读消息
const initRequiredInstance = params => {
    instance = new ReadingRequiredConstructor({
        el: document.createElement('div'),
        data: {
            close: () => Notify.hide()
        },
        propsData: { ...params }
    });
    document.body.appendChild(instance.$el);
};

const Notify = (params = {}) => {
    if (instance) {
        Notify.hide();
    }
    // 初始化
    params.required ? initRequiredInstance(params) : initInstance(params);
    // 变更状态
    store.commit('globalMessage/updateTriggerPermission', false);
};

// 为消除其他tab的全局消息实例用
const clearInstance = () => {
    if (instance) {
        instance.$destroy(true);
        instance.$el && document.body.removeChild(instance.$el);
        instance = null;
    }
    // 变更状态
    store.commit('globalMessage/updateTriggerPermission', true);
};

Notify.clearInstance = clearInstance;

Notify.hide = () => {
    clearInstance();
    // 再次触发消息
    store.dispatch('globalMessage/triggerGlobalNotify');
};

export default {
    install(Vue) {
        Vue.prototype.$globalNotify = Notify;
    }
};
