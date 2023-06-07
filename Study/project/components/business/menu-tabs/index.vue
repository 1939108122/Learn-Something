<template>
    <ul :class="[isNewTab ? 'new-sub-tab-list' : 'subtab-list']">
        <router-link
            v-for="(item, index) in resultList"
            class="tab-item"
            tag="li"
            :key="index"
            :to="item.url"
        >
            {{ item.name }}<slot :name="item.name"></slot>
        </router-link>
    </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import { isNotEmpty } from '@/utils/tools/tools.js';

function formatePath(url) {
    return url.replace(/((.*)\/common\/page\?mu=)*?\/web/, '');
}

export default {
    name: 'menu-tabs',
    props: {
        exclude: { // 排除不展示的tab
            type: Array,
            default: () => []
        },
        isNewTab: { //是否是新型tab样式
            type: Boolean,
            default: false
        },
        isNotConfigureMenu: { // 是不是属于 没配置菜单（菜单管理）却需要路由的（合作客户管理-合作客户的四级tab）
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            clicked: false,
        };
    },
    computed: {
        ...mapGetters({
            authTabList: 'common/currentMenuTabs',
        }),
        /*authTabList() {
            return [
                {name: '质检中', url: '/dashboard/call/quality-my/process'},
                {name: '待复核', url: '/dashboard/call/quality-my/review'},
                {name: '质检完成', url: '/dashboard/call/quality-my/done'},
            ];
        },*/
        // 过滤掉不渲染的菜单（需要灰度某个三级菜单的情况）
        resultList() {
            return this.authTabList.filter(item => !this.exclude.includes(item.name) && item.url).map(item => {
                return {
                    ...item,
                    url: formatePath(item.url)
                };
            });
        },
    },
    watch: {
        resultList: {
            handler(val) {
                if (val && val.length) {
                    let flag, path;
                    if(this.isNotConfigureMenu) {
                        // 路由去掉参数去匹配url，具体可参考合作客户管理-合作客户
                        const { tab } = this.$route.params;
                        path = isNotEmpty(tab) ? this.$route.path.replace(`/${tab}`, '') : this.$route.path;
                        flag = val.some(item => item.url === path);
                    } else { // 正常匹配
                        path = this.$route.path;
                        flag = val.some(item => item.url === this.$route.path);
                        
                    }
                    
                    const currentMenu = val.find(item => item.url === path);
                    if (!flag) {
                        this.$router.replace(val[0].url);
                        
                    } else {
                        // 三级菜单埋点
                        this.$trackEvent({
                            action: 'crm-e_click_navigation_3',
                            p1: currentMenu.id,
                            p2: +this.clicked // 0 曝光, 1 点击
                        });
                        this.clicked = true; // 第一次进来默认为曝光，接下去的每一次都认为是点击
                    }
                }
            },
            immediate: true,
        },
    },
};
</script>
