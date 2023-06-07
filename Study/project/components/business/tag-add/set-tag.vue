<template>
    <div class="set-customer-tag-dialog">
        <div class="set-tag-title">
            <div class="title-left">
                <span class="sub-title">{{isBelongTeam ? '设置团队客户标签' : '设置我的标签' }}</span>
                <span class="num">（{{hasSetNum}}/{{tagList.length}}）</span>
                <span class="tag-tips" v-if="!isBelongTeam">
                    <ui-tooltip 
                        width="204" 
                        :trigger="'hover'" 
                        :placement="'top-right'"
                        theme="dark">
                        <i slot="reference" class="icrm-info-tooltip"></i>
                        <ul slot="content">
                        <p>（仅可调整自己标记的客户标签）</p>
                        </ul>
                    </ui-tooltip>
                </span>
            </div>
            <div class="title-right" @click="jumpTagSetting">
                <span>管理标签</span><i class="icrm-bossui-icon-right"></i>
            </div>
        </div>
        <div class="tag-list" v-if="tagList.length">
            <li v-for="item in tagList" :key="item.encryptId" :class="{'has-set': item.check, 'disabled': submitting}" @click="setTag(item)">{{item.title}}</li>
        </div>
        <div class="tag-blank" v-if="tagList.length == 0 || isLoading">
            <span>{{ isLoading ? '加载中...' : '暂无标签～' }}</span>
        </div>
        <div v-if="!showForm" class="add-tag" @click="showAddTagSection">
            <i class="icrm-icon-plus"></i><span>新增标签</span>
        </div>
        <template v-else>
            <ui-form class="form-wrapper" ref="form" :model="formData" :rules="ruleData" labelPosition="top">
                <form-item prop="title" v-if="!isBelongTeam">
                    <div class="my-tag-create-wrap">
                        <ui-input 
                            v-model.trim="formData.title" 
                            placeholder="请输入名称" 
                            :maxlength="6" 
                            counter>
                        </ui-input>
                        <span @click="confirm" class="confirm-common">确定</span><span class="confirm-common cancel" @click="showForm=false">取消</span>
                    </div>
                </form-item>
                <div class="team-tag-create-wrap" v-else>
                    <form-item prop="title" label="标签名称">
                        <ui-input 
                            v-model.trim="formData.title" 
                            placeholder="请输入名称" 
                            :maxlength="6" 
                            counter>
                        </ui-input>
                    </form-item><!-- 
                    --><form-item label="归属城市">
                        <ui-select v-model="deptId" placeholder="请选择" disabled>
                            <ui-option 
                                v-for="item in cityList" 
                                :value="item.encryptId"
                                :key="item.encryptId">{{item.name}}
                            </ui-option>
                        </ui-select>
                    </form-item><!--  
                    --><form-item label="归属城市" class="label-hidden">
                        <span class="confirm-common" @click="confirm">确定</span><span class="confirm-common cancel" @click="showForm=false">取消</span>
                    </form-item>
                </div>
            </ui-form>
        </template>
    </div>
</template>

<script>

import { mapState } from 'vuex';
import { formatDate } from '@/utils/tools/utils.js';

export default {
    name: 'set-tag',
    props: {
        customerId: {
            type: String,
            default: ''
        },
        source: {  //区分是团队还是我的标签的设置
            type: String,
            default: ''
        },
        isBelongTeam: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 已经勾选的数量
        hasSetNum() {
            return this.tagList.filter(item => item.check).length;
        },
        // 已经勾选的标签id数组
        checkTagsIdList() {
            return (this.tagList.filter(item => item.check) || []).map(item => item.encryptId);
        },
        ...mapState({
            userInfo: state => state.user.userInfo
        })
    },
    created() {
        this.getTagList();
        if (this.isBelongTeam) {
            this.getCityList();
        }
    },
    data () {
        return {
            tagList: [],
            showForm: false,
            formData: {
                title: ''
            },
            deptId: '',
            cityList: [],
            ruleData: {
                title: [
                    { required: false, message: '请输入名称', trigger: 'blur'},
                    {min: 1, max: 6, message: '请输入1-6个字', trigger: 'blur'}
                ],
            },
            isLoading: false,
            isChange: false, //是否改变了（用于判定关闭按钮后是否需要刷新页面）
            submitting: false, //是否正在请求接口（防抖）
            modifyList: [] //设置过标签的数组
        };
    },
    methods: {
        getTagList() {
            this.tagList = [];
            this.isLoading = true;
            this.$ajax({
                url: this.isBelongTeam ? '/team/tag/customer/get.json' : '/user/tag/customer/get.json',
                // url: 'https://api.weizhipin.com/mock/175/user/tag/customer/get.json',
                params: {
                    customerId: this.customerId
                }
            }).then(({code, data}) => {
                if(code == 1) {
                    this.tagList = data || [];
                }
            }).finally(() => {
                this.isLoading = false;
            });
        },
        // 获取城市下拉列表
        getCityList() {
            this.$ajax({
                url: '/team/tag/userCity.json',
                // url: 'https://api.weizhipin.com/mock/175/team/tag/city.json',
            }).then(({code, data}) => {
                if(code == 1) {
                    this.cityList.push(data || {});;
                    this.deptId = data && data.encryptId;
                }
            });
        },
        // 设置标签
        setTag(item) {
            // 勾选数量限制
            if (!item.check) {
                if (!this.isBelongTeam && this.hasSetNum == 2) {
                    this.$toast({
                        type: 'error',
                        content: '每个客户最多可勾选2个我的标签'
                    });
                    return ;
                }else if (this.isBelongTeam && this.hasSetNum == 3) {
                    this.$toast({
                        type: 'error',
                        content: '每个客户最多可勾选3个团队标签'
                    });
                    return;
                }
            }
            if (this.submitting) {
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
                    teamType: this.isBelongTeam ? 1 : 0
                });
            }

            let tags = JSON.parse(JSON.stringify(this.checkTagsIdList));
            let data = new FormData();
            data.append('customerId', this.customerId);
            if (item.check) {
                tags.splice(tags.indexOf(item.encryptId), 1);
            } else {
                tags.push(item.encryptId);
            }
            data.append('tags', tags.join(','));
            this.submitting = true;
            this.$ajax({
                url: this.isBelongTeam ? '/team/tag/customer/set.json' : '/user/tag/customer/set.json',
                method: 'POST',
                // url: 'https://api.weizhipin.com/mock/175/team/tag/customer/set.json',
                data
            }).then(({code, message}) => {
                if(code == 1) {
                    this.$toast({ content: message, type: 'success' });
                    this.$set(item, 'check', !item.check);
                    this.$emit('change', this.modifyList);
                }
            }).finally(() => {
                this.submitting = false;
            });
        },
        //添加标签
        confirm() {
            if (!this.formData.title) {
                this.$toast({
                    type: 'error',
                    content: '请输入标签名称'
                });
                return ;
            }
            this.burnPoint(1);
            let data = new FormData();
            data.append('title', this.formData.title);
            if (this.isBelongTeam) {
                data.append('deptId', this.deptId);
            }
            this.$ajax({
                url: this.isBelongTeam ? '/team/tag/save.json' : '/user/tag/save.json',
                method: 'POST',
                // url: 'https://api.weizhipin.com/mock/175/team/tag/save.json',
                data
            }).then(({code, message}) => {
                if(code == 1) {
                    this.$toast({ content: message, type: 'success' });
                    this.showForm = false;
                    this.formData.title = '';
                    this.getTagList();
                }
            });
        },
        showAddTagSection() {
            if (!this.isBelongTeam && this.tagList.length == 10) {
                this.$toast({
                    type: 'error',
                    content: '每个用户最多创建10个生效中的我的标签'
                });
                return ;
            }else if (this.isBelongTeam && this.tagList.length == 15) {
                this.$toast({
                    type: 'error',
                    content: '每个城市最多创建15个生效中的团队标签'
                });
                return;
            }
            this.showForm = true;
        },
        //跳转到客户标签设置
        jumpTagSetting() {
            this.burnPoint(2);
            let source = this.source == 'team' || this.source == 'cooperation' ? 'team' : 'my';
            let url = `${this.$nginxPrefix}/dashboard/system/tagSetting/${source}Tag`;
            window.location.href = url;
        },
        // 埋点
        burnPoint(opType) {
            this.$trackEvent({
                action: 'crm-customer-list-manage-tag',
                p2: this.source == 'my' ? 1 : 2,
                p3: opType,
                target: this.customerId,
                uid: this.userInfo.userId,
                date_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            });
        }
    },
};
</script>
<style lang="less" scoped>
    .set-customer-tag-dialog {
        .set-tag-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-right: 28px;
            .title-left {
                display: flex;
                align-items: center;
                .sub-title {
                    font-size: 16px;
                    font-weight: 500;
                    color: #1E2433;
                }
                .num {
                    font-size: 13px;
                    color: #9FA6B5;
                }
                .tag-tips {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    i {
                        color: rgb(159, 166, 181);
                    }
                    &:hover {
                        background: #e4e8f0;
                        border-radius: 4px;
                    }
                }
            }
            .title-right {
                color: #01A09C;
                cursor: pointer;
                &:hover {
                    color: rgba(1,160,156,.7)
                }
                i {
                    font-size: 12px;
                    margin-left: 2px;
                }
            }
        }
        .tag-list {
            margin: 24px 28px 24px 0;
            min-height: 100px;
            >li {
                display: inline-block;
                line-height: 18px;
                padding: 5px 10px;
                border-radius: 4px;
                border: 1px solid #DBDFE6;
                color: #363F55;
                font-size: 13px;
                margin: 0 8px 8px 0;
                cursor: pointer;
            }
            .has-set {
                border-color: #00BEBD;
                background: #E4F7F7;
                color: #01A09C;
            }
            .disabled {
                pointer-events: none;
            }
        }
        .tag-blank {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #F7F8FB;
            width: 100%;
            height: 100px;
            font-size: 13px;
            color: #9FA6B5;
            margin: 24px 0;
        }
        .add-tag {
            display: inline-flex;
            line-height: 20px;
            align-items: center;
            font-size: 14px;
            color: #01A09C;
            cursor: pointer;
            &:hover {
                color: rgba(1,160,156,.7)
            }
            >span {
                margin-left: 2px;
            }
        }
        .form-wrapper {
            padding: 16px;
            border-radius: 8px;
            background: #F7F8FB;
            /deep/.form-item {
                display: inline-block;
                margin-bottom: 0;
                .confirm-common {
                    color: #01A09C;
                    cursor: pointer;
                }
                .cancel {
                    position: relative;
                    padding-left: 17px;
                    &::before {
                        position: absolute;
                        content: "";
                        left: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 1px;
                        height: 12px;
                        background: #dbdfe6;
                    }
                }
                .input,
                .ui-select-selection {
                    border-radius: 4px;
                }
                .my-tag-create-wrap {
                    display: flex;
                    align-items: center;
                    .input-wrap {
                        min-width: auto;
                        width: 259px;
                        margin-right: 8px;
                    }
                }
            }
            .team-tag-create-wrap {
                /deep/.form-item {
                    .item-label {
                        padding-bottom: 6px;
                    }
                    .input-wrap {
                        min-width: auto;
                        width: 130px;
                        margin-right: 8px;
                    }
                    .ui-select {
                        width: 121px;
                        margin-right: 8px;
                    }
                }
                .label-hidden {
                    /deep/.item-label {
                        visibility: hidden;
                    }
                    /deep/.item-content {
                        white-space: nowrap;
                    }
                }
            }
        }
    }
</style>