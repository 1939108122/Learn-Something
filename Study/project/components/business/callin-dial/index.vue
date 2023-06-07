<template>
    <div class="notification-callin-popup" v-if="show" v-drag="{handle: '.notification-callin'}">
        <div class="notification-callin" :class="getStageClassName(callParams.stage)">
            <div class="notification-callin-l">
                <div class="callin-avatar">                                    
                    <div class="avatar"><i class="bg"></i></div>
                    <div class="name">{{ callParams.contactName }}</div>
                    <div class="position">{{ callParams.contactTitle }}</div>
                    <!-- 添加企业微信好友相关功能 -->
                    <template v-if="qywx.enable">
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
                <div class="callin-content">
                    <div class="callin-text">{{ getStageText(callParams.stage) }}</div>
                    <div class="callin-duration" v-if="callParams.stage == 'actionWaiting'">00:00:00</div>
                    <div class="callin-duration" v-else-if="callParams.stage == 'actionThrough'">{{ talkCountDown }}</div>
                    <div class="callin-duration" v-else-if="callParams.stage == 'actionHangup'">{{ talkTime }}</div>
                    <div class="callin-device">
                        <i>{{ callParams.stage == 'actionWaiting' ? '请在' : (callParams.stage == 'actionThrough' ? '正在' : '完成') }}</i>
                        <span>[{{ getDeviceName(callParams.answerDevice) }}]</span>
                        <i>接听</i>
                    </div>
                    <ul>
                        <li v-if="callParams.contactNo"><i class="icrm-tel"></i><span>{{ callParams.contactNo }}</span></li>
                        <li v-if="callParams.customerName && callParams.encryptCustomerId"><i class="icrm-user-avatar"></i><span>{{ callParams.customerName }}</span><a href="javascript:;" class="op-view-callin-details" @click.prevent="view">详情</a></li>
                    </ul>
                </div>
            </div>
            <a href="javascript:;" class="notification-callin-r" @click.prevent="ringOff">
                <div v-if="callParams.stage == 'actionWaiting'" class="callin-button"><span></span><span></span><span></span></div>
                <i v-else class="callin-button"></i>
            </a>
        </div>
        <!-- 跟进记录区域 -->
        <div class="following" v-if="(callParams.stage == 'actionThrough' || callParams.stage == 'actionHangup' && callParams.startTime != 0) && !isCompleted">
            <div class="operation">
                <a href="javascript:;" @click.prevent="opened = !opened"><span>填写跟进记录</span><i :class="opened ? 'ti-angle-up' : 'ti-angle-down'"></i></a>
            </div>
            <div class="fill" v-show="opened" ref="fillEle">
                <ui-form ref="form" :model="formData" :rules="ruleData" @submit.native.prevent>

                    <!-- callin问卷 -->
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

                    <form-item label="跟进内容" prop="followNotes">
                        <ui-input 
                            v-model="formData.followNotes" 
                            type="textarea"
                            resize="none"
                            :maxlength="500"
                            placeholder="填写后不允许修改和删除，请如实填写"></ui-input>
                    </form-item>
                    <form-item label="签单意向" prop="signIntention">
                        <ui-select v-model="formData.signIntention">
                            <ui-option 
                                v-for="item in signIntentionList" 
                                :value="item.value" 
                                :key="item.value">{{ item.label }}</ui-option>
                        </ui-select>
                    </form-item>
                    <!-- 已回款 && 100%签约 隐藏如下字段 -->
                    <template v-if="formData.signIntention != 5 && formData.signIntention != 7">
                        <div class="form-wrap-sign">
                            <form-item label="预计签约" :key="formData.signIntention + 'signMoney'" :prop="formData.signIntention == 3 || formData.signIntention == 4 ? 'signMoney' : ''">
                                <ui-input 
                                    v-model="formData.signMoney"
                                    v-customTxt="{reg: '\d'}" 
                                    placeholder="请输入金额"
                                    :maxlength="15"><template slot="suffix">元</template></ui-input>
                            </form-item>
                            <form-item :key="formData.signIntention" :prop="formData.signIntention == 3 || formData.signIntention == 4 ? 'signTime' : ''">
                                <ui-vendor-date-picker 
                                    v-model="formData.signTime"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="signTimePickerOptions"
                                    :editable="false"
                                    :clearable="false"
                                    placeholder="请选择预计签约时间"></ui-vendor-date-picker>
                            </form-item>
                        </div>
                    </template>
                    <!-- 跟进计划 -->
                    <form-item label="添加跟进计划" class="form-item-add-plan">
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
                        <form-item prop="planFollowNotes">
                            <ui-input 
                                v-model="formData.planFollowNotes" 
                                :rows="2" 
                                :maxlength="500"
                                resize="none"
                                type="textarea" 
                                placeholder="请输入计划跟进内容"></ui-input>
                        </form-item>
                    </template>
                    <div class="btns">
                        <button class="btn btn-primary" :disabled="loading" @click.prevent="post">提交</button>
                    </div>
                </ui-form>
            </div>
        </div>
        <!-- 跟进记录完成完成 -->
        <div class="following-completed" v-if="(callParams.stage == 'actionThrough' || callParams.stage == 'actionHangup' && callParams.startTime != 0) && isCompleted">跟进记录已提交</div>
    </div>
</template>

<script>
export default {
    name: 'callin-callback-dial',
    data () {
        return {
            hasInit: false, //用于判断是否初始化过配置项
            show: true, //用于销毁组件自身

            talkCountDown: '00:00:00', //计时面板
            countDownTimer: null,

            callParams: {
                stage: '', //通话阶段 actionWaiting、actionThrough、actionHangup
                contactName: '',
                contactTitle: '',
                contactId: '',
                contactPhone: '', //加密号码
                contactNo: '', //显示号码 1861****172
                customerId: '', //648464
                answerDevice: '', //接听设备 1、2、4
                customerName: '', //北京大鸣科技有限公司
                jumpUrl: '', // /customer/my/view?id=ae7b3eadda00ff173nZ52Nu4&fid=
                encryptCustomerId: '',
                menuPrefix: '',
                jumpType: '', // 1、2
                startTime: 0, //通话时间

                followUrl: '', //填写跟进记录
                signIntention: '', 
                signMoney: '',
                signTime: '',

                hangupType: '', //挂断类型 callinHangup、callBackHangup 【 挂断消息传递不同的字段 】
            },

            qywx: {
                enable: false, // 是否在 “灰度” 内
                friend: false, // 是否已经是 好友
                canSend: false, // 是否可发送添加我的二维码
                sendChannels: [], // 渠道列表
                noSendReason: '', // 不能发送发送企业微信原因
                
                sendChannel: '', //提交渠道，默认短信
                show: false, //是否显示 发送企业微信到客户的选择方式
            },

            opened: true, //跟进记录展开收起
            isCompleted: false, //是否填写完成跟进记录
            loading: false,
            formData: {
                callinQuality: '',
                includeInfo: [], //提交时候需要转化为字符提交

                followNotes: '',
                signIntention: '',
                signMoney: '',
                signTime: '',
                isAddPlan: '0',
                planFollowTime: '',
                planFollowType: '0',
                planFollowNotes: '',
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
                planFollowTime: [
                    {required: true, message: '请选择计划跟进时间', trigger: 'change'},
                ],
                planFollowNotes: [
                    {min: 1, max: 500, message: '请输入1-500字之间的字符', userZH: false, trigger: 'change'},
                ]
            },
            signIntentionList: [
                {label: '0%-无意向', value: '0'},
                {label: '20%-找到KP', value: '1'},
                {label: '40%-意向客户', value: '2'},
                {label: '60%-方案报价', value: '3'},
                {label: '80%-合同流程', value: '4'},
                {label: '100%-已签约', value: '5'},
                {label: '已回款', value: '7'},
                {label: '丢单', value: '6'},
            ],
            signTimePickerOptions: {
                disabledDate (params) {
                    const now = new Date(new Date().toLocaleDateString());
                    return params.getTime() < now.getTime();
                },
            },
            returnTimePickerOptions: {
                disabledDate (params) {
                    const start = new Date(new Date(new Date().toLocaleDateString()).setDate(new Date().getDate() + 13));
                    return params.getTime() < start.getTime();
                },
            },
            planFollowTimePickerOptions: {
                disabledDate (params) {
                    const now = new Date(new Date().toLocaleDateString());
                    return params.getTime() < now.getTime();
                },
            },
            callinOptions: {},
        };
    },
    computed: {
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
            let time = this.callParams.startTime || 0;
            let res = '00:00:00';
            if(!isNaN(time * 1)) {
                res = this.sec_to_time(time * 1);
            };
            return res;
        },
    },
    destroyed () {
        this.clear();
    },
    watch: {
        'callParams.stage': {
            immediate: true,
            handler (val) {
                if(val == 'actionThrough') {
                    // 直接进入通话计时
                    this.countDown();
                    // 配置初始化
                    this.init();
                } 
                else if(val == 'actionHangup') {
                    // 关闭计时器
                    this.clear();

                    // 刷新直接推送通话结束的状态（极端场景）
                    if(!this.hasInit) {
                        this.init();
                    };
                };
            },
        },
    },
    methods: {
        getStageClassName (stageType) {
            let className = '';
            switch (stageType) {

                case 'actionWaiting':
                    className = 'calling';
                    break;

                case 'actionThrough':
                    className = 'talking';
                    break;

                case 'actionHangup':
                    className = 'ending';
                    break;
            };
            return className;
        },
        getStageText (stageType) {
            let stage = '';
            switch (stageType) {

                case 'actionWaiting':
                    stage = '等待接听';
                    break;

                case 'actionThrough':
                    stage = '正在通话';
                    break;

                case 'actionHangup':
                    stage = '通话结束';
                    break;
            };
            return stage;
        },
        getDeviceName (answerDevice) {
            let device = '';
            switch (answerDevice) {

                case '1':
                    device = '话盒';
                    break;

                case '2':
                    device = '手机';
                    break;

                case '4':
                    device = 'IP电话';
                    break;

                default:
                    device = '未知设备';
            };
            return device;
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
        clear () {
            this.countDownTimer && clearInterval(this.countDownTimer);
        },
        sec_to_time (result) {

            let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
            let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
            let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

            return result = h + ':' + m + ':' + s;
        },
        init() {
            // 获取 callin问卷题目
            this.getCallinQuestions();

            // 获取 发送企业微信灰度
            this.getQxwxCallAdd();

            // 更新标记
            this.hasInit = true;
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
        // 查看详情
        view () {

            let encryptCustomerId = this.callParams.encryptCustomerId;
            let menuPrefix = this.callParams.menuPrefix;
            let type = this.callParams.jumpType;

            if(type == 1) {
                // 1跳转公司详情线索tab页 
                this.$seeCustomer({
                    menuPrefix,
                    customerId: encryptCustomerId,
                    defaultTab: 'moduleClue',
                });
            } else {
                // 2跳转待处理线索列表
                // window.open(url);
                // type == 2逻辑跟后端确认，已经没有了
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
                vm.save();
            });
        },
        save () {
            if(this.loading) return false;
            this.loading = true;
            let params = JSON.parse(JSON.stringify(this.formData));
            // 整理数据
            
            // callin问卷
            params.includeInfo = params.includeInfo.join(',');

            // 100%签约 && 回款
            if(params.signIntention == 5 || params.signIntention == 7) {
                delete params.signTime;
                delete params.signMoney;
            };

            // 未添加联系计划
            if(params.isAddPlan == 0) {
                delete params.planFollowTime;
                delete params.planFollowType;
                delete params.planFollowNotes; 
            };

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
                };
                this.loading = false;
            }, () => {
                this.loading = false;
            });
        },
        ringOff () {

            // actionThrough、actionHangup
            let stage = this.callParams.stage;
            let startTime = this.callParams.startTime;

            if(stage == 'actionThrough') {
                // let hangupType = this.callParams.hangupType || 'calloff';
                // this.$socket.sendMessage({
                //     model: 'callcenter',
                //     type: hangupType,
                // });
                
                // 执行挂断
                this.$ajax({
                    method: 'POST',
                    url: '/rest/call/calloff',
                });
            } 
            else if(stage == 'actionHangup') {
                // 需要判断是否已经填写跟进记录(未填写跟进记录，不允许关闭)
                if(this.isCompleted || startTime == 0) {
                    this.destroyDial();
                } else {
                    this.$toast({
                        type: 'error',
                        content: '请填写跟进记录',
                    });
                }; 
            };
        },
        showDial (callParams) {

            // 需要判断 talking => ending 不能抹掉填写信息
            if((callParams.stage == 'actionThrough' || callParams.stage == 'actionHangup') && (callParams.contactPhone != this.callParams.contactPhone || callParams.contactPhone == this.callParams.contactPhone && this.callParams.stage == 'actionWaiting')) {
                this.formData.signIntention = callParams.signIntention || '';
                this.formData.signMoney = callParams.signMoney || '';
                this.formData.signTime = callParams.signTime || '';
            };

            this.callParams = callParams;

        },
        // 手动关闭当前通话弹窗
        destroyDial () {
            this.show = false;
            this.$emit('on-destroy');
        },
        closeCallingPop () {
            if(this.callParams.stage == 'actionThrough') {
                this.isCompleted = true;
            } else {
                this.destroyDial();
            };
        },
    },
};
</script>

<style lang="less">
@import url('./index.less');
</style>