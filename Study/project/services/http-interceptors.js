import Vue from 'vue';
import axios from 'axios';
import store from '@/store/index';
import md5 from 'blueimp-md5';
import router from '@/router';

import { parseURL } from '@/utils/tools/util.js';
import Cookie from '@/utils/tools/cookie.js';
import { getToken } from './common/index';

const stringify = o => {
    try {
        if (!_.isEmpty(o)) {
            return JSON.stringify(o);
        }
        return '';
    } catch (e) {
        return '';
    }
};

/**
 * 请求配置
 * @see https://github.com/mzabriskie/axios
 */

const t1_uc = (parseURL(window.location.href).params || {}).t1_uc;

const instance = axios.create({
    timeout: 20000, // 请求超时时间
    withCredentials: true // 跨域
});

instance.interceptors.request.use(
    async (config) => {
        let params = Object.assign(config.params || {}, {
            _: Date.now()
        });

        // 防止重复提交token
        config.headers.common['X-Anti-Request-Token'] = md5(stringify(config.body || config.params));
        config.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        const token = store.state.user.token;
        if (token) {
            config.headers.t_exam = token;
        }

        if (t1_uc) {
            config.headers.common['zhipin-exam'] = t1_uc;
            config.headers.common['from-iframe'] = true;
            config.headers.common['useHeaderTicket'] = true;
            const domain = (document.domain.match(/(\.[\w]+\.[\w]+)$/) || [])[0];
            Cookie.set('t_zhipin-exam', t1_uc, undefined, domain, '/');
        }

        // 内部系统，添加直连获取本机信息
        if (typeof window.zhilian != 'undefined' && typeof window.zhilian.addHeaders == 'function') {
            config.headers.common = window.zhilian.addHeaders(config.headers.common);
       }

        if (!config.params) {
            // post 时强行给url上加上参数
            config.params = params;
        }

        // 将请求头存储到 store
        store.commit('common/updateState', { key: 'actionHeader', value: config?.headers?.common || {} });

        return config;
    },
    error => {
        Promise.reject(error);
    }
);


let isRefreshing = false; // 定义一个flag 判断是否刷新Token中
let queue = []; // 保存需要重新发起请求的队列
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms)); // 睡一会儿

instance.interceptors.response.use(
    async (response) => {
        let { status, data, config } = response;
        if (status !== 200) {
            Vue.prototype.$toast({
                content: data,
                type: 'error'
            });
            return Promise.reject(data);
        } else {
            if (config.useAll) {
                return response;
            }
            //未登录
            if (data && data.callback) {
                const currentLocation = window.location;
                const baseUrl = data.callback.split('callback=');
                const iucUrl = baseUrl[0] + 'callback='+ encodeURIComponent(currentLocation.origin + currentLocation.pathname);
                //本地登陆
                window.location.href = iucUrl;
                return false;
            };
            if(data.code !== 0) {
                // code = 26 代表 token 失效。
                if (data.code === 26) {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        // await sleep(3000);
                        return getToken()
                            .then(res => {
                                const { token } = res.data;

                                config.headers.t_exam = token;
                                // 更新刷新后的 Token
                                store.commit('user/updateUserState', { key: 'token', value: token });
                                queue.forEach(cb => cb(token)); // 遍历执行需要重新发起请求的队列
                                queue = []; // 清空队列
                                return instance.request(config);
                            })
                            .catch(() => {
                                queue = []; // 清空队列
                                Vue.prototype.$toast({
                                    type: 'error',
                                    content: '请刷新后重试~'
                                });
                            })
                            .finally(() => {
                                isRefreshing = false;
                            });
                    } else {
                        return new Promise(resolve => {
                            queue.push(token => {
                                // 将新的Token重新赋值
                                // config.headers.t_exam = token;
                                resolve(instance.request(config));
                            });
                        })
                    }
                } else {
                    Vue.prototype.$toast({
                        type: 'error',
                        content: data.message
                    });
                    if (data.code == 403) {
                        router.replace('/403');
                    }
                }
            };
            return data;
        };
    },
    error => {
        Vue.prototype.$toast({
            content: error,
            type: 'error'
        });
        return Promise.reject(error);
    }
);

export default instance;
