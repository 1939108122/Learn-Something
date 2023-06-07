import Vue from 'vue';
import Vuex from 'vuex';

/** vuex modules 自动导入 */
const r = (() => {
    const req = require.context('./modules', false, /\.m\.js$/);
    return req.keys().reduce((prev, cur) => {
        const key = cur.replace(/.m.js|.\//g, '');
        const content = req(cur).default;
        prev[key] = content;
        return prev;
    }, {});
})();

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV === 'development', //异常数据变更，抛出错误
    modules: {
        ...r,
    },
    state: {}, 
    mutations: {}
});

export default store;
