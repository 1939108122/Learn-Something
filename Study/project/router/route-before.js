import store from '@/store/index';
import interceptors from '@/services/http-interceptors';
import { setGlobalWatermark } from '@/utils/tools/watermark/index';
import { globalFetchApiList } from '@/services/common/index';

const goNext = (to, from, next) => {
    const { userEmail, userName } = store.state.user;
    if (userEmail || userName) {
        next();
    } else {
        interceptors({
            method: 'GET',
            url: '/api/user/getUserInfo',
        }).then(res => {
            if(res && res.code == 0) {

                let { userName, userEmail, departmentName, authMenuResouces, currentSystemId, currentScenarioId, authMenus, id, token } = res.data;

                store.commit('user/updateUserState', { key: 'userName', value: userName });
                store.commit('user/updateUserState', { key: 'userEmail', value: userEmail });
                store.commit('user/updateUserState', { key: 'departmentName', value: departmentName });

                // 资源列表
                store.commit('user/updateUserState', { key: 'uriList', value: authMenuResouces || [] });
                // 菜单列表
                store.commit('user/updateUserState', { key: 'menuList', value: authMenus || [] });
                //当前系统id
                store.commit('user/updateUserState', { key: 'curSystemId', value: currentSystemId });

                //当前场景id
                store.commit('user/updateUserState', { key: 'curScenarioId', value: currentScenarioId });

                //当前用户加密id
                store.commit('user/updateUserState', { key: 'id', value: id });
                store.commit('user/updateUserState', { key: 'token', value: token });

                window.localStorage.setItem('EXAM', token);

                // 水印
                setGlobalWatermark(userName, userEmail);

                // 全局请求接口
                globalFetchApiList();

                next();
            };
        });
    }
};

export default function routerBefore (router) {
	// eslint-disable-line
    router.beforeEach(async (to, from, next) => {

        goNext(to, from, next);

        if (to.meta.title) {
            document.title = to.meta.title;
        }
    });

    // router.afterEach(to => {
    //     // 水印
    //     if (store.state.user.userEmail) {
    //         setGlobalWatermark(store.state.user.userName, store.state.user.userEmail);
    //     }
    // });
}
