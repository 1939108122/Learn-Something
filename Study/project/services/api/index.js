import { get, post } from '@/services/http';

// 获取验证码
export const getSmsCode = (params = {}) => {
    return get('/api/unjoinedRecord/login/getSmsCode.json', params);
};

// 登录
export const doLogin = (params = {}) => {
    return get('/api/unjoinedRecord/login/doLogin.json', params);
};
// 获取当前登陆人信息
export const unjoinInfo = (params = {}) => {
    return get('/api/unjoinedRecord/user/unjoinInfo.json', params);
};

