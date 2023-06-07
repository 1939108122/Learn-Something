import Cookie from '@/utils/tools/cookie';
import { parseURL, formatParams } from '@/utils/tools/util';

/**
 * 登陆添加cookie
 */
const urlJSON = parseURL(window.location.href);

if(urlJSON.params.t_uc) {

    Cookie.set('t_zhipin-exam', urlJSON.params.t_uc, undefined, undefined, '/');

    const query = formatParams({
        ...urlJSON.params,
        t_uc: undefined, // 去除
        token: undefined // 去除
    });

    let url = urlJSON.pathname;
    if (query) {
        url += `?${query}`;
    }
    location.replace(url);
}