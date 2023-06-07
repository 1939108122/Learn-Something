<template>
    <ui-dialog 
        v-model="show" 
        title="呼叫" 
        wrapClass="dialog-outcall" 
        preventLayer
        :width="420" 
        :showClose="false">
        <template slot="content">
            <div class="confirm-tip">
                <!-- 是否为黑名单客户 -->
                <template v-if="previewData.isBlack == 1">
                    "&nbsp;{{ previewData.name }}&nbsp;{{ previewData.phoneShow }}&nbsp;"&nbsp;为黑名单电话，拨打不计入电话KPI
                </template>
                <template v-else>
                    确定要拨打&nbsp;"&nbsp;{{ previewData.name }}&nbsp;{{ previewData.phoneShow }}&nbsp;"&nbsp;的电话吗？
                </template>
            </div>
            <template v-if="previewData.faceParams">
                <div class="face-wrapper" :type="previewData.faceParams.mobileRiskStatus">
                    <div class="face-icon" :class="`face-icon-${previewData.faceParams.mobileRiskStatus}`"></div>
                    <div class="face-content">
                        <div class="info"><h4>{{ previewData.name }}</h4>{{ previewData.phoneShow }}</div>
                        <div class="status">{{ previewData.faceParams.callTips }}</div>
                    </div>
                </div>
            </template>
            <!-- 不是自动切换的灰度 -->
            <!-- “是不是”内容风控的灰度 -->
            <template v-if="!isInCallAutoSwitchGrey">
                <template v-if="showSwitchSupplier">
                    <div class="supplier-opera">
                        <span class="title">线路</span>
                        <ui-select v-model="cur">
                            <ui-option
                                v-for="item in supplierOptions"
                                :value="item.supplierType"
                                :key="item.supplierType">{{ item.supplierName }} {{ item.risk == 1 ? '(禁呼)' : '(可用)' }}</ui-option>
                        </ui-select>
                        <span class="status" v-if="showRiskTip">当前线路风控请切换其他线路</span>
                    </div>
                </template>
                <div v-else class="supplier">当前线路：{{ currentSupplierName }}</div>
            </template>
            <div class="warning-tip" v-if="previewData.warningTips"><i class="icrm-info"></i>{{ previewData.warningTips }}</div>
        </template>
        <template slot="footer">
            <div class="dialog-footer">
                <div class="btns">
                    <button class="btn btn-outline btn-cancel" @click="cancel">取消</button>
                    <button class="btn btn-primary btn-sure" :disabled="showRiskTip" @click="call">确定</button>
                </div>
            </div>
        </template>
    </ui-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    name: 'OutCallDialog',
    data () {
        return {
            show: true,
            cur: null, // 当前线路
            riskList: [], // 被风控的线路
            needSwitch: true
        };
    },
    props: {
        previewData: {
            type: Object,
            default: () => ({
                riskVersion: 1
            })
        },
        cb: {
            type: Function
        },
    },
    computed: {
        ...mapState('user', ['isInCallAutoSwitchGrey']),
        ...mapGetters('message', ['currentSupplierName']),
        riskVersion () {
            // 内容风控版本号2，历时版本1
            return this.previewData?.riskVersion || 1;
        },
        showSwitchSupplier () {
            // 还要判断当前线路没被风控
            return !this.isInCallAutoSwitchGrey && this.riskVersion == 2 && this.previewData?.faceParams?.callSuppliers;
        },
        showRiskTip () {
            return !!this.riskList.length && !!this.cur && this.riskList.includes(+this.cur);
        },
        supplierOptions () {
            return (this.previewData.faceParams.callSuppliers || []).map(item => {
                return item;
            });
        },
    },
    created () {
        if (this.previewData.faceParams && this.previewData.faceParams.callSuppliers && Array.isArray(this.previewData.faceParams.callSuppliers)) {
            this.previewData.faceParams.callSuppliers.forEach(item => {
                if (item.current == 1) {
                    this.cur = item.supplierType;
                }
                if (item.risk == 1) {
                    this.riskList.push(item.supplierType);
                }
            });
        }
    },
    watch: {
        cur: {
            immediate: true,
            handler (newVal, oldVal) {
                if (!!newVal && !!oldVal && newVal != oldVal && this.needSwitch) {
                    // 调用切换线路的接口
                    this.doSwitch(newVal, oldVal);
                }
                this.needSwitch = true;
            }
        },
    },
    methods: {
        ...mapActions('common', ['updateWsStatus']),
        doSwitch (supplierType, oldSupplierType) {
            this.$ajax({
                method: 'POST',
                url: '/rest/call/change',
                data: {
                    supplierType: supplierType,
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
                    // 重置
                    this.needSwitch = false;
                    this.cur = oldSupplierType;

                };
            });
        },
        send (params, onSuccessSendPreviewOutcall) {

            let {customerId, contactId, name, phone, clueId, menuPrefix} = params;

            this.$ajax({
                method: 'POST',
                url: '/rest/call/callout',
                data: {
                    contactId,
                    customerId,
                    clueId,
                    menuPrefix,
                    contactName: name,
                    contactNo: phone,
                },
                quiet: true,
            }).then(({code, data, message}) => {
                if(code == 1) {
                    // 展示通话中弹窗
                    this.$dial.show({
                        type: 'calling',
                        callParams: data,
                    });

                    // 更新座席顶部显示状态
                    this.$updateSeatstatus.update();

                    // 成功发起外呼之行回调函数
                    if(onSuccessSendPreviewOutcall && typeof onSuccessSendPreviewOutcall == 'function') {
                        onSuccessSendPreviewOutcall();
                    };
                    
                    // postMessage方式 替换为直接存store
                    let obj = {
                        model: 'callcenter',
                        grey: 'Y', // 灰度
                        customerId: params.customerId,
                        callStatusDesc: '拨打未接通'
                    };
                    this.updateWsStatus(obj);

                } else {
                    if(code == -10) {
                        //话机未联网
                        this.$nonNetworkedTip();
                    } else {
                        this.$toast({
                            type: 'error',
                            content: message,
                            duration: 5000
                        });
                    };
                }
            });
        },
        cancel () {
            this.$destroy();
        },
        call () {
            //无效电话，禁止呼出
            if(!this.previewData.customerId) {
                this.$toast({
                    type: 'error',
                    content: 'customerid异常，暂不可拨打电话',
                    duration: 3000
                });
                return false;
            };

            this.cancel();

            // 拨打电话功能
            this.send(this.previewData, this.cb);

            //通用埋点
            this.$trackEvent({
                action: 'call_subject_fold_panel',
            });
        },
    },
};
</script>

<style lang="less">
.dialog-outcall {
    .confirm-tip {
        padding: 12px 0;
    }
    .face-wrapper {
        display: flex;
        padding: 14px 16px;
        align-items: flex-start;
        border-radius: 6px;
        &[type="0"] {
            background-color: #DBF7EE;
        }
        &[type="1"] {
            background-color: #FFF6E3;
        }
        &[type="2"] {
            background-color: #CDCDCD;
        }
        .face-icon {
            width: 38px;
            height: 38px;
            margin-top: 3px;
            margin-right: 12px;
            &-0 {
                background: url("~@/assets/images/face/face-0.png");
                background-size: 100% 100%;
            }
            &-1 {
                background: url("~@/assets/images/face/face-1.png");
                background-size: 100% 100%;
            }
            &-2 {
                background: url("~@/assets/images/face/face-2.png");
                background-size: 100% 100%;
            }
        }
        .face-content {
            // display: flex;
            flex: 1;
            flex-shrink: 0;
            .info {
                display: flex;
                line-height: 20px;
                align-items: center;
                h4 {
                    margin-right: 8px;
                    line-height: 22px;
                    font-size: 16px;
                    font-weight: 500;
                }
            }
            .status {
                margin-top: 4px;
                line-height: 18px;
                color: #757D8C;
            }
        }
    }
    .supplier {
        padding: 5px 0;
        line-height: 20px;
        font-size: 12px;
        color: #fd7f83;
    }
    .supplier-opera {
        margin-top: 12px;
        margin-bottom: 12px;
        .ui-select {
            width: 104px;
            margin-left: 6px;
            margin-right: 8px;
        }
        .status {
            color: #F77233;
        }
    }
    .warning-tip {
        padding: 5px 0;
        line-height: 20px;
        font-size: 12px;
        i {
            margin-right: 5px;
            font-size: 12px;
            color: #fd7f83;
        }
    }
}
</style>