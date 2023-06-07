<template>
    <div class="sheet-panel _clue-sheet-panel">
        <div class="sheet-title">
            <h2 class="title">{{customerInfo.customerName}}
                <p class="right-btn">
                    <button class="btn btn-primary" @click="follow()" :disabled="isLoading">跟进</button>
                    <button class="btn btn-primary" @click="addTask(true)" :disabled="isLoading">添加任务</button>
                    <!--  在拨打库-->
                    <button class="btn btn-primary" @click="addLib()" :disabled="isLoading" v-if="userId == customerInfo.userId && echoTestUser && customerInfo.customerPlace == 1 && customerInfo.canMoveToBusi"  >加入商机库</button>
                    <button class="btn btn-primary btn-outline" @click="giveUp()" v-if="userId == customerInfo.userId" :disabled="isLoading">释放</button>
                </p>
            </h2>
            <p class="company-tip">
                <span v-if="customerInfo.customerStatusName">{{customerInfo.customerStatusName}}</span><span v-if="customerInfo.firstClueSeaTypeName">{{customerInfo.firstClueSeaTypeName}}</span><span v-if="customerInfo.signIntentionName">{{customerInfo.signIntentionName}}</span><span v-if="customerInfo.lastEndTimeDesc">剩余客保{{customerInfo.lastEndTimeDesc}}</span>
            </p>
            <table class="info">
                <tr class="head">
                    <td>预计签单金额</td>
                    <td>预计签单时间</td>
                    <td>上次跟进时间</td>
                    <td>有效拨打</td>
                    <td>所属销售</td>
                </tr>
                <tr class="body">
                    <td>¥{{formatMoney(customerInfo.signMoney || 0)}}</td>
                    <td>{{customerInfo.signDate || '-'}}</td>
                    <td>{{customerInfo.lastFollowDate || '-'}}</td>
                    <td class="valid-call">
                        {{customerInfo.validCall}}
                        <template v-if="pathType == 'newpending'">
                            <span class="complete-3" :class="{'complete-3-finished': customerInfo.completeThree}"></span><span class="complete-7" :class="{'complete-7-finished': customerInfo.completeSeven}"></span>
                        </template>
                    </td>
                    <td>{{customerInfo.deptName}}-{{customerInfo.userName}}</td>
                </tr>
            </table>
        </div>
        <div class="sheet-wrapper">
            <div class="sheet-block">
                <ul class="tab-box _clue-detail-tab">
                    <li 
                        v-for="(item,index) in componentList"
                        :key="index" 
                        :class="{'active':item.component == curComponent.component}" 
                        @click="changeType(item)">
                        {{ item.label }}({{customerInfo[item.countKey] || 0}})
                    </li>
                    <button class="btn btn-primary btn-outline sub-right-btn" @click="customerDetail" :disabled="isLoading">客户详情</button>
                </ul>
                <component
                    ref="listComponent"
                    :is="curComponent.component"
                    :key="curComponent.component"
                    :customerId="customerId"
                    :contactList="contactList"
                    :customerInfo="customerInfo"
                    :showMore="showMore"
                    :needCall="needCall"
                    :pathType="pathType"
                    class="dialog-detail-component"
                    @closeDialog="closeDialog"
                    @updateInfo="updateInfo"
                    @addTask="addTask()"
                    @updateCanMoveToBusi="updateCanMoveToBusi"></component>
            </div>
        </div>
        <!--添加任务-->
        <TaskAdd v-model="addVisible"
            @close="closeAdd"
            @update="updateList"
            :defaultMissionName="defaultMissionName"
            :defaultCustomerList="defaultCustomerList"
            :disabledCustomerId="true"
            from="7"
            :defaultMissionType="3"
            :executorId="executorId"></TaskAdd>
        <!-- 跟进 -->
        <ui-full-dialog v-if="showFollowup" @update:close="hideFollowup" :second="true">
            <customer-follow-add
                :id="followInitData.id"
                :customerName="followInitData.customerName"
                :contactId="followInitData.contactId"
                :contactName="followInitData.contactName"
                :source="followInitData.source"
                :dataSource="followInitData.dataSource"
                :followUserRole="followInitData.followUserRole"
                :fromClue="followInitData.fromClue"
                :boss="followInitData.boss"
                @onCompleteFollowing="onCompleteFollowing"></customer-follow-add>
        </ui-full-dialog>
    </div>
</template>

<script>
import clue from './detail/clue.vue'; //公海 待处理线索
import priviteClue from './detail/private-clue.vue';  //私海 待处理线索
import callin from './detail/callin.vue';
import task from './detail/task.vue';
import { formatMoney, formatParams } from '@/utils/tools/utils.js';
import TaskAdd from '@/components/business/task-add/index.vue'; // 添加任务
import customerFollowAdd from '@/components/business/customer-follow-add';
export default {
    name: 'clue-detail',
    data () {
        return {
            curComponent: {},
            componentList: [
                {
                    label: '待处理线索',
                    component: this.pathType == 'newpending' ? 'clue' : 'priviteClue',
                    countKey: 'countPendingClue',
                    trackCode: 1
                },
                {
                    label: '待拨打callin',
                    component: 'callin',
                    countKey: 'countCallClue',
                    trackCode: 2
                },
                {
                    label: '待处理任务',
                    component: 'task',
                    countKey: 'countMission',
                    trackCode: 3
                }
            ],
            customerInfo: {},
            contactList: [],
            isLoading: true,
            defaultMissionName: {
                1: 'Callin普通任务',
                2: 'Callin拜访任务',
                3: 'Callin拨打任务',
                4: 'Callin微信跟进任务'
            },
            defaultCustomerList: [],
            addVisible: false,
            userId: '', // 当前用胡id
            echoTestUser: false, // 

            showFollowup: false, //跟进
            followInitData: {
                id: '',
                customerName: '',
                contactId: '',
                contactName: '',
                source: '',
                dataSource: '',
                followUserRole: '',
                fromClue: '',
                boss: '',
            },
            executorId: ''
        };
    },
    components:{
        clue,
        callin,
        task,
        TaskAdd,
        customerFollowAdd,
        priviteClue,
    },
    props: {
        customerId: { // 必传
            type: [String, Number],
            default: ''
        },
        tabIndex: {
            type: [String, Number],
            default: '0'
        },
        showMore: { // 是否是显示更过，是则只展示列表
            type: Boolean,
            default: false
        },
        needSort: {
            type: Boolean, // 优先级高于tabIndex, 打开tab  优先级 ： 待处理线索 > 待拨打callin > 待处理任务
            default: false
        },
        needCall: {
            type: Boolean, // 只有线索需要传，不进行拨打操作
            default: true
        },
        pathType: {
            type: String,
            default: 'newpending'
        }
    },
    created () {
        if (!this.needSort){
            this.curComponent = this.componentList[this.tabIndex];
        }
        
        this.getInfo(this.needSort, true);
    },
    watch: {
        '$store.state.user.userInfo': {
            handler (val) {
                this.echoTestUser = !!val.echoTestUser;
                this.userId = val.userId || '';
            },
            immediate: true,
            deep: true
        },
    },
    methods : {
        updateCanMoveToBusi () {
            this.customerInfo.canMoveToBusi = false;
        },
        giveUp () {
            // 释放
            let vm = this;
            vm.$ajax({
                method: 'GET',
                url:'/customer/freedConfirm',
                params: {
                    id: vm.customerInfo.encryptCustomerId
                }
            }).then(({code, data, message}) => {
                if (code == 1) {
                    if (data.needConfirm) {
                        vm.$dialog({
                            title: '温馨提示',
                            userHtmlString: true,
                            content: data.message || `优质客户成单率是其他客户3倍<br>建议再与客户沟通一次，以免错失成单机会`,
                            type: 'warning',
                            cancelText: '取消',
                            onConfirm (wrap) {
                                vm.release();
                                this.hide();
                            }
                        });
                    } else {
                        vm.$dialog({
                            title: '温馨提示',
                            content: '客户已在您私海中，释放后将进入公海，确定释放吗？',
                            type: 'warning',
                            onConfirm: function() {
                                vm.release();
                                this.hide();
                            }
                        });
                    }
                };
            }, () => {
            });
            
            vm.$trackEvent({
                action: 'crm-clue-release',
                p2: vm.customerInfo.customerId,
                p12: vm.pathType == 'newpending' ? 1 : 2
            });
        },
        release () {
            let vm = this;
            
            vm.$ajax({
                method: 'POST',
                url: '/customer/freed.json',
                params: {
                    id: vm.customerInfo.encryptCustomerId,
                },
            }).then(({success, root}) => {
                if(success) {
                    vm.$toast({
                        content: root,
                        type: 'success',
                    });
                    vm.$emit('closeDialog', {update: true});
                };
                vm.$trackEvent({
                    action: 'crm-clue-release-confirm',
                    p2: vm.customerInfo.customerId,
                    p3: success? 1: 2,
                    p12: this.pathType == 'newpending' ? 1 : 2
                });
            }); 
        },
        addLib () {
            let _this = this;
            this.$dialog({
                title: '提示',
                content: '是否加入商机库',
                type: 'warning',
                preventConfirm: true,
                confirmLoading: true,
                onConfirm() {
                    _this.$ajax({
                        url: '/customer/echo/callToBusi.json',
                        method: 'GET',
                        params: {id: _this.customerInfo.encryptCustomerId, needCall: _this.needCall}
                    }).then( ({success, message, root}) => {
                        _this.$toast({
                            content: message,
                            type: success ? 'success' : 'error',
                        });
                        if(success) {
                            _this.getInfo();
                            _this.$emit('updateInfo');
                            _this.customerInfo.canMoveToBusi = false;
                        }
                        this.hide();
                        _this.$trackEvent({
                            action: 'crm-join-business-confirm',
                            p2: _this.customerInfo.customerId,
                            p3: success? 1: 2,
                            p12: _this.pathType == 'newpending' ? 1 : 2
                        });
                    });
                }
            });

            this.$trackEvent({
                action: 'crm-join-business',
                p2: this.customerInfo.customerId,
                p12: this.pathType == 'newpending' ? 1 : 2
            });
        },
        addTask (fromTop) {
            this.defaultCustomerList = [
                {
                    customerId: this.customerInfo.encryptCustomerId,
                    customerName: this.customerInfo.customerName
                }
            ];

            this.addVisible = true;
            this.executorId = this.customerInfo.encryptUserId;
            if (fromTop) {
                this.$trackEvent({
                    action: 'crm-addTask',
                    p1: 5,
                    p2: this.customerInfo.customerId,
                    p12: this.pathType == 'newpending' ? 1 : 2
                });
            }
        },
        closeAdd (res) {
            // TODO 关闭添加线索
            this.addVisible = false;
        },
        updateList () {
            // 更新列表
            // 只更新部分数据
            this.getInfo();
            this.$refs.listComponent && this.$refs.listComponent.getList();
            this.$emit('updateInfo');
        },
        follow () {
            
            // 跟进记录回填初始化信息
            this.followInitData = {
                id: this.customerInfo.encryptCustomerId,
                customerName: this.customerInfo.customerName,
                contactId: this.customerInfo.lastContactId,
                contactName: this.customerInfo.lastContactName,
                source: '',
                dataSource: 6,
                followUserRole: 2,
                fromClue: 1,
                boss: 1,
            };
            this.showFollowup = true;

            try{
                this.$trackEvent({
                    action: 'crm-clue-follow',
                    p2: this.customerInfo.customerId,
                    p12: this.pathType == 'newpending' ? 1 : 2
                });
            } catch (e) {
                console.log(e);
            }

        },
        hideFollowup () {
            setTimeout(() => {
                this.showFollowup = false;
            }, 500);
        },
        onCompleteFollowing () {
            this.hideFollowup();
            // 关闭客户详情弹窗
            this.$seeCustomer.hide();
        },
        formatMoney,
        changeType (item) {
            this.curComponent = item;
            this.dotrack(item);
        },
        dotrack (item) {
            let vm = this;
            vm.$trackEvent({
                action: 'crm-clue-tab',
                p2: vm.customerInfo.customerId,
                p3: item.trackCode,
                p12: vm.pathType == 'newpending' ? 1 : 2
            });
        },
        customerDetail () {
            let vm = this;
            if (this.isLoading) {
                return;
            }
            
            // 新版本查看客户详情
            let menuPrefix = '';
            if(this.customerInfo.firstClueSeaTypeName == '私海') {
                menuPrefix = this.$store.state.user.userInfo.userId == this.customerInfo.userId ? 'my' : 'team';
            } else {
                menuPrefix = 'cluepend';
            };
            this.$seeCustomer({
                menuPrefix: menuPrefix,
                customerId: this.customerInfo.encryptCustomerId,
                fid: Date.now(),
            });

            vm.$trackEvent({
                action: 'crm-clue-customer-details',
                p2: vm.customerInfo.customerId,
                p12: vm.pathType == 'newpending' ? 1 : 2
            });
        },
        getInfo (needSort, init) {
            this.isLoading = true;
            this.$ajax({
                method: 'GET',
                url:'/clue/customer/detail',
                // url: 'http://api.kanzhun-inc.com/mock/175/clue/customer/detail',
                params: {
                    customerId: this.customerId
                }
            }).then(({code, data}) => {
                this.isLoading= false;
                if (code == 1) {
                    this.customerInfo = data || {};
                    this.contactList = data.contactList;

                    if (needSort) {
                        let list = this.componentList.filter(item => {
                            return this.customerInfo[item.countKey] > 0;
                        });

                        this.curComponent = list[0] || this.componentList[0];
                    }

                    if (init) {
                        this.dotrack(this.curComponent);
                    }
                };
            }, () => {
            });
        },
        closeDialog (res) {
            // 关闭弹窗
            this.$emit('closeDialog', res);
        },
        updateInfo () {
            // 只更新部分数据
            this.getInfo();
            this.$emit('updateInfo');
        }
    }
};
</script>

<style lang="less">
    ._clue-sheet-panel{
        .sheet-title{
            z-index: 10;
            padding-bottom: 15px;
        }
        .title{
            font-size: 18px;
            font-weight: 500;
            position: relative;
            box-sizing: border-box;
            padding-right: 370px;
            // height: 32px;
            line-height: 32px;
        }
        .right-btn{
            position: absolute;
            right: 0px;
            top: 0 !important;
            display: inline-block;
            z-index: 2;
        }
        .sub-right-btn{
            position: absolute;
            right: 0px;
            top: 8px !important;
            display: inline-block;
            z-index: 2;
            line-height: 27px;
        }
        .company-tip{
            // padding-top: 10px;
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #828A9E;
            line-height: 20px;
            span {
                padding: 0 10px;
                display: inline-block;
                vertical-align: middle;
                &:nth-child(1){
                    padding-left: 0px;
                }
                &:not(&:nth-child(1)) {
                    position: relative;
                    &::before{
                        position: absolute;
                        display: inline-block;
                        content: " ";
                        height: 2px;
                        width: 2px;
                        background: rgba(130, 138, 158, 1);
                        border-radius: 2px;
                        left: -1px;
                        top: 9px;
                    }
                }
            }
        }
        .info{
            margin-top: 15px;
            width: 100%;
            .head {
                td{
                    // text-align: center;
                    font-size: 14px;
                    font-weight: 400;
                    color: #828A9E;
                }
            }
            .body{
                td{
                    font-size: 14px;
                    font-weight: 400;
                    color: #414A60;
                }
            }
        }
        .sheet-wrapper {
            padding-right: 20px;
            .sheet-block{
                padding: 20px 0;
                padding-top: 2px;
            }
        }
        ._clue-detail-tab{
            padding: 0;
            position: relative;
            .btn{
                right: 20px;
                top: 10px;
            }
        }
        .dialog-detail-component{
             padding: 20px 20px 0;
        }
        .valid-call{
            height: 25px;
            span{
                // margin: 0 3px;
                display: inline-block;
                height: 25px;
                width: 25px;
                background-size: 100%  !important;
                vertical-align: middle;
            }
            .complete-3{
                background: url("~@/assets/images/clue/3.png") no-repeat;
                &-finished{
                    background: url("~@/assets/images/clue/3-completed.png") no-repeat;
                }
            }
            .complete-7{
                background: url("~@/assets/images/clue/7.png") no-repeat;
                &-finished{
                    background: url("~@/assets/images/clue/7-completed.png") no-repeat;
                }
            }
        }
        .no-data-image{
            background: url("~@/assets/images/ui/icon-blank.png") no-repeat;
            background-size: cover;
            display: inline-block;
            height: 205px;
            width: 320px;
        }
        .no-data-txt{
            font-size: 12px;
            color: rgba(54, 63, 85, 1);
            span{
                cursor: pointer;
                color: rgba(0, 176, 169, 1);
                margin: 0 10px;
            }
        }
    }
</style>