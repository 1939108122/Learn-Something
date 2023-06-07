<template>
    <div>
        <ui-popover
            v-model="tagAddShow"
            placement="bottom-start"
            trigger="manual"
            :width="237"
            :visible-arrow="false"
            popper-class="tag-setting-popover">
            <ul slot="reference" :class="{'click-wrap-style': tagAddShow}" class="tag-add-show-wrapper" @click="openSetTag">
                <template v-if="userTags && userTags.length">
                    <li v-for="item in userTags" :key="item.encryptId" :class="{'team-tag': item.teamType == 1}">
                        <ui-tooltip2 
                            width="180"
                            placement="top-start"
                            @on-show="onShow(item)"
                            @on-hide="onHide(item)">
                            <span>{{ item.title }}</span>
                            <template slot="content">
                                <p>标记人：{{ item.addUserName }}</p>
                                <p>标记时间：{{ item.addTime }}</p>
                            </template>
                        </ui-tooltip2>
                    </li>
                </template>
                <div v-else class="add-tag-btn">
                    <i class="icrm-tag"></i><span>添加标签</span>
                </div>
                <i class="icrm-side-arrow"></i>
            </ul>

            <div class="tag-setting-container" id="tag_setting_wrap" v-clickoutside="close">
                <div class="tag-setting-header">
                    <div class="checked-tag">
                        <template v-if="hasCheckList && hasCheckList.length">
                            <li v-for="item in hasCheckList" :key="item.encryptId" :class="{'team-tag': item.teamType == 1}">
                                <span>{{ item.title }}</span>
                                <i v-if="item.teamType !== 1 || showTeam(source)" class="ui-icon-close" @click="setTag(item)"></i>
                            </li>
                        </template>
                        <span v-else>添加标签</span>
                    </div>
                    
                    <div class="search-section">
                        <ui-input 
                            :class="{'input-has-value': searchWord}"
                            v-model="searchWord" 
                            placeholder="输入关键词搜索"
                            :maxlength="6"
                            clearable
                            @on-change="search">
                            <i class="ui-icon-search" slot="suffix"></i>
                        </ui-input>
                        <ui-tooltip2 placement="top" effect="dark">
                            <div 
                                v-if="addBtnAuth" 
                                class="icon mlr" :class="{'add-disabled': countIsReachLimit}" 
                                @click="addTag">
                                <i class="icrm-add-item"></i>
                            </div>
                            <template slot="content">
                                <span v-if="countIsReachLimit">已达添加上限</span>
                                <span v-else>{{ isBelongTeam ? '添加团队标签' : '添加我的标签' }}</span>
                            </template>
                        </ui-tooltip2>

                        <ui-tooltip2 placement="top" effect="dark">
                            <div 
                                v-if="manageBtnAuth" 
                                class="icon" 
                                @click="jumpTagSetting">
                                <i class="icrm-setting"></i>
                            </div>
                            <template slot="content">
                                管理标签
                            </template>
                        </ui-tooltip2>
                    </div>
                </div>

                <template v-if="!searchBlank">
                    <ul class="tag-check-wrapper new-scrollBar-width-8">
                        <!-- 我的标签  我的客户/添加跟进记录才有 -->
                        <template v-if="!isBelongTeam">
                            <div class="tag-sign-header">
                                <span class="tag-name">我的标签</span>
                                <ui-tooltip2 placement="right" effect="dark">
                                    <span class="guide"><i class="icrm-info-tooltip"></i></span>
                                    <template slot="content">
                                        一个客户最多可标2个我的标签
                                    </template>
                                </ui-tooltip2>
                            </div>

                            <template v-if="myTagList && myTagList.length">
                                <li 
                                    class="tag-list" 
                                    :class="{'selected-tag': item.check, 'mb-6': index == myTagList.length - 1, 'check-disabeld': myCheckCount > 1 && !item.check}" 
                                    v-for="(item, index) in myTagList" :key="item.encryptId"
                                    @click="setTag(item)">
                                    <span class="tag-item">{{ item.title }}</span>
                                </li>
                            </template>
                            <div v-else class="tag-blank">暂无可选标签</div>
                        </template>
                        <!-- 团队标签 -->
                        <template v-if="showTeam(source)">
                            <div class="tag-sign-header">
                                <span class="tag-name">团队标签</span>
                                <ui-tooltip2 :placement="'right'" effect="dark">
                                    <span class="guide"><i class="icrm-info-tooltip"></i></span>
                                    <template slot="content">
                                        一个客户最多可标3个团队标签
                                    </template>
                                </ui-tooltip2>
                            </div>
                            <template v-if="teamTagList && teamTagList.length">
                                <li 
                                    class="tag-list tag-list-team" 
                                    :class="{'selected-tag': item.check, 'mb-6': index == teamTagList.length - 1, 'check-disabeld': teamCheckCount > 2 && !item.check}" 
                                    v-for="(item, index) in teamTagList" :key="item.encryptId"
                                    @click="setTag(item)">
                                    <span class="tag-item team-tag">{{ item.title }}</span>
                                </li>
                            </template>
                            <div v-else class="tag-blank pb-12">暂无可选标签</div>
                        </template>
                    </ul>
                </template>
                <div v-else class="search-blank">
                    <span>暂无搜索结果</span>
                </div>
            </div>
        </ui-popover>
        <!-- 弹框：标签添加 -->
        <div v-if="addDialogShow">
            <ui-dialog 
                v-model="addDialogShow" 
                :showHeader="false" 
                width="420" 
                lock prevent-layer 
                :showFooter="false"
                preventHide
                @on-close="dialogClose">
                <add-tag 
                    slot="content" 
                    :addType="isBelongTeam ? 'team' : 'my'" 
                    :curCity="cityInfo" 
                    @success="dialogClose" 
                    @cancel="dialogClose">
                </add-tag>
            </ui-dialog>
        </div>
    </div>
</template>

<script>

import addTag from '@/views/dashboard/system/tag-setting/component/team-or-my/add-tag.vue';
import { mapState } from 'vuex';
import { isNotEmpty } from '@/utils/tools/tools.js';
import { formatDate } from '@/utils/tools/utils.js';
import { debounce } from '@/utils/tools/optimize.js';

const burnPointMap = {
    'team': 'crm-teamcust-list-set-tag',
    'my': 'crm-mycust-list-set-tag',
    'cooperation': 'crm-coopcust-list-set-tag',
    'follow': 'crm-mycust-list-follownote'
};

export default {
    name: 'TagAdd',
    props: {
        userTags: {
            type: Array,
            default: () => []
        },
        source: {  //来源 团队/我的/合作客户管理/跟进记录  team/my/cooperation/follow
            type: String,
            default: 'team'
        },
        customerId: {  //客户加密id
            type: String,
            default: ''
        },
        lib: {
            type: [String, Number],
            default: ''
        },
    },
    components: { addTag },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            isGw: state => state.user.userInfo.gw
        }),
        isBelongTeam() { //是否属于只有团队标签
            return this.source == 'team' || this.source == 'cooperation';
        },
        teamTagList() {  //团队标签数组
            return this.tagList.filter(item => item.teamType == 1);
        },
        myTagList() {  //我的标签数组
            return this.tagList.filter(item => item.teamType == 0);
        },
        // 团队标签已勾选数组
        teamCheckList() {
            return (this.copyList || []).filter(item => item.teamType == 1 && item.check);
        },
        // 我的标签已勾选数组
        myCheckList() {
            return (this.copyList || []).filter(item => item.teamType == 0 && item.check);
        },
        // 团队标签已勾选数量
        teamCheckCount() {
            return this.teamCheckList.length;
        },
        // 我的标签已勾选数量
        myCheckCount() {
            return this.myCheckList.length;
        },
        // 已经勾选的标签
        hasCheckList() {
            return this.source == 'follow' ? this.myCheckList : this.copyList.filter(item => item.check);
        },
        // 是否达到标签最大个数限制
        countIsReachLimit() {
            return this.isBelongTeam ? ((this.copyList || []).filter(item => item.teamType == 1).length == 15 ? true : false) : ((this.copyList || []).filter(item => item.teamType == 0).length == 10 ? true : false);
        },
        // 添加标签权限
        addBtnAuth() {
            return this.isBelongTeam ? this.authArr.includes('/team/tag/save.json') : this.authArr.includes('/user/tag/save.json');
        },
        // 管理标签权限
        manageBtnAuth() {
            return this.isBelongTeam ? this.authArr.includes('/team/tag/list.json') : this.authArr.includes('/user/tag/list.json');
        }
    },
    watch: {
        userTags: {
            handler(val) {
                this.originTagList = JSON.parse(JSON.stringify(val));
            },
            immediate: true
        }
    },
    data() {
        return {
            tagAddShow: false,
            tagList: [], //全部标签数组
            copyList: [], //和tagList一致，用于前端搜索
            originTagList: [], //已经对客户设置的标签数组
            searchWord: '',
            searchBlank: false, //搜索空白
            gwHasEditTeamAuth: false, //销售是否有权限勾选 团队标签
            addDialogShow: false, // 新增
            cityInfo: {}, //新增团队标签用到的
            submitting: false, //是否正在请求接口（防抖）
            modifyList: [], //有改动标签的数组
            authArr: [] //权限数组
        };
    },
    // 销毁前滚动条打开
    beforeDestroy() {
        this.setScrollHiddenOrShow('scroll');
    },
    methods: {
        onShow (item) {
            item.trackEventStartTime = Date.now(); // 记录点击时间
            console.error('show', item);
        },
        onHide (item) {
            const trackEventEndTime = Date.now();
            const duration = trackEventEndTime - item.trackEventStartTime;

            // 小于200ms 不上报
            if (duration < 200) return;

            const __duration = (duration / 1000).toFixed(1);
            const options = {
                p1: this.$store.state.user.userInfo.userId, // userid
                p2: this.customerId, // 客户id
                p3: item.title, // 标签名称
                p4: formatDate(new Date(item.trackEventStartTime), 'yyyy-MM-dd HH:mm:ss'), // 触发hover的时间
                p5: __duration, // 停留时长
                p6: item.encryptId,
                p7: item.addUserName,
                p8: item.addTime,
                p9: item.teamType,
                p10: item.city,
                p11: item.sort
            };

            this.$BossAnalytics.track('crm-customer-tag-hover', {
                ...options,
            });
        },
        // 打开浮层
        openSetTag() {
            let dom = document.getElementById('tag_setting_wrap') || '';
            if(dom) {
                this.tagAddShow = false;
                this.searchWord = '';
                this.setScrollHiddenOrShow('scroll');
                return;
            }
            let p = {
                p4: this.lib,
                target: this.customerId,
                uid: this.userInfo.userId,
                date_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            };
            if(!isNotEmpty(this.lib)) {
                delete p.p4;
            }
            this.$trackEvent({
                action: burnPointMap[this.source],
                ...p
            });
            // 请求标签数组
            this.getSwitchStatus();
            this.getAuth();
            
        },
        // 获取销售设置团队标签的权限
        getSwitchStatus() {
            this.$ajax({
                url: '/team/tag/userEditSwitch',
            }).then(({code, data}) => {
                if(code == 1) {
                    this.gwHasEditTeamAuth = data || false;
                    // 是销售角色且在合作客户管理且 “销售设置团队标签” 开关关闭了就不打开浮层
                    if(this.isGw && this.source == 'cooperation' && !this.gwHasEditTeamAuth) {
                        this.$toast({
                            content: '您无权限进行操作',
                            type: 'error'
                        });
                        return;
                    };
                    this.getTagList();
                }
            });
        },
        // 获取资源权限
        getAuth() {
            let url = this.isBelongTeam ? '/team/tag/save.json,/team/tag/list.json' : '/user/tag/save.json,/user/tag/list.json';
            this.$ajax({
                url: '/menu/function/auth.json',
                params: {
                    functionUrls: url
                }
            }).then(({code, data}) => {
                if(code == 1) {
                    this.authArr = data || [];
                };
            });
        },
        getTagList(init=true) {
            this.$ajax({
                url: this.isBelongTeam ? '/team/tag/customer/get.json' : '/user/tag/customer/get.json',
                params: {
                    customerId: this.customerId
                }
            }).then(({code, data}) => {
                if(code == 1) {
                    this.tagList = data || [];
                    this.copyList = data || [];
                    if(init) {
                        this.tagAddShow = true;
                        this.setScrollHiddenOrShow('hidden');
                        this.search = debounce(this.search, 100);
                    }
                }
            });
        },
        // 打开浮层禁用滚动条 / 关闭浮层展示滚动条 -> 团队客户/我的客户/合作客管理的列表滚动条
        setScrollHiddenOrShow(type) {
            let wholeDom = document.querySelector('#container .ui-scrollbar-wrap');
            let xDom = document.querySelector('.ui-tablepro-body.ui-tablepro-overflowX');
            
            if(wholeDom) {
                wholeDom.style.overflow = type;
                if((this.source == 'my' || this.source == 'team') && xDom) {
                    xDom.style.overflowX = type;
                }
            }
        },

        close() {
            if(this.addDialogShow) return;
            this.tagAddShow = false;
            this.searchWord = '';
            this.setScrollHiddenOrShow('scroll');
        },
        dialogClose(success = false) {
            // setTimeout作用是防止 v-clickoutside触发而关闭浮层
            setTimeout(() => {
                this.addDialogShow = false;
            });
            if (success) {
                this.getTagList(false);
            }
        },
        /* 团队标签模块展示逻辑
            团队客户：一定展示（无论角色，销售看不到该页面）
            合作客户管理：  非销售可看到，销售根据开关权限控制
            我的客户： 非销售、 销售根据开关权限控制（无权限时展示团队标签，但没有“X”号）
            跟进记录： 不展示（无权限时展示团队标签，但没有“X”号）
        */
        showTeam(source) {  
            switch (source) {
                case 'team':
                    return true;
                case 'cooperation':
                    return this.isGw ? this.gwHasEditTeamAuth : true;
                case 'my': 
                    return this.gwHasEditTeamAuth;
                case 'follow':
                    return false;
                default: 
                    return false;
            }
        },
        search() {
            this.tagList = isNotEmpty(this.searchWord) ? this.copyList.filter(item => item.title.includes(this.searchWord)) : this.copyList;
            this.searchBlank = this.tagList.length == 0 ? true : false;
        },
        setTag(item) {
            if (this.submitting) return;
            // 达到设置标签的上限，没有勾选的禁用 (团队最多3个、我的最多两个)
            if(((item.teamType == 1 && this.teamCheckCount > 2) || (this.myCheckCount > 1 && item.teamType == 0)) && !item.check) {
                return;
            }

            // 保存有修改过的标签数组
            let idx = this.modifyList.findIndex(i => i.encryptId == item.encryptId);
            if (idx > -1) {
                this.$set(this.modifyList[idx], 'check', !item.check);
            } else {
                this.modifyList.push({
                    check: !item.check,
                    encryptId: item.encryptId,
                    title: item.title,
                    teamType: item.teamType
                });
            }
            let tagIdArr = item.teamType == 1 ? this.teamCheckList.map(item => item.encryptId) : this.myCheckList.map(item => item.encryptId);

            let data = new FormData();
            data.append('customerId', this.customerId);
            if (item.check) {
                tagIdArr.splice(tagIdArr.indexOf(item.encryptId), 1);
            } else {
                tagIdArr.push(item.encryptId);
            }
            data.append('tags', tagIdArr.join(','));
            this.submitting = true;
            this.$ajax({
                url: item.teamType == 1 ? '/team/tag/customer/set.json' : '/user/tag/customer/set.json',
                method: 'POST',
                data
            }).then(({code}) => {
                if(code == 1) {
                    this.$toast({ content: '操作成功', type: 'success' });
                    this.$set(item, 'check', !item.check);
                    // 当搜索时设置标签还原到原始数组
                    this.searchWord = '';
                    this.search();
                    this.updateTagList(this.modifyList);
                }
            }).finally(() => {
                this.submitting = false;
            });
        },
        updateTagList(modifyList) {
            // 对比原标签数组和改变的标签数组，将最新的标签数组更新到页面
            for(let i = 0; i < modifyList.length; i++) {
                let item = modifyList[i];
                if (this.originTagList.length) {
                    let idx = this.originTagList.findIndex(i => (i.title == item.title) && (i.teamType == item.teamType));  //名称相同且类型形同
                    if (idx > -1) {
                        if (item.check) {
                            this.$set(this.originTagList[idx], 'addUserName', this.userInfo.name);
                            this.$set(this.originTagList[idx], 'addTime', new Date().getFullYear() + '年'+ (new Date().getMonth() + 1) +'月'+ new Date().getDate() +'日');
                        } else {
                            this.originTagList.splice(idx, 1);
                        }
                    } else {
                        if (item.check) {
                            this.originTagList.push({
                                ...item,
                                addUserName: this.userInfo.name,
                                addTime: new Date().getFullYear() + '年'+ (new Date().getMonth() + 1) +'月'+ new Date().getDate() +'日'
                            });
                        }
                    }
                } else {
                    if (item.check) {
                        this.originTagList.push({
                            ...item,
                            addUserName: this.userInfo.name,
                            addTime: new Date().getFullYear() + '年'+ (new Date().getMonth() + 1) +'月'+ new Date().getDate() +'日'
                        });
                    }
                }
            }
            this.$emit('update:userTags', this.originTagList);
            this.$emit('freshData', this.originTagList);
        },
        // 添加标签
        async addTag() {
            if(this.countIsReachLimit) return;
            if(this.isBelongTeam) {  //添加团队标签的需要请求当前所在城市，无归属城市不打开弹窗
                let res = await this.$ajax({
                    url: '/team/tag/userCity.json',
                });
                if (res.code == 1) {
                    this.cityInfo = res.data || {};
                } else {
                    return ;
                }
            }
            this.addDialogShow = true;
        },
        //跳转到客户标签设置
        jumpTagSetting() {
            this.$trackEvent({
                action: 'crm-customer-list-manage-tag',
                p2: this.isBelongTeam ? 2 : 1,
                p3: 2,
                target: this.customerId,
                uid: this.userInfo.userId,
                date_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            });
            let source = this.isBelongTeam ? 'team' : 'my';
            let url = `${this.$nginxPrefix}/dashboard/system/tagSetting/${source}Tag`;
            window.open(url, '_blank');
        },

    }
};
</script>

<style lang="less">
@import url('./index.less');
</style>