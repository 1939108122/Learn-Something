<template>
    <div class="call-common" v-drag="{handle: '.exhibition'}">
        <!-- 当前线路 -->
        <span class="current-supplier" v-if="callParams.supplierName">{{ callParams.supplierName }}</span>
        <!-- 关闭功能 -->
        <template v-if="dialType == 'ending' && (callParams.needCallinQuestion != 'true' || isCompleted)">
            <a href="javascript:;" class="ending-close" @click.prevent="destroyDial"><i class="icrm-close"></i></a>
        </template>
        <!-- 展示区域 -->
        <div class="exhibition"> 
            <div class="exhibition-info">
                <div class="avatar">
                    <img :src="avatarUrl" alt="">
                </div>
                <div class="monicker">{{ monickerName }}</div>
                <!-- 添加企业微信好友相关功能 -->
                <template v-if="qywx.enable && callParams.callOther == 'N' && (dialType == 'talking' || dialType == 'ending')">
                    <div class="call-enterprise-wrapper" v-clickoutside="hideEnterpriseList">
                        <div v-if="qywx.friend" class="enterprise-frind">已是好友</div>
                        <template v-else>
                            <div class="enterprise-trigger" :class="{'unable': !qywx.canSend}" @click="openEnterpriseList">发送企业微信<i class="icrm-bossui-icon-down"></i></div>
                            <div class="enterprise-list" v-show="qywx.show">
                                <div class="radio-list">
                                    <ui-radio-group v-model="qywx.sendChannel">
                                        <ui-radio 
                                            v-for="item in qywx.sendChannels"
                                            :label="item.sendChannel" 
                                            :key="item.sendChannel">{{item.sendChannelName}}：{{item.text}}</ui-radio>
                                    </ui-radio-group>
                                </div>
                                <a href="javascript:;" class="enterprise-send" @click.prevent="send">发送</a>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
            <div class="exhibition-phone">
                <i class="icon-phone-blank"></i>
                <div class="status">
                    <template v-if="dialType == 'calling'">正在呼叫...</template>
                    <template v-if="dialType == 'talking'">{{ talkCountDown }}</template>
                    <template v-if="dialType == 'ending'">{{ talkTime }}</template>
                </div>
                <div class="content">
                    <span>{{ dialType == 'calling' || dialType == 'talking' ? callParams.contactNo : '通话已结束' }}</span>
                    <dots 
                        :class="['customer-name', {'error-tip': $store.state.common.currentDetailCustomerId != callParams.encryptContactCustomerId  && $store.state.common.currentDetailCustomerId}]"
                        :key="dotKey" 
                        :txt="callParams.contactCustomerName"></dots>
                </div>
            </div>
            <div class="exhibition-action">
                <template v-if="dialType == 'calling' || dialType == 'talking'">
                    <span class="icon-repair" v-if="hangupParams.progress == 'repairing'" @click="forceCalloff">
                        <i class="pop">如通话已结束请点击</i>
                        <i class="icrm-repair"></i>
                    </span>
                    <span class="icon-hanging" v-else-if="hangupParams.progress == 'hanging'">
                        <i class="icrm-loading"></i>
                    </span>
                    <a 
                        v-else-if="hangupParams.progress == 'calling'"
                        href="javascript:;" 
                        class="icon-hang-up" 
                        @click.prevent="hangup"></a>
                </template>
            </div>
        </div>
        <!-- 跟进记录区域 -->
        <div class="following" v-if="callParams.callOther == 'N' && callParams.isKF == 'false' && !isCompleted && (dialType == 'talking' || dialType == 'ending')">
            <div class="operation">
                <a href="javascript:;" @click.prevent="opened = !opened"><span>填写跟进记录</span><i :class="opened ? 'ti-angle-up' : 'ti-angle-down'"></i></a>
            </div>
            <div class="fill" v-show="opened" ref="fillEle">
                <ui-form ref="form" :model="formData" labelPosition="top" :rules="ruleData" @submit.native.prevent>

                    <!-- 条件渲染 -->
                    <template v-if="callParams.needCallinQuestion == 'true'">
                        <div class="callin-question">
                            <div class="callin-question-title">为了能够提供给您更好的Callin，请您认真填写以下问卷。</div>
                            <form-item label="您觉得该Callin质量如何？" prop="callinQuality">
                                <ui-radio-group v-model="formData.callinQuality" @on-change="changeQuality">
                                    <ui-radio label="高">高</ui-radio>
                                    <ui-radio label="中">中</ui-radio>
                                    <ui-radio label="低">低</ui-radio>
                                </ui-radio-group>
                            </form-item>
                            <template v-if="formData.callinQuality">
                                <form-item label="本次沟通中客户提到了哪些信息？（多选）" prop="includeInfo">
                                    <ui-checkbox-group v-model="formData.includeInfo">
                                        <ui-checkbox 
                                            v-for="item in callinList"
                                            :label="item.code" 
                                            :key="item.code">{{ item.name }}</ui-checkbox>
                                    </ui-checkbox-group>
                                </form-item>
                            </template>
                        </div>
                    </template>

                    <form-item label="跟进内容" prop="followNotes">
                        <ui-input 
                            v-model="formData.followNotes" 
                            type="textarea"
                            resize="none"
                            :maxlength="500"
                            placeholder="填写后不允许修改和删除，请如实填写"></ui-input>
                    </form-item>
                    <form-item label="签单意向" prop="signIntention">
                        <ui-select
                            v-model="formData.signIntention" 
                            :disabled="hasCreateDeclareAuthority && !showCustomDeclare ? true : false">
                            <ui-option 
                                v-for="item in signIntentionList" 
                                :value="item.value" 
                                :key="item.value">{{ item.label }}</ui-option>
                        </ui-select>
                        <button 
                            v-if="hasCreateDeclareAuthority"
                            class="btn btn-outline btn-primary"
                            @click.prevent="showCustomDeclare = !showCustomDeclare;">{{ !showCustomDeclare ? '新建商机' : '撤销新建' }}</button>
                    </form-item>

                    <div 
                        v-if="hasCreateDeclareAuthority && !showCustomDeclare"
                        class="dial-item-title">
                        <span class="subtitle">本次提交不会关联商机，若需要创建商机，请点击【新建商机】即可</span>
                    </div>

                    <!-- “审” -->
                    <div class="sign-audit-tip" v-if="callParams.riskCustomer == 'true' && (formData.signIntention == 3 || formData.signIntention == 4 || formData.signIntention == 5)">
                        <template v-if="formData.signIntention == 3"><i class="text-audit"></i><i class="txt">请谨慎进行报价操作</i></template>
                        <template v-else-if="formData.signIntention == 4"><i class="text-audit"></i><i class="txt">请谨慎进行合同操作</i></template>
                        <template v-else-if="formData.signIntention == 5"><i class="text-audit"></i><i class="txt">请谨慎进行签约操作</i></template>
                    </div>

                    <div class="dial-item-title" v-if="declareTips">
                        <span class="title">关联商机</span>
                        <span class="subtitle">（{{ declareTips }}）</span>
                    </div>

                    <!-- 关联商机 -->
                    <template v-if="isDeclareRequired">
                        <form-item label="预计签约金额" :key="formData.signIntention + 'signMoney'" prop="signMoney">
                            <ui-input 
                                v-model="formData.signMoney"
                                v-customTxt="{reg: '\d'}" 
                                placeholder="请输入金额"
                                :maxlength="15"
                                @on-change="recordPoint"><template slot="suffix">元</template></ui-input>
                                <!-- 控价强提醒 -->
                                <div v-if="signMoneyIsLessThanEstimateValue" class="strong-tips">
                                    <i class="icrm-warn"></i>
                                    <span>金额低于该客户的预估价值（{{pullingCustAmount | numToTenThousand}}w）</span>
                                </div>
                        </form-item>
                        <form-item label="预计签约时间" :key="formData.signIntention" prop="signTime">
                            <ui-vendor-date-picker 
                                v-model="formData.signTime"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :picker-options="signTimePickerOptions"
                                :editable="false"
                                :clearable="true"
                                placeholder="请选择预计签约时间"
                                @change="onChangeSignTime"></ui-vendor-date-picker>
                        </form-item>
                        <!-- 报单灰度内 -->
                        <template v-if="isInSalesOrderGrey">
                            <form-item label="预计回款时间" :key="formData.signIntention + 'returnTime'" prop="returnTime">
                                <ui-vendor-date-picker 
                                    v-model="formData.returnTime"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="returnTimePickerOptions"
                                    :editable="false"
                                    :clearable="true"
                                    placeholder="请选择预计回款时间"></ui-vendor-date-picker>
                            </form-item>
                            <form-item class="mb-0" label="靠谱程度" prop="signOption">
                                <ui-radio-group v-model="formData.signOption">
                                    <ui-radio label="1">保底</ui-radio>
                                    <ui-radio label="2">洪荒</ui-radio>
                                </ui-radio-group>
                            </form-item>
                        </template>
                    </template>
                    
                    <!-- 跟进计划 -->
                    <!-- <form-item label="添加跟进计划" class="form-item-add-plan">
                        <ui-switch 
                            v-model="formData.isAddPlan" 
                            size="small"
                            trueValue="1" 
                            falseValue="0"></ui-switch>
                    </form-item>
                    <template v-if="formData.isAddPlan == 1">
                        <form-item prop="planFollowTime">
                            <i class="text-danger">*</i>
                            <ui-vendor-date-picker
                                v-model="formData.planFollowTime"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm"
                                :picker-options="planFollowTimePickerOptions"
                                :editable="false"
                                :clearable="false"
                                placeholder="请选择计划跟进时间"></ui-vendor-date-picker>
                        </form-item>
                        <form-item>
                            <ui-radio-group v-model="formData.planFollowType">
                                <ui-radio label="0">电话</ui-radio>
                                <ui-radio label="1">面谈</ui-radio>
                                <ui-radio label="2">微信/QQ等</ui-radio>
                            </ui-radio-group>
                        </form-item>
                        <form-item>
                            <ui-input 
                                v-model="formData.planFollowNotes" 
                                :rows="2" 
                                counter
                                resize="none"
                                type="textarea" 
                                placeholder="请输入计划跟进内容"></ui-input>
                        </form-item>
                    </template> -->

                    <div class="btns">
                        <button type="button" class="btn btn-outline btn-primary" :disabled="loading" @click.prevent="postAndCreateTask">提交并添加跟进任务</button>
                        <button type="button" class="btn btn-primary" :disabled="loading" @click.prevent="post">提交</button>
                    </div>
                </ui-form>
            </div>
        </div>
        <!-- 跟进记录完成完成 -->
        <div class="following-completed" v-if="callParams.callOther == 'N' && callParams.isKF == 'false' && isCompleted && (dialType == 'talking' || dialType == 'ending')">跟进记录已提交</div>
    </div>
</template>

<script>

import { debounce } from '@/utils/tools/optimize.js';

export default {
    name: 'dial',
    data () {
        return {
            hasInit: false, //用于判断是否初始化过配置项
            dialType: '', // calling, talking, ending
            callParams: {
                contactName: '',
                contactNo: '',
                contactPhone: '',
                startTime: '', //String
                photoUrl: '',
                followUrl: '',
                callOther: '',
                isKF: '', //String
                signIntention: '', //String
                signMoney: '', //String
                signTime: '',
                customerId: '', //明文
                contactId: '',  //明问
                riskCustomer: '', //String 
                needCallinQuestion: '', //String
                customerName: '', // 客户名称
                encryptCustomerId: '', //客户加密id
                encryptContactId: '', // 加密联系人id
                contactType: '', // 联系人类型 0普通联系人 1boss
                encryptUserId: '',
            },

            showCustomDeclare: false, //手动创建商机 是否打开
            cacheInitSignIntention: '', // 暂存初始化 回填的签单意向
            isHasPayDeclare: 0, // 是否有应收商机 0无1有
            isHasIngDeclare: 0, // 是否有进行中商机 0无1有
            isHasOrderNotPass: 0, // 是否有 未到期的合同审核通过的订单 0无1有
            isLastestPayLE7Days: 0, // 距离该客户（及其子客户）最近一次到款小于等于7天 : 0 没有 1有

            talkCountDown: '00:00:00',
            countDownTimer: null,
            // 挂机动作参数集合
            hangupParams: {
                progress: 'calling', // calling, hanging, repairing
                timer: null,
                isSendingForce: false,
            },

            opened: false, //跟进记录展开收起
            isCompleted: false, //是否填写完成跟进记录
            loading: false,
            formData: {

                callinQuality: '',
                includeInfo: [], //提交时候需要转化为字符提交

                followNotes: '',
                signIntention: '',
                signMoney: '',
                signTime: '',
                returnTime: '',
                signOption: '',

                // isAddPlan: '0',
                // planFollowTime: '',
                // planFollowType: '0',
                // planFollowNotes: '',
            },
            ruleData: {
                callinQuality: [
                    {required: true, message: '请选择Callin质量', trigger: 'change'},
                ],
                includeInfo: [
                    {type: 'array', required: true, message: '请选择标签后提交', trigger: 'change'},
                ],
                followNotes: [
                    {required: true, message: '请输入跟进内容', trigger: 'change'},
                    {min: 1, max: 500, message: '请输入1-500字之间的字符', userZH: false, trigger: 'change'},
                ],
                signIntention: [
                    {required: true, message: '请选择签单意向', trigger: 'change'},
                ],
                signTime: [
                    {required: true, message: '请选择预计签约时间', trigger: 'change'},
                ],
                signMoney: [
                    {required: true, message: '请输入预计签约金额', trigger: 'change'},
                ],
                returnTime: [
                    {required: true, message: '请选择预计回款时间', trigger: 'change'},
                ],
                planFollowTime: [
                    {required: true, message: '请选择计划跟进时间', trigger: 'change'},
                ]
            },
            signIntentionList: [],
            signTimePickerOptions: {
                disabledDate (params) {
                    const now = new Date(new Date().toLocaleDateString());
                    return params.getTime() < now.getTime();
                },
            },
            returnTimePickerOptions: {
                disabledDate (params) {
                    // const start = new Date(new Date(new Date().toLocaleDateString()).setDate(new Date().getDate() + 13));
                    // return params.getTime() < start.getTime();
                    const now = new Date(new Date().toLocaleDateString());
                    return params.getTime() < now.getTime();
                },
            },
            planFollowTimePickerOptions: {
                disabledDate (params) {
                    const now = new Date(new Date().toLocaleDateString());
                    return params.getTime() < now.getTime();
                },
            },
            callinQualityOptions: [
                {label: '高', key: '1'},
                {label: '中', key: '1'},
                {label: '低', key: '1'},
            ],
            callinOptions: {},
            isInSalesOrderGrey: false, //报单灰度

            qywx: {
                enable: false, // 是否在 “灰度” 内
                friend: false, // 是否已经是 好友
                canSend: false, // 是否可发送添加我的二维码
                sendChannels: [], // 渠道列表
                noSendReason: '', // 不能发送发送企业微信原因
                
                sendChannel: '', //提交渠道，默认短信
                show: false, //是否显示 发送企业微信到客户的选择方式
            },
            dotKey: Date.now(),
            pullingCustAmount: 0, // 客户预估本年签约金额
            stayDuration: Date.now()
        };
    },
    computed: {
        // 是否有 “创建商机” 的权限 
        hasCreateDeclareAuthority () {
            let flag = false;
            if(this.isHasIngDeclare == 0 && (this.isHasPayDeclare == 1 || this.isHasPayDeclare == 0 && this.isHasOrderNotPass == 1) && this.isLastestPayLE7Days == 1){
                flag = true;
            };
            return flag;
        },
        monickerName () {
            let name = '其他联系人';
            if(this.callParams.callOther == 'N' && this.callParams.contactName) {
                name = this.callParams.contactName;
            };
            return name;
        },
        avatarUrl () {
            return process.env.NODE_ENV == 'development' ? 'https://crm.weizhipin.com' + this.callParams.photoUrl : this.callParams.photoUrl;
        },
        callinList () {
            let res = [];
            let value = this.formData.callinQuality;

            if(value) {
                let list = ['高', '中', '低'];
                let index = list.findIndex(item => item == value) || 0;
                res = this.callinOptions[index + 1] || [];
            };

            return res;
        },
        talkTime () {
            let time = this.callParams.duration || 0;
            let res = '00:00:00';
            if(!isNaN(time * 1)) {
                res = this.sec_to_time(time * 1);
            };
            return res;
        },
        declareTips () {

            let signIntention = this.formData.signIntention;

            let isHasPayDeclare = this.isHasPayDeclare; //应收
            let isHasIngDeclare = this.isHasIngDeclare; //进行中
            let isHasOrderNotPass = this.isHasOrderNotPass; //未到期的合同审核通过的订单

            let satisfyIntentionCondition = !!(signIntention == 2 || signIntention == 3 || signIntention == 4);
            let notSatisfyIntentionCondition = !!(signIntention == 0 || signIntention == 1 || signIntention == 6);
            let satisfyIntention100 = !!(signIntention == 5 || signIntention == 7);  // v3.48.12 进程选到100和已回款时，不展示商机的五大属性的选择，且更换文案

            let tips = '';
            if(isHasIngDeclare == 1) {
                if(notSatisfyIntentionCondition) {
                    tips = '关联的进行中商机将在本次提交后关闭';
                }
                else if(satisfyIntentionCondition) {
                    tips = '关联的进行中商机将在本次提交后更新时间和金额';
                }
                else if(satisfyIntention100) {
                    tips = '本次提交将不影响商机信息';
                }
            }else if(isHasIngDeclare == 0) {
                if(isHasPayDeclare == 0 && isHasOrderNotPass == 0 ||
                    (isHasPayDeclare == 1 || isHasPayDeclare == 0 && isHasOrderNotPass == 1) && this.isLastestPayLE7Days == 1 && this.showCustomDeclare ||
                    (isHasPayDeclare == 1 || isHasPayDeclare == 0 && isHasOrderNotPass == 1) && this.isLastestPayLE7Days == 0
                ) {
                    if(notSatisfyIntentionCondition || satisfyIntention100) {
                        tips = '本次提交将不会生成商机';
                    }
                    else if(satisfyIntentionCondition) {
                        tips = '本次提交后，客户下将生成一个新的商机';
                    };
                };
            };

            return tips;
        },
        isDeclareRequired () {

            let flag = false;
            let satisfyIntentionCondition = !!(this.formData.signIntention == 2 || this.formData.signIntention == 3 || this.formData.signIntention == 4);

            if( this.isHasIngDeclare == 1 && satisfyIntentionCondition ||
                this.isHasIngDeclare == 0 && this.isHasPayDeclare == 0 && this.isHasOrderNotPass == 0 && satisfyIntentionCondition || 
                this.isHasIngDeclare == 0 && (this.isHasPayDeclare == 1 || this.isHasPayDeclare == 0 && this.isHasOrderNotPass == 1) && this.isLastestPayLE7Days == 1 && this.showCustomDeclare && satisfyIntentionCondition ||
                this.isHasIngDeclare == 0 && (this.isHasPayDeclare == 1 || this.isHasPayDeclare == 0 && this.isHasOrderNotPass == 1) && this.isLastestPayLE7Days == 0 && satisfyIntentionCondition //3.43版本新添加逻辑
            ) {
                flag = true;
            };

            return flag;
        },
        // 强控价管理灰度
        isPriceManageGrey() {
            return this.$store.state.user.userGreyCodeList.includes('10050');
        },
        // 签单金额是否小于预估价值
        signMoneyIsLessThanEstimateValue() {
            return this.isPriceManageGrey && Number(this.formData.signMoney) > 0 && Number(this.formData.signMoney) < this.pullingCustAmount;
        }
    },
    watch: {
        'callParams.needCallinQuestion': {
            immediate: true,
            handler (val) {
                //触发callin问卷的拨号器默认展开填写跟进记录内容，允许手动点击收起 v3.05
                if(val == 'true') {
                    this.opened = true;
                };
            },
        },
        showCustomDeclare (flag) {
            if(flag) {
                this.formData.signIntention = '2';
            }else {
                this.formData.signIntention = this.cacheInitSignIntention;
            };
        },
        dialType: {
            immediate: true,
            handler (val) {
                if(val == 'talking') {
                    // 直接进入通话计时
                    this.countDown();
                    // 配置初始化
                    this.init();
                } 
                else if(val == 'ending') {
                    
                    // 关闭计时器
                    this.clear();

                    // 刷新直接推送通话结束的状态（不确定是否存在）
                    if(!this.hasInit) {
                        this.init();
                    };

                    // 通话结束弹窗后2s自动关闭弹窗
                    if(!(this.callParams.callOther == 'N' && this.callParams.isKF == 'false' && !this.isCompleted)) {
                        setTimeout(() => {
                            this.destroyDial();
                        }, 2000);
                    };
                };
            }
        },
    },
    created() {
        this.recordPoint = debounce(this.recordPoint, 500);
    },
    methods: {
        recordPoint() {
            // webclick 手动上报
            this.$BossAnalytics.track('WebClick', {
                wc_interface: '拨号器',
                ele_name: '拨号器-预计签约金额修改',
                ele_value: this.formData.signMoney || 0,
                wc_obj_type: 'customer',
                wc_obj_id: this.callParams.encryptCustomerId,
                money_stay_duration: (Date.now() - this.stayDuration) / 1000
            });
            this.stayDuration = Date.now();
        },
        async getIntentionList (customerId) {
            let list = [];
            try {
                let res = await this.$ajax({
                    method: 'GET',
                    url: '/customer/follow/signIntentions',
                    params: {
                        customerId,
                    },
                });
                if(res && res.code == 1 && res.data && res.data.signIntentions) {
                    list = res.data.signIntentions.map(item => {
                        return {
                            label: item.label, 
                            value: item.value + ''
                        };
                    });
                };
            }catch(e){
                console.log(e);
            };
            return list;
        },
        hangup () {
            this.hangupParams.progress = 'hanging';
            this.hangupParams.timer = setTimeout(() => {
                if(this.hangupParams.progress == 'hanging') {
                    this.hangupParams.progress = 'repairing';
                };
                clearTimeout(this.hangupParams.timer);
            }, 5000);

            // 执行挂断
            this.$ajax({
                method: 'POST',
                url: '/rest/call/calloff',
            });
        },
        forceCalloff () {
            if(this.hangupParams.isSendingForce) return false;
            this.hangupParams.isSendingForce = true;
            this.$ajax({
                method: 'POST',
                url: '/rest/call/forceCalloff',
            }).then(({code, data, message}) => {
                if(code == 1) {

                    // 更新座席状态
                    this.$updateSeatstatus.update();
                    
                    this.$toast({
                        type: 'success',
                        content: message || '通话结束',
                    });
                    // 关闭弹窗
                    this.destroyDial();
                };
                this.hangupParams.isSendingForce = false;
            }, () => {
                this.hangupParams.isSendingForce = false;
            });
        },
        onChangeSignTime (val) {
            if(val) {
                this.formData.returnTime = val;
                this.returnTimePickerOptions.disabledDate = (params) => {
                    const start = new Date(new Date(val).toLocaleDateString());
                    return params.getTime() < start.getTime();
                };
            } else {
                this.formData.returnTime = '';
                this.returnTimePickerOptions.disabledDate = (params) => {
                    const start = new Date(new Date().toLocaleDateString());
                    return params.getTime() < start.getTime();
                };
            };
        },
        changeQuality (value) {
            this.formData.includeInfo = [];
        },
        getCallinQuestions () {
            this.$ajax({
                url: '/kvConfig/callin/questions/options.json',
            }).then(({code, data}) => {
                if(code == 1) {
                    this.callinOptions = data || {};
                }
            });
        },
        getSalesOrderGrey () {
            this.$ajax({
                method: 'GET',
                url: '/saleDeclare/864declare/isInGrey',
            }).then(({code, data}) => {
                if(code == 1 && data == true) {
                    this.isInSalesOrderGrey = true;
                };
            });
        },
        getQxwxCallAdd () {
            this.$ajax({
                url: '/customer/qywx/calladd.json',
                params: {
                    phoneNumber: this.callParams.contactPhone,
                    customerId: this.callParams.customerId,
                    contactId: this.callParams.contactId,
                },
                quiet: true,
            }).then(({code, data}) => {
                if(code == 1) {
                    // 渠道内如果有短信1，默认短信
                    let sendChannel = (data.sendChannels || []).filter(item => item.sendChannel == 1).length ? 1 : '';
                    this.qywx = {
                        enable: data.enable || false,
                        friend: data.friend || false,
                        canSend: data.canSend || false,
                        sendChannels: data.sendChannels || [],
                        noSendReason: data.noSendReason || '不可发送',
                        
                        sendChannel: sendChannel,
                        show: false,
                    };
                };
            });
        },
        init () {
            if(this.callParams.callOther == 'N' && this.callParams.isKF == 'false') {
                // 获取 报单灰度
                this.getSalesOrderGrey();
                // 获取 callin问卷题目
                if(this.callParams.needCallinQuestion == 'true') {
                    this.getCallinQuestions();
                };
                // 获取 发送企业微信灰度
                this.getQxwxCallAdd();
                
                // 更新标记
                this.hasInit = true;
            };
        },
        send () {
            if(!this.qywx.sendChannel) {
                this.$toast({
                    type: 'error',
                    content: '请选择发送方式',
                });
                return false;
            };

            this.qywx.show = false; // 关闭选项

            this.$ajax({
                method: 'POST',
                url: '/customer/qywx/contact/add/send.json',
                data: {
                    phoneNumber: this.callParams.contactPhone,
                    customerId: this.callParams.customerId,
                    contactId: this.callParams.contactId,
                    sendChannel: this.qywx.sendChannel,
                },
            }).then(({code, message}) => {
                if(code == 1) {
                    this.$toast({
                        type: 'success',
                        content: message,
                    });
                    this.qywx.canSend = false;
                };
            });
        },
        postAndCreateTask () {
            
            this.post();

            try {
                this.$addTask({
                    from: 10,
                    defaultMissionType: 3, 
                    cb: function () {},
                    batchId: [{
                        name: this.callParams.customerName,
                        id: this.callParams.encryptCustomerId,
                    }],
                    defaultContact: {
                        contactId: this.callParams.encryptContactId,
                        contactType: this.callParams.contactType,
                    },
                    executorId: this.callParams.encryptUserId
                });
            } catch (error) {
                //
            };
        },
        post () {
            let vm = this;
            vm.$refs['form'].validate((valid=true) => {
                if(!valid) {
                    try {
                        this.$nextTick(() => {
                            let $errorEles = document.querySelectorAll('.form-error-tip');
                            let distance = $errorEles[0].parentNode.offsetTop - this.$refs['fillEle'].offsetTop;
                            this.$refs['fillEle'].scrollTo(0, distance - 40);
                        });
                    } catch (error) {
                        //
                    };
                    return false;
                };
                // "审"
                let signIntention = vm.formData.signIntention;
                if(vm.callParams.riskCustomer == 'true' && (signIntention == 3 || signIntention == 4 || signIntention == 5)) {
                    let tip = '';
                    if(signIntention == 3) {
                        tip = '请谨慎进行报价操作';
                    } else if(signIntention == 4) {
                        tip = '请谨慎进行合同操作';
                    } else if(signIntention == 5) {
                        tip = '请谨慎进行签约操作';
                    };
                    vm.$dialog({
                        title: '高危操作',
                        content: tip,
                        type: 'warning',
                        onConfirm () {
                            vm.save();
                        },
                    });
                } else {
                    vm.save();
                };
            });
        },
        save () {
            if(this.loading) return false;
            this.loading = true;
            let params = JSON.parse(JSON.stringify(this.formData));
            // 整理数据
            
            // 是否有callin问卷
            if(this.callParams.needCallinQuestion == 'true') {
                params.includeInfo = params.includeInfo.join(',');
            } else {
                delete params.callinQuality;
                delete params.includeInfo;
            };

            // 判断商机是否展示
            if(!this.isDeclareRequired) {
                delete params.signTime;
                delete params.signMoney;
                delete params.returnTime;
                delete params.signOption;
            }
            else {
                //不在报单灰度内
                if(!this.isInSalesOrderGrey) {
                    delete params.returnTime;
                    delete params.signOption;
                };
            };

            // isAddDeclare 能新建商机状态下，不创建 传1，其他传0
            let isAddDeclare = 0;
            if(this.hasCreateDeclareAuthority && !this.showCustomDeclare) {
                isAddDeclare = 1;
            };
            params.isAddDeclare = isAddDeclare;
            
            // 未添加联系计划
            // if(params.isAddPlan == 0) {
            //     delete params.planFollowTime;
            //     delete params.planFollowType;
            //     delete params.planFollowNotes; 
            // };

            this.$ajax({
                method: 'POST',
                url: this.callParams.followUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: params,
            }).then(({success, root}) => {
                if(success) {
                    let data = JSON.parse(root);
                    this.$toast({
                        type: 'success',
                        content: data.message,
                    });

                    // 填写完成封箱
                    this.isCompleted = true;

                    // “通话结束” 填写完记录直接关闭弹窗
                    if(this.dialType === 'ending') {
                        setTimeout(() => {
                            this.destroyDial();
                            // 是企业联系方式，需要给号码添加标签
                            // 使用量很小，暂时不重构了
                            // https://wiki.kanzhun-inc.com/pages/viewpage.action?pageId=49547416
                            // if(data.tag == 1) {};
                        }, 2000);
                    };
                };
                this.loading = false;
            }, () => {
                this.loading = false;
            });
        },
        openEnterpriseList () {
            if(this.qywx.canSend) {
                this.qywx.show = true;
            } else {
                this.$toast({
                    type: 'error',
                    content: this.qywx.noSendReason,
                });
            };
        },
        hideEnterpriseList () {
            this.qywx.show = false;
        },
        countDown () {
            let val = this.callParams.startTime;
            let time = val * 1;
            if(isNaN(time)) {
                this.talkCountDown = time;
                return false;
            };

            this.countDownTimer && clearInterval(this.countDownTimer);
            this.countDownTimer = setInterval(() => {
                time++;
                this.talkCountDown = this.sec_to_time(time);
            }, 1000);
        },
        sec_to_time (result) {

            let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
            let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
            let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

            return result = h + ':' + m + ':' + s;
        },
        clear () {
            this.hangupParams.timer && clearTimeout(this.hangupParams.timer);
            this.countDownTimer && clearInterval(this.countDownTimer);
        },
        updateDial (data) {
            
            let {type, callParams} = data;

            // 通话中 ==》通话结束 需要保留当前用户操作状态（填写的跟进记录）
            if(callParams.callOther == 'N' && (type == 'talking' || type == 'ending') && (this.callParams.contactPhone != callParams.contactPhone || this.callParams.contactPhone == callParams.contactPhone && this.dialType == 'calling')) {
                
                let __signIntention = callParams.signIntention === 0 ? '0' : (callParams.signIntention || '');
                this.cacheInitSignIntention = __signIntention + ''; // 备份签单意向
                this.formData.signIntention = __signIntention + '';
                this.formData.signMoney = callParams.signMoney || '';
                this.formData.signTime = callParams.signTime || '';
                this.formData.returnTime = callParams.returnTime || '';
                this.formData.signOption = callParams.signOption == 1 ||  callParams.signOption == 2 ? callParams.signOption : '';

                this.isHasPayDeclare = callParams.isHasPayDeclare || 0;
                this.isHasIngDeclare = callParams.isHasIngDeclare || 0;
                this.isHasOrderNotPass = callParams.isHasOrderNotPass || 0;

                this.isLastestPayLE7Days = callParams.isLastestPayLE7Days || 0;
                this.pullingCustAmount = Number(callParams?.pullingCustAmount || 0);

                // 3.43版本 可选进程范围和客户阶段挂钩
                if(callParams.encryptCustomerId) {
                    this.getIntentionList(callParams.encryptCustomerId).then((__list) => {
                        this.signIntentionList = __list.length ? __list : [
                            {label: '0%-无意向', value: '0'},
                            {label: '20%-找到KP', value: '1'},
                            {label: '40%-意向客户', value: '2'},
                            {label: '60%-方案报价', value: '3'},
                            {label: '80%-合同流程', value: '4'},
                            {label: '100%-已签约', value: '5'},
                            {label: '已回款', value: '7'},
                            {label: '丢单', value: '6'},
                        ];
                    });
                };               
            };

            // 后赋值
            this.dialType = type;
            this.callParams = callParams;

            // this.dotKey = Date.now();
        },
        // 手动关闭当前通话弹窗
        destroyDial () {
            this.$emit('on-destroy');
        },
        // 填写完跟进记录关闭所有弹窗
        // 填写完成之后 服务端推送关闭弹窗的消息，但是需要判断当前通过过程，通话中不能消失弹窗
        closeCallingPop () {
            if(this.dialType == 'talking') {
                this.isCompleted = true;
            } else {
                this.destroyDial();
            };
        },
    },
    destroyed() {
        this.clear();
    },
};
</script>

<style lang="less">
@import url('./index.less');
</style>