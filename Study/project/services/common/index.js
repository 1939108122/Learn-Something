import interceptors from '@/services/http-interceptors';
import store from '@/store/index';
import router from '@/router';

// 加载完页面，需要全局获取的接口
export function globalFetchApiList() {
    /**
     * 获取“业务系统”列表
     */
    (async function getSystemList () {
        let res = await interceptors({
            method: 'GET',
            url: '/api/enum/system',
        });
        if(res && res.code == 0) {
            store.commit('user/updateUserState', {key: 'systemList', value: res.data || []});
        };
    })();

    /**
     * 获取“二级场景”列表
     */
     (async function getScenarioList () {
        let res = await interceptors({
            method: 'GET',
            url: '/api/enum/scenario',
        });
        if(res && res.code == 0) {
            store.commit('user/updateUserState', {key: 'scenarioList', value: res.data || []});
        };
    })();


    /**
     * 获取当前用户的“部门权限”
     */
    (async function getDeptList () {
        let res = await interceptors({
            method: 'GET',
            url: '/api/department/deptTree.json',
        });
        if(res && res.code == 0) {
            store.commit('user/updateUserState', {key: 'deptTreeList', value: res.data || []});
        };
    })();

    /**
     * 获取菜单列表
     */
    (async function getMenuList() {
        let res = await interceptors({
            method: 'GET',
            url: '/api/menu/menu.json',
        });
        if(res && res.code == 0) {
            store.commit('user/updateUserState', {key: 'menus', value: res.data || []});
            if (router.currentRoute.path == '/') {
                router.replace(((res.data || [])[0] || {}).url); // 动态重定向到第一个有权限的url
            }
        };
    })();

    /**
     * 获取全部的级别数据
     */
    (function fetchLevelList() {
        interceptors({
            method: 'GET',
            url: '/api/user/level/level.json',
        })
        .then(({ code, data }) => {
            if (code === 0) {
                store.commit('common/setCommonLevelList', data || []);
            }
        })
        .catch(err => console.log(err));
    })();
}

export function getToken() {
    return interceptors.get('/api/user/token');
}