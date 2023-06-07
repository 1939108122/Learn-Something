import Vue from 'vue';
import VueRouter from 'vue-router';
import routerBefore from '@/router/router-before.js';

import { BasicLayout, BlankLayout } from '@/package/common/layouts';

Vue.use(VueRouter, {});

// 公共路由
const error404 = () => import(/* webpackChunkName: "common" */ '@/package/404.vue');
const error403 = () => import(/* webpackChunkName: "common" */ '@/package/403.vue');

/** 自动化导入 */
const r = (() => {
    const arr = [];
    const req = require.context('./routes', false, /\.r\.js$/);
    req.keys().map(item => {
        arr.push(req(item).default);
    });
    return arr;
})();

const getPathPrefix = function() {
    let url = process.env && process.env.PATH_PREFIX;
    if (url && url !== 'undefined') {
        if (/^\/|http/.test(url)) {
            url = url;
        } else {
            url = '/' + url;
        }
    } else {
        url = '/';
    }
    return url;
};

const router = new VueRouter({
    mode: 'history',
    base: getPathPrefix(),
    routes: [
        ...r,
        {
            path: '/',
            component: BlankLayout,
            children: [
                {
                    path: '/403',
                    component: error403
                },
                {
                    path: '*',
                    component: error404
                },
            ]
        },
    ]
});

routerBefore(router);

export default router;
