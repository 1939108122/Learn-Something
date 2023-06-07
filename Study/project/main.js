import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 工具集合
import filters from '@/utils/filters';
import directives from '@/utils/directives';
import comps from '@/utils/comp';
import plugins from '@/utils/plugins';

// 过滤器相关
for (let key in filters) {
    Vue.filter(key, filters[key]);
}
// 指令相关
for (let key in directives) {
    Vue.directive(key, directives[key]);
}
// 全局组件
for (let key in comps) {
    Vue.component(key, comps[key]);
}
// 全局插件 （含bossUI）
for (let key in plugins) {
    Vue.use(plugins[key]);
}

// 扩充vue原型方法
import interceptors from '@/services/http-interceptors';
Vue.prototype.$ajax = interceptors;

//config
Vue.config.productionTip = false;

/**
 * 基础信息配置
 * 1、iuc
 */
import '@/services/base.js';


// 实例化
var ksApp = new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
});
