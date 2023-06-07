<template>
    <div class="recent-record-wrap" :class="{ show: value }">
       <ul class="tab-box">
            <li
                v-for="(item, index) in tabList"
                :key="index" 
                :class="item === activeTab ? 'active' : ''"
                @click="switchTab(item)"
                >
                {{ item }}
            </li>
        </ul>
        <div class="record-list">
            <ul v-if="activeTab == '商机记录'">
                <template v-if="saleList && saleList.length">
                    <li v-for="(item, index) in saleList" :key="index">
                        <!-- 头部 -->
                        <div class="header-container" @click="expandData('saleList', index)">
                            <div class="list-item">{{ item.signIntentionUpdateTime ? formatDate(new Date(item.signIntentionUpdateTime), 'yyyy/MM/dd hh:mm:ss') : '' }}</div>
                            <div class="list-item">
                                {{ item.type | saleType }}
                            </div>
                            <div class="list-item">
                                <span v-if="item.signIntention == 0">0%无意向</span>
                                <span v-else-if="item.signIntention == 1">20%找到KP</span>
                                <span v-else-if="item.signIntention == 2">40%意向客户</span>
                                <span v-else-if="item.signIntention == 3">60%方案报价</span>
                                <span v-else-if="item.signIntention == 4">80%合同流程</span>
                                <span v-else-if="item.signIntention == 5">100%已签约</span>
                                <span v-else-if="item.signIntention == 6">丢单</span>
                                <span v-else-if="item.signIntention == 7">已回款</span>
                                <span v-else>————</span>
                            </div>
                            <i :class="[ item.expand ? 'icrm-bossui-icon-up' : 'icrm-bossui-icon-down' ]"></i>
                        </div>

                        <!-- 展开内容 -->
                        <template v-if="item.expand">
                            <div class="expand-contaniner">
                                <div class="expand-item">
                                    <p>预计回款时间：{{ item.returnTime ? formatDate(new Date(item.returnTime), 'yyyy/MM/dd') : '' }}</p>
                                    <p>预计签约金额：{{ item.signMoney | currency }}</p>
                                </div>
                                <div class="expand-item">
                                    <p>预计签约时间：{{ item.signTime ? formatDate(new Date(item.signTime), 'yyyy/MM/dd') : '' }}</p>
                                    <p>预计回款金额：{{ item.returnMoney | currency }}</p>
                                </div>
                                <div class="expand-item">
                                    <p>
                                        <template v-if="item.signIntentionStopTime">
                                            进程停留：{{ item.signIntentionStopTime }}天
                                        </template>
                                        <template v-else>
                                            进程停留：————
                                        </template>
                                    </p>
                                    <p>靠谱程度：{{ item.signOptionName }}</p>
                                </div>
                            </div>
                        </template>
                    </li>
                </template>
                <div v-else class="empty-text">暂无数据</div>
            </ul>
            <ul v-else-if="activeTab == '近5条跟进记录'">
                <template v-if="followList && followList.length">
                    <li v-for="(item, index) in followList" :key="index">
                        <!-- 头部 -->
                        <div class="header-container" @click="expandData('followList', index)">
                            <div class="list-item">{{ item.followTime ? formatDate(new Date(item.followTime), 'yyyy/MM/dd hh:mm:ss') : '' }}</div>
                            <div class="list-item">
                                <template v-if="item.contactName">
                                    <dots :txt="item.contactName" :line="1" hoverColor="#8790A2"></dots>
                                </template>
                                <template v-else>
                                    ——
                                </template>

                            </div>
                            <div class="list-item">
                                <span v-if="item.signIntention == 0">0%无意向</span>
                                <span v-else-if="item.signIntention == 1">20%找到KP</span>
                                <span v-else-if="item.signIntention == 2">40%意向客户</span>
                                <span v-else-if="item.signIntention == 3">60%方案报价</span>
                                <span v-else-if="item.signIntention == 4">80%合同流程</span>
                                <span v-else-if="item.signIntention == 5">100%已签约</span>
                                <span v-else-if="item.signIntention == 6">丢单</span>
                                <span v-else-if="item.signIntention == 7">已回款</span>
                                <span v-else>————</span>
                            </div>
                            <i :class="[ item.expand ? 'icrm-bossui-icon-up' : 'icrm-bossui-icon-down' ]"></i>
                        </div>

                        <!-- 展开内容 -->
                        <template v-if="item.expand">
                            <div class="expand-contaniner">
                                <div class="expand-item">
                                    <p>
                                        跟进形式：<span v-if="item.followType == 0">电话</span>
                                        <span v-else-if="item.followType == 1">面谈</span>
                                        <span v-else-if="item.followType == 2">微信/QQ</span>
                                        <span v-else-if="item.followType == 3">系统</span>
                                    </p>
                                    <p>预计签单金额：{{ item.signMoney | currency }}</p>
                                </div>
                                <div class="expand-item">
                                    <p>所属部门：<span v-if="item.followUserRole == 2">{{ item.followDeptName }}</span>
                                        <span v-else>{{ item.departmentName }}</span>
                                    </p>
                                    <p>预计签单日期：{{ item.signTime ? formatDate(new Date(item.signTime), 'yyyy/MM/dd') : ''  }}</p>
                                </div>
                                <div class="expand-item">
                                     <p>商务顾问：<span v-if="item.followUserRole == 2">{{ item.followUserName }}</span>
                                        <span v-else>{{ item.userName }}</span>
                                    </p>
                                </div>
                                <div class="expand-item">
                                    <p class="dots-container">
                                        <dots v-if="item.followNotes" :txt="'跟进记录：'+ item.followNotes" :line="2" hoverColor="#8790A2"></dots>
                                        <template v-else>跟进记录：</template>
                                    </p>
                                </div>
                            </div>
                        </template>
                    </li>
                </template>
                <div v-else class="empty-text">暂无数据</div>
            </ul>

            <ul v-if="activeTab == '近3条协进任务'">
                <template v-if="taskList && taskList.length">
                    <li v-for="(item, index) in taskList" :key="index">
                        <!-- 头部 -->
                        <div class="header-container" @click="expandData('taskList', index)">
                            <div class="list-item">{{ item.createTime ? formatDate(new Date(item.createTime), 'yyyy/MM/dd hh:mm:ss') : ''  }}</div>
                            <div class="list-item">{{ item.missionTypeName }}</div>
                            <div class="list-item">{{ item.missionStatusName }}</div>
                            <i :class="[ item.expand ? 'icrm-bossui-icon-up' : 'icrm-bossui-icon-down' ]"></i>
                        </div>

                        <!-- 展开内容 -->
                        <template v-if="item.expand">
                            <div class="expand-contaniner">
                                <div class="expand-item">
                                    <p>创建人：{{ item.createUserName }}</p>
                                    <p>执行人：{{ item.executorName }}</p>
                                </div>
                                <div class="expand-item">
                                    <p>截止时间：{{ item.deadLine ? formatDate(new Date(item.deadLine), 'yyyy/MM/dd hh:mm') : ''  }}</p>
                                    <p>优先级：{{ item.priorityName }}</p>
                                </div>
                                <div class="expand-item">
                                    <p>任务描述：<dots v-if="item.description" :hoverColor="'#8790A2'" referenceHtml :txt="item.description.replaceAll('\n', '<br/>')" :line="2"></dots></p>
                                </div>
                            </div>
                        </template>
                    </li>
                </template>
                
                <div v-else class="empty-text">暂无数据</div>
            </ul>
        </div>
    </div>
</template>

<script>
import { formatDate } from '@/utils/tools/utils.js';

const saleTypeList = [
    { key: 1, value: '进行中商机' },
    { key: 2, value: '关闭商机' },
    { key: 3, value: '应收商机' },
    { key: 4, value: '战胜商机' },
];
export default {
    name: 'recent-record',

    model: {
        props: 'value',
        event: 'change',
    },

    props: {
        value: Boolean,
        followList: {
            type: Array,
            default: () => []
        },
        saleList: {
            type: Array,
            default: () => []
        },
        taskList: {
            type: Array,
            default: () => []
        },
        hasUrgentTLTask: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        hasUrgentTLTask: {
            handler(val) {
                if(val) {
                    this.$emit('change', true);
                    this.activeTab = '近3条协进任务';
                } else {
                    if (Array.isArray(this.saleList) && this.saleList.length == 0 && this.followList.length != 0) { //商机记录 无数据且 近五条记录 有数据时 默认在 近五条记录 tab
                        this.activeTab = '近5条跟进记录';
                    } else {
                        this.activeTab = '商机记录';
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            tabList: ['商机记录', '近3条协进任务', '近5条跟进记录'],
            activeTab: '',
        };
    },
    filters: {
        saleType(type) {
            return (saleTypeList.find(item => item.key == type) || {}).value || '——';
        },
    },
    methods: {
        formatDate,
        switchTab(item) {
            this.activeTab = item;
        },
        // 展开每项
        expandData(type, index) {
            this[type][index].expand = !this[type][index].expand;
        }
    }
};
</script>
<style lang="less">
.recent-record-wrap {
    position: absolute;
    top: 28px;
    right: 0;
    height: calc(~"100vh - 200px");
    transform: translateX(100%);
    width: 100%;
    background-color: #F7F8FB;
    transition: transform .3s ease-in-out;
    border-radius: 4px;
    & .record-list {
        display: none;
    }
    &.show {
        transform: translateX(0);
        .record-list {
            display: block;
        }
    }
    .tab-box {
        z-index: 0;
        background: #F7F8FB;
        color: #8790A2;
        margin-bottom: 10px !important;
        li {
            margin: 0 12px;
            &:hover {
                color: #414A60;
                font-weight: 500;
            }
        }
        .active {
            color: #414A60;
            font-weight: 500;
            &::after {
                margin: 0 auto;
                width: 32px;
                height: 4px;
                background-color: #0CC3BC;
                border-radius: 4px 4px 0px 0px;
            }
            
        }
        &::after {
            height: 0;
        }
    }
    .record-list {
        padding: 0px 16px 16px 16px;
        background-color: #F7F8FB;

        li {
            position: relative;
            line-height: 40px;
            border-radius: 4px;
            &:not(:first-child) {
                margin-top: 4px;
            }
            .header-container {
                padding: 0 66px 0 16px;
                margin-bottom: 1px;
                background-color: #fff;
                border-radius: 4px;
                cursor: pointer;
                .list-item {
                    display: inline-block;
                    &:nth-child(1) {
                        margin-right: 42px;
                    }
                    &:nth-child(2) {
                        margin-right: 22px;
                        width: 120px;
                    }
                    ._tooltip-box {
                        max-width: 130px;
                        display: inline-block;
                        vertical-align: top;
                    }
                }
                i {
                    position: absolute;
                    right: 0;
                    padding-right: 10px;
                    color: #C0C4CC;
                }
                &:hover {
                    background: #E4E8F0;
                }
            }
            .expand-contaniner {
                padding: 12px 16px;
                display: flex;
                flex-direction: column;
                background-color: #fff;
                border-radius: 4px;
                .expand-item {
                    color: #8790A2;
                    display: flex;
                    &:not(:first-child) {
                        margin-top: 8px;
                    }
                    &>p {
                        flex: 1;
                        line-height: 20px;
                    }
                    ._tooltip-box {
                        display: inline-block;
                        vertical-align: top;
                    }
                    .dots-container {
                        // position: relative;
                        // padding-left: 70px;
                        // .follow-text {
                        //     position: absolute;
                        //     left: 0;
                        // }
                    }
                }
            }
        }
        .empty-text {
            position: absolute;
            left: 50%;
            top: 50%;
            color: #8790A2;
        }
    }
}
.customer-name-popover {
    background: rgba(54, 63, 85, 0.76) !important;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.16) !important;
    border-radius: 4px !important;
}
</style>

