<template>
    <div>
        <!-- 绑定座席 -->
        <ui-dialog 
            ref="bindDialog"
            v-model="showBindDialog"
            v-if="type == 'bind'"
            preventLayer
            preventConfirm
            preventCancel
            :width="480"
            :cancelText="bindStep == 1 ? false: '取消'"
            :showClose="true"
            :confirmText="bindStep == 1 ? false : '确定'"
            title="绑定座席"
            wrapClass="dialog-seat-common"
            @on-cancel="cancelBind"
            @on-confirm="doBind('bindForm')">
            <template slot="content">
                <div v-if="bindStep == 1" class="inner">
                    <p class="description">请选择绑定设备</p>
                    <div class="service">
                        <ul>
                            <template v-for="(item, index) in serviceList">
                                <li
                                    :key="index"
                                    :class="[{'active': bindForm.bindType == item.bindType}, `service-item-${item.type}`]" 
                                    @click="selectService(item)">
                                    <img :src="item.imgUrl" />
                                    <div class="content">
                                        <h4>{{ item.name }}</h4>
                                        <p>{{ item.bindType == 1 && hasWebrtcAuth ? item.tip2 : item.tip }}</p>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
                <div v-if="bindStep == 2" class="inner">
                    <p class="description">绑定座席后，可通过CRM拨打电话<span v-if="isInCallAutoSwitchGrey && bindForm.bindType == 4" class="f-12 text-red">（所有线路均需绑定，如未绑定则此线路无法使用）</span></p>
                    <ui-form ref="bindForm" :model="bindForm" :rules="bindRule" :label-width="90" @submit.native.prevent>
                        <form-item label="座席号" prop="callNo">
                            <span v-if="!$store.state.user.userInfo.callNoEnable && !$store.state.user.userInfo.callNoDefault" class="text-gray" style="font-size:12px;">无关联座席号，请联系城市运营关联座席号</span>
                            <ui-input
                                v-else 
                                :disabled="!$store.state.user.userInfo.callNoEnable && $store.state.user.userInfo.callNoDefault ? true : false"
                                v-model.trim="bindForm.callNo"
                                v-customTxt="{reg: '\d'}"
                                placeholder="请填写座席号"></ui-input>
                        </form-item>
                        <!-- 1044灰度内 -->
                        <template v-if="isInCallAutoSwitchGrey">
                            <form-item prop="batchList" :rules="bindRule.batchRequired" :label-width="1" class="form-item-custom" :class="{'form-item-custom-mobile': bindForm.bindType == 1}">
                                <form-item 
                                    v-for="(item, index) in bindForm.batchList" 
                                    :key="index"
                                    :prop="'batchList.' + index + '.bindTel'"
                                    :rules="bindRule.batchPhone"
                                    class="form-item-required">
                                    <span slot="label">
                                        <template v-for="(title, idx) in item.title">
                                            <i>{{ title }}</i>{{ idx === item.title.length - 1 ? '' : '、' }}
                                        </template>
                                    </span>
                                    <ui-input
                                        :disabled="item.bindType == 3"
                                        :key="renderKey"
                                        ref="batchPhone"
                                        v-model.trim="bindForm.batchList[index].bindTel"
                                        v-customTxt="{reg: '\d'}"
                                        :maxlength="phoneLength"
                                        @on-change="inputBatchPhone"
                                        placeholder="请填写绑定号码"></ui-input>
                                </form-item>
                            </form-item>
                        </template>
                        <template v-else>
                            <div class="form-item-gallary">
                                <form-item>
                                    <ui-select v-model="bindForm.supplierType">
                                        <ui-option 
                                            v-for="(item, index) in seats" 
                                            :value="item.supplierType"
                                            :key="index">{{ item.supplierName }}</ui-option>
                                    </ui-select>
                                </form-item>
                                <!-- 软电话坐席号和绑定号码相同 且不能修改 -->
                                <form-item prop="phone">
                                    <ui-input
                                        :disabled="bindForm.bindType == 3"
                                        :key="renderKey"
                                        ref="phone"
                                        v-model.trim="bindForm.phone"
                                        v-customTxt="{reg: '\d'}"
                                        :maxlength="phoneLength"
                                        @on-change="inputPhone('bindForm')"
                                        placeholder="请填写绑定号码"></ui-input>
                                </form-item>
                            </div>
                        </template>
                    </ui-form>
                </div>   
            </template>
        </ui-dialog>

        <!-- 切换线路 -->
        <ui-dialog 
            v-model="showChangeDialog"
            v-if="type == 'change'"
            preventLayer
            preventConfirm
            :width="400"
            :showClose="false"
            :title="mode === 'batchBind' ? '绑定座席' : '切换座席'"
            wrapClass="dialog-seat-common"
            @on-confirm="doBind('changeForm')">
            <template slot="content">
                <div class="inner">
                    <p class="description">请输入待{{ mode === 'batchBind' ? '绑定' : '切换' }}线路的号码</p>
                    <ui-form ref="changeForm" :model="changeForm" :rules="bindRule" :label-width="90" @submit.native.prevent>
                        <form-item label="座席号">{{ bindedList && bindedList.length && bindedList[0].callNo }}</form-item>
                        <form-item :label="changeForm.supplierName" prop="phone">
                            <ui-input
                                :key="renderKey"
                                ref="phone"
                                :disabled="!changeForm.canModifyPhone"
                                v-model.trim="changeForm.phone"
                                v-customTxt="{reg: '\d'}"
                                :maxlength="phoneLength"
                                @on-change="inputPhone('changeForm')"
                                placeholder="请填写绑定号码"></ui-input>
                        </form-item>
                        <form-item label="绑定设备: ">{{ bindTypeEnum[changeForm.bindType] }}</form-item>
                    </ui-form>
                </div>
            </template>
        </ui-dialog>

        <!-- 解绑弹窗 -->
        <ui-dialog 
            v-model="showUnBindDialog"
            v-if="type == 'unbind'"
            preventLayer
            :width="400"
            :showClose="false"
            title="解绑座席"
            wrapClass="dialog-seat-common"
            @on-confirm="doUnbind">
            <template slot="content">
                <div class="inner">
                    <p class="description">解绑座席后，将不可外呼</p>
                    <ui-form :label-width="140" class="ui-form-unbind">
                        <form-item label="座席号:">{{ bindedList && bindedList.length && bindedList[0].callNo }}</form-item>
                        <form-item 
                            v-for="(item, index) in bindedList"
                            :key="index"
                            :label="`绑定号码(${item.supplierName}):`">{{ item.phone }}</form-item>
                    </ui-form>
                </div>
            </template>
        </ui-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    name: 'seat-operation',
    data() {
        /**
         *  手机&话盒
         *  当以1开头时，输入号码位数必须为11位；当以0开头时，位数必须为11位或者12位
         */
        let vm = this;
        let validatePhone = (rule, value, callback) => {
            if(vm.type == 'bind' && vm.bindForm.bindType == 1 && value.length < 11 || vm.type == 'change' && vm.changeForm.bindType == 1 && value.length < 11) {
                callback(new Error('号码格式错误'));
            } else {
                callback();
            };
        };
        let validBatchRequired = (rule, value, callback) => {
            const hasFilledSomeone = value.filter(item => !!item.bindTel).length > 0;
            if (!hasFilledSomeone) {
                callback(new Error('请填写绑定号码'));
            } else {
                callback();
            }
        };
        let validBatchPhone = (rule, value, callback) => {
            this.$refs['bindForm'].validateField('batchList');
            const __bindType = vm.bindForm.bindType;
            if (__bindType == 1 && !!value && value.length < 11) {
                callback(new Error('号码格式错误'));
            } else {
                callback();
            }
        };
        return {
            bindTypeEnum: {
                1: '手机',
                3: '网页软电话',
                4: 'IP话机'
            },
            hasWebrtcAuth: false,
            originServiceList: [
                {
                    name: 'IP话机', 
                    bindType: '4', 
                    type: 'ip', 
                    tip: '建议公司办公时使用', 
                    imgUrl: require('@/assets/images/seat/bind-ip.png'),
                },
                {
                    name: '网页软电话', 
                    bindType: '3', 
                    type: 'webrtc', 
                    tip: '建议居家或IP话机故障时使用', 
                    imgUrl: require('@/assets/images/seat/bind-webrtc.png')
                },
                {
                    name: '手机', 
                    bindType: '1',
                    type: 'box', 
                    tip: '建议IP话机故障时使用', 
                    tip2: '建议以上都故障时使用', 
                    imgUrl: require('@/assets/images/seat/bind-box.png')
                },
            ],
            showBindDialog: false,
            renderKey: 1,
            bindStep: 1,
            phoneLength: 13,
            bindConfirmLoading: false,
            bindForm: {
                bindType: '', //设备类型
                used: true,
                callNo: '', //座席号
                supplierType: '', //线路
                phone: '', //绑定号码

                batchList: [], // 1044灰度内批量绑定
            },
            bindRule: {
                callNo: [
                    {required: true, message: '请输座席号', trigger: 'blur'},
                ],
                phone: [
                    {required: true, message: '请填写绑定号码', trigger: 'blur'},
                    {validator: validatePhone, trigger: 'blur'},
                ],
                batchRequired: [
                    {validator: validBatchRequired },
                ],
                batchPhone: [
                    {validator: validBatchPhone, trigger: 'blur'},
                ],
            },
            showUnBindDialog: false,
            showChangeDialog: false,
            changeForm: {
                bindType: '',
                used: true,
                supplierType: '',
                phone: '',
                supplierName: '',
                canModifyPhone: true,
            },
        };
    },
    props: {
        type: {
            type: String,
            default: 'bind', //unbind、change
        },
        // type === 'change'时 必需
        supplierType: {
            type: [String, Number],
            default: '',
        },
        // type === 'change'，区分是老版本 切换 还是 新版本 绑定
        mode: {
            type: String,
            default: ''
        },
    },
    computed: {
        ...mapState('message', ['seats']),
        ...mapState('user', ['isInCallAutoSwitchGrey']),
        ...mapGetters('message', ['bindedList']),
        serviceList () {
            return this.originServiceList.filter((item) => {
                return item.bindType !== '3' || item.bindType === '3' && this.hasWebrtcAuth;
            });
        }
    },
    watch: {
        type: {
            handler (val) {
                if (val) {
                    if(val == 'bind') {
                        this.initWebrtcGrey();
                        // 获取是否有webrtc权限
                        this.showBindDialog = true;
                    } 
                    else if(val == 'unbind') {
                        this.showUnBindDialog = true;
                    }
                    else if(val == 'change') {
                        // 判断直接切换 or 绑定切换
                        let targetItem = null;
                        this.seats.forEach(item => {
                            if(item.supplierType == this.supplierType) {
                                targetItem = item;
                            };
                        });
                        if(targetItem.bind) {
                            this.doSwitch();
                        } else {
                            let bindedPhone = this.bindedList && this.bindedList.length && this.bindedList[0].phone;
                            let bindedBindType = this.bindedList && this.bindedList.length && this.bindedList[0].bindType;
                            let canModifyPhone = bindedBindType == 1 && this.testMobile(bindedPhone) ? false : true;
                            let finalPhone = canModifyPhone ? '' : bindedPhone;

                            // 软电话自动带入号码
                            if (bindedBindType == 3) {
                                canModifyPhone = false;
                                finalPhone = this.bindedList && this.bindedList.length && this.bindedList[0].callNo;
                            };

                            this.changeForm = {
                                bindType: bindedBindType,
                                used: true,
                                supplierType: targetItem.supplierType,
                                phone: finalPhone,
                                supplierName: targetItem.supplierName,
                                canModifyPhone: canModifyPhone,
                            };
                            this.showChangeDialog = true;
                        };
                    };
                };
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions('message', ['updateState']),
        initWebrtcGrey () {
            this.$ajax({
                url: `/grey/user/ifGrey?code=${10043}`,
            }).then( ({ data }) => {
                this.hasWebrtcAuth = data === 1;
            });
        },
        testMobile: function (mobile) {
            var reg = /^1[3456789]\d{9}$/;
            return reg.test(mobile);
        },
        selectService (item) {
            const selectedBindType = item.bindType;
            this.bindForm.bindType = selectedBindType;
            this.bindForm.callNo = this.$store.state.user.userInfo.callNoEnable ? '' :  this.$store.state.user.userInfo.callNoDefault;
            this.bindForm.supplierType = this.seats.length && this.seats[0].supplierType || '';
            
            // 区分1044自动切换灰度内外
            if (this.isInCallAutoSwitchGrey) {
                // 手机和软电话（只输入一个号码输入框）
                let arr = [];
                if (selectedBindType == 1 || selectedBindType == 3) {
                    arr = [{
                        bindType: selectedBindType,
                        title: this.seats.map(item => item.supplierName),
                        bindTel: selectedBindType == 3 ? this.bindForm.callNo : ''
                    }];
                } else {
                    arr = this.seats.map(item => {
                        return {
                            bindType: selectedBindType,
                            title: [item.supplierName],
                            bindTel: '',
                            supplierType: item.supplierType
                        };
                    });
                }
                this.$set(this.bindForm, 'batchList', arr);
            };
            
            if (selectedBindType == 3) {
                let vm = this;
                // 软电话坐席号和绑定号码相同 且不能修改
                this.bindForm.phone = this.bindForm.callNo;
                this.$dialog({
                    title: '注册软电话',
                    content: '将为您打开新的网页注册软电话，此页面仅进行语音通话使用，请勿关闭，关闭后将无法正常通话。',
                    confirmText: '去注册',
                    width: 480,
                    onConfirm () {
                        vm.bindStep = 2;
                        // 增加target标记
                        const baseUrl = process.env.NODE_ENV == 'development' ? '' : '/web';
                        window.open(`${baseUrl}/webrtc`, 'webrtc');
                    },
                });
            }
            else {
                this.bindStep = 2;
                this.bindForm.phone = '';
            };
        },
        cancelBind () {
            if(this.bindStep == 2) {
                this.bindStep = 1;
            } else {
                this.showBindDialog = false;
            };
        },
        inputPhone (formKey) {
            let bindType = this[formKey].bindType;
            if(bindType == 1) {
                if(!/^(0|1)/.test(this[formKey].phone)) {
                    this[formKey].phone = '';
                    this.renderKey = Math.random() * 1000;
                    this.$nextTick(() => {
                        this.$refs['phone'].focus();
                    });
                } else {
                    this.phoneLength = /^1/.test(this[formKey].phone) ? 11 : 12;
                };
            } else {
                this.phoneLength = 30;
            };
        },
        inputBatchPhone () {
            let bindType = this.bindForm.bindType;
            if(bindType == 1) {
                if(!/^(0|1)/.test(this.bindForm.batchList[0].bindTel)) {
                    this.bindForm.batchList[0].bindTel = '';
                    this.renderKey = Math.random() * 1000;
                    this.$nextTick(() => {
                        this.$refs['batchPhone'][0].focus();
                    });
                } else {
                    this.phoneLength = /^1/.test(this.bindForm.batchList[0].bindTel) ? 11 : 12;
                };
            } else {
                this.phoneLength = 30;
            };
        },
        doBind (formKey) {
            this.$refs[formKey].validate((valid=true) => {

                if(!valid || this.bindConfirmLoading) return;

                const data = this[formKey];
                
                if (this.isInCallAutoSwitchGrey) {
                    if (this.type === 'bind') {
                        this.onBatchBind(data);
                    } else if (this.type === 'change' && this.mode === 'batchBind') {
                        this.sendBatchBindRequest([
                            {
                                bindType: data.bindType,
                                bindTel: data.phone,
                                supplierType: data.supplierType
                            }
                        ]); 
                    }
                } else {
                    this.onNormalBind(data);
                };
            });
        },
        onNormalBind (data) {
            this.sendNormalBindRequest(data);
        },
        sendNormalBindRequest (data) {
            this.bindConfirmLoading = true;
            let {bindType, used, supplierType, phone} = data;

            this.$ajax({
                method: 'POST',
                url: '/rest/call/bind',
                data: {
                    bindType,
                    used,
                    supplierType,
                    phone,
                },
                quiet: true,
            }).then(({code, data, message}) => {
                if(code == 1) {

                    this.showBindDialog = false;
                    this.showChangeDialog = false;
                    
                    this.$toast({
                        type: 'success',
                        content: message,
                        duration: 3000,
                    });

                    // 更新座席状态
                    this.$updateSeatstatus.update(data);
                    
                } else {
                    if(code == -10) {
                        //话机未联网
                        this.$nonNetworkedTip();
                    } else {
                        this.$toast({
                            type: 'error',
                            content: message,
                            duration: 3000,
                        });
                    };
                    // 更新座席状态
                    this.$updateSeatstatus.update();
                };
            }).finally(() => {
                this.bindConfirmLoading = false;
            });
        },
        onBatchBind (data) {
            const { batchList } = data;
            let postData = [];
            if (this.bindForm.bindType == 1 || this.bindForm.bindType == 3) {
                // 绑定时候只输入一项，接口需要传每一条线路
                const { bindType, bindTel } = batchList[0];
                postData = this.seats.map(item => {
                    return {
                        bindType,
                        bindTel,
                        supplierType: item.supplierType
                    };
                });
                this.sendBatchBindRequest(postData);
            } else if (this.bindForm.bindType == 4) {
                const unbindList = batchList.filter(item => !item.bindTel);
                postData = batchList.filter(item => !!item.bindTel).map(({ bindType, bindTel, supplierType }) => {
                    return {
                        bindType,
                        bindTel,
                        supplierType
                    };
                });

                if (unbindList.length) {
                    const vm = this;
                    const __title = unbindList.map(item => item.title.join('')).join('/');
                    this.$dialog({
                        title: `${__title}未绑定号码`,
                        content: `${__title}未绑定号码会导致外呼无法使用${__title}线路，<br />请确认是否继续操作？`,
                        userHtmlString: true,
                        width: 480,
                        closeText: ' ',
                        onConfirm () {
                            vm.sendBatchBindRequest(postData);
                        }
                    });
                } else {
                    this.sendBatchBindRequest(postData);
                }

            }
        },
        customToast (content) {
            // 临时处理content带br问题
            try {
                const len = content.split('<br/>').length;
                this.$toast({
                    wrapClass: `${len > 1 ? 'custom-toast' : ''}`,
                    type: 'success',
                    content,
                    duration: 3000,
                });
                if (len > 1) {
                    this.$nextTick(() => {
                        document.querySelector('.toast-con').innerHTML = document.querySelector('.toast-con').innerText;
                    });
                }
            } catch (error) {
                // 
            };
        },
        sendBatchBindRequest (data) {
            this.bindConfirmLoading = true;
            this.$ajax({
                method: 'POST',
                url: '/rest/call/bindBatch',
                data,
                quiet: true,
            }).then(({code, data, message}) => {
                if(code == 1) {

                    this.showBindDialog = false;
                    this.showChangeDialog = false;
                    
                    // this.$toast({
                    //     type: 'success',
                    //     content: message,
                    //     duration: 3000,
                    // });
                    this.customToast(message);

                    // 更新座席状态
                    this.$updateSeatstatus.update(data);
                    
                } else {
                    if(code == -10) {
                        //话机未联网
                        this.$nonNetworkedTip();
                    } else {
                        // this.$toast({
                        //     type: 'error',
                        //     content: message,
                        //     duration: 3000,
                        // });
                        this.customToast(message);
                    };
                    // 更新座席状态
                    this.$updateSeatstatus.update();
                };
            }).finally(() => {
                this.bindConfirmLoading = false;
            });
        },
        doUnbind () {
            this.$ajax({
                method: 'POST',
                url: '/rest/call/unbind',
                quiet: true,
            }).then(({code, data, message}) => {
                if(code == 1) {

                    // 更新座席状态
                    this.$updateSeatstatus.update(data);
                    
                    this.alertInfo(message || '解绑成功'); // 兼容fabio解除绑定成功，未同步情况

                } else {
                    if(code == -10) {
                        //话机未联网
                        this.$nonNetworkedTip();
                    } else {
                        this.alertInfo(message);
                    };
                    this.$updateSeatstatus.update();
                };
            });
        },
        doSwitch () {
            this.$ajax({
                method: 'POST',
                url: '/rest/call/change',
                data: {
                    supplierType: this.supplierType,
                },
                quiet: true,
            }).then(({code, message, data}) => {
                if(code == 1) {
                    
                    // 更新座席状态
                    this.$updateSeatstatus.update(data);
                    
                    this.$toast({
                        type: 'success',
                        content: message || '切换成功',
                        duration: 3000,
                    });

                } else {
                    if(code == -10) {
                        //话机未联网
                        this.$nonNetworkedTip();
                    } else {
                        this.$toast({
                            type: 'error',
                            content: message,
                            duration: 3000,
                        });
                    };
                    // 更新座席状态
                    this.$updateSeatstatus.update();
                };
            });
        },
        alertInfo (message) {
            this.$dialog({
                title: '提示',
                content: message,
                type: 'warning',
                userHtmlString: true,
                cancelText: false,
                closeText: ' ',
                confirmText: '关闭',
            });
        },
    }
};
</script>
<style lang="less">
    @import './index.less';
</style>