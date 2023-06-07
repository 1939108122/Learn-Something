<template>
    <div class="tag-add-show-wrapper">
        <template v-if="userTags && userTags.length">
            <li v-for="item in userTags" :key="item.encryptId" :class="{'team-tag': item.teamType == 1}">
                <ui-tooltip 
                    width="180" 
                    :trigger="'hover'" 
                    :placement="'top-right'"
                    theme="dark"
                    appendToBody>
                    <span slot="reference" style="cursor:default">{{ item.title }}</span>
                    <ul slot="content">
                        <p>标记人：{{ item.addUserName }}</p>
                        <p>标记时间：{{ item.addTime }}</p>
                    </ul>
                </ui-tooltip>
            </li>
        </template>
        <div class="add-tag-btn" @click="openSetTag">
            <i class="icrm-icon-plus"></i><span v-if="userTags && !userTags.length">添加标签</span>
        </div>
        <!-- 弹框：标签设置 -->
        <div v-if="setTagDialogShow">
            <ui-dialog v-model="setTagDialogShow" :showHeader="false" width="420" lock prevent-layer :showFooter="false" @on-close="close">
                <set-tag v-if="setTagDialogShow" slot="content" :customerId="customerId" :source="source" :isBelongTeam="isBelongTeam" @change="judgeIsChange"></set-tag>
            </ui-dialog>
        </div>
    </div>
</template>

<script>
import setTag from './set-tag.vue';
import { mapState } from 'vuex';
import { isNotEmpty } from '@/utils/tools/tools.js';
import { formatDate } from '@/utils/tools/utils.js';

const burnPointMap = {
    'team': 'crm-teamcust-list-set-tag',
    'my': 'crm-mycust-list-set-tag',
    'cooperation': 'crm-coopcust-list-set-tag',
    'follow': 'crm-mycust-list-follownote'
};

export default {
    name: 'tag-add-show',
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
            type: String | Number,
            default: ''
        }
    },
    components: {
        setTag
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        }),
        isBelongTeam() { //是否属于设置团队标签的弹窗
            return this.source == 'team' || this.source == 'cooperation';
        }
    },
    watch: {
        userTags: {
            handler(val) {
                this.tagList = JSON.parse(JSON.stringify(val));
            },
            immediate: true
        }
    },
    data() {
        return {
            tagList: [], //设置完后最新数组
            setTagDialogShow: false,
            isChange: false, //弹窗内是否改变了（用于判定关闭按钮后是否需要刷新页面）
        };
    },
    methods: {
        judgeIsChange(modifyList) {
            this.isChange = true;
            // console.log(modifyList, 'modifyList');
            // 对比原标签数组和改变的标签数组，将最新的标签数组更新到页面
            for(let i = 0; i < modifyList.length; i++) {
                let item = modifyList[i];
                if (this.tagList.length) {
                    let idx = this.tagList.findIndex(i => (i.title == item.title) && (i.teamType == item.teamType));  //名称相同且类型形同
                    if (idx > -1) {
                        if (item.check) {
                            // console.log('idx > -1 check');
                            this.$set(this.tagList[idx], 'addUserName', this.userInfo.name);
                            this.$set(this.tagList[idx], 'addTime', new Date().getFullYear() + '年'+ (new Date().getMonth() + 1) +'月'+ new Date().getDate() +'日');
                        } else {
                            // console.log('idx > -1 !check');
                            this.tagList.splice(idx, 1);
                        }
                    } else {
                        if (item.check) {
                            // console.log('idx  check');
                            this.tagList.push({
                                ...item,
                                addUserName: this.userInfo.name,
                                addTime: new Date().getFullYear() + '年'+ (new Date().getMonth() + 1) +'月'+ new Date().getDate() +'日'
                            });
                        }
                    }
                } else {
                    if (item.check) {
                        this.tagList.push({
                            ...item,
                            addUserName: this.userInfo.name,
                            addTime: new Date().getFullYear() + '年'+ (new Date().getMonth() + 1) +'月'+ new Date().getDate() +'日'
                        });
                    }
                }
            }
            // console.log(this.tagList, 'tagList');
        },
        close() {
            if (this.isChange) {
                this.$emit('update:userTags', this.tagList);
            }
        },
        async openSetTag() {
            // 接口报错不让打开弹窗
            if (this.source == 'team' || this.source == 'cooperation') {
                let res = await this.$ajax({
                    url: '/team/tag/userCity.json',
                });
                if (res.code !== 1) {
                    return;
                }
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
            this.setTagDialogShow = true;
        }

    }
};
</script>

<style lang="less" scoped>
.tag-add-show-wrapper {
    li {
        display: inline-block;
        line-height: 20px;
        height: 20px;
        padding: 0 3px;
        border-radius: 3px;
        margin: 0 4px 4px 0;
        font-size: 12px;
        background: #F2F4F7;
    }
    .team-tag {
        background: #E7F9F9;
        color: #008884;
    }
    .add-tag-btn {
        display: inline-flex;
        height: 20px;
        align-items: center;
        padding: 0 3px;
        color: #9FA6B5;
        border: 1px solid #F1F2F5;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
            color: #01A09C;
            border-color: rgb(1, 160, 156);
        }
        >span, i {
            font-size: 12px;
        }
    }
}
</style>