<template>
    <div class="risk-call">
        <ui-tooltip2
            appendToBody
            :placement="tooltipPlacement"
            :effect="tooltipEffect"
            :popperClass="tooltipExtendClassName">
            <template v-if="riskCallComponentVersion == 2">
                <div class="risk-call-trigger-plus" :type="origin.mobileRiskStatus" :class="{'from-kefu-disabled': fromKefu}">
                    <i class="risk-emoji" :class="`risk-emoji-${origin.mobileRiskStatus}`"></i>
                    <span class="counts" @click="makePhoneCall"><i class="icrm-dianhua"></i>{{ origin.contactCount | max99Filter }}</span>
                </div>
            </template>
            <template v-else>
                <div
                    class="risk-call-trigger"
                    :class="{'risk-call-trigger-warning': origin.mobileRiskStatus == 1, 'risk-call-trigger-disabled': origin.mobileRiskStatus == 2 || origin.mobileRiskStatus == 3}"
                    @click.prevent="makePhoneCall"><i class="icrm-round-phone" :class="{'from-kefu-disabled': fromKefu}"></i><span class="num"><i>{{ origin.contactCount | max99Filter }}</i></span></div>
            </template>
            
            <template slot="content">
                <div class="risk-content" v-if="!readonly">
                    <div class="frame">
                        <span>该BOSS联系情况</span>
                        <!-- 下线，观察是否有反馈 -->
                        <!-- <a href="javascript:;" v-if="origin.showChangeSupplier">切换线路</a> -->
                    </div>
                    <div class="purpose" :class="{'purpose-warning': origin.mobileRiskStatus == 1, 'purpose-danger': origin.mobileRiskStatus == 2 || origin.mobileRiskStatus == 3}">
                        <div class="purpose-icon" >
                            <div class="purpose-trigger" @click="makePhoneCall" :class="{'from-kefu-disabled': fromKefu}">
                                <i v-if="riskCallComponentVersion == 2" class="porpose-trigger-emoji" :class="`porpose-trigger-emoji-${origin.mobileRiskStatus}`"></i>
                                <i v-else class="icrm-round-phone"></i>
                            </div>
                            <div class="status">{{ mobileRiskStatusText }}</div>
                        </div>
                        <div class="purpose-content">
                            <!-- 文 -->
                            <template v-if="origin.encryptRiskCallRecordId">
                                <div class="asr-panel" :keyWord="origin.riskKeyWordsJsonStr" @click="callAsr"><i class="icrm icrm-audio-play"></i></div>
                            </template>
                            <p>
                                <span>{{ origin.mobileStr }}</span>
                                <!-- shield-动态调整强拒绝的风控时长 -->
                                <!-- 针对强拒绝风控的解封时间提醒，突出“预计时间”的说明 -->
                                <template v-if="origin.mobileUnlockTime">
                                    <template v-if="origin.mobileUnlockTimeMayDelay">
                                        <ui-tooltip :appendToBody="false" :tabindex="9999" trigger="hover" width="250" placement="right">
                                            <span slot="reference" class="date"><i class="icrm-reminder"></i>预计{{ origin.mobileUnlockTime | formatDate('yyyy-MM-dd') }} 解封</span>
                                            <span slot="content" class="f-12">该号码将在解封当天结合用户意愿判定是否解封，可能会延长风控。如需提前联系，可发起申请。</span>
                                        </ui-tooltip>
                                    </template>
                                    <span v-else class="date"><i class="icrm-reminder"></i>{{ origin.mobileUnlockTime | formatDate('yyyy-MM-dd HH:mm') }} 解封</span>
                                </template>
                            </p>
                            <p>
                                <span v-if="riskCallComponentVersion == 2">{{ origin.callTips }}</span>
                                <template v-else>
                                    <span v-if="origin.mobileRiskStatus == 3">联系过于频繁，客户会反感，<i class="color-blue">{{ origin.redisUnlockLeftMinutes }}分钟</i>后可再次联系。</span>
                                    <span v-else-if="origin.mobileRiskStatus == 1 || origin.mobileRiskStatus == 2">{{ origin.mobileRiskReason }}</span>
                                    <span v-else>当前没有记录到BOSS的投诉，可正常联系。</span>
                                </template>
                            </p>
                        </div>
                    </div>
                    <div class="frame">7天内通话统计</div>
                    <div class="times">
                        <ul>
                            <li>
                                <h3>{{ origin.callOutCount }}</h3>
                                <p>外呼次数</p>
                            </li>
                            <li>
                                <h3>{{ origin.callOutConnectionCount }}</h3>
                                <p>双方接听次数</p>
                            </li>
                        </ul>
                    </div>
                    <div class="records">
                        <!-- 固定头 -->
                        <ul>
                            <li>
                                <span>联系时间</span>
                                <span>时长</span>
                                <span>商业顾问</span>
                            </li>
                        </ul>
                        <!-- 内容区域 -->
                        <ul>
                            <template v-if="origin.callCenterRecords && origin.callCenterRecords instanceof Array && origin.callCenterRecords.length">
                                <li v-for="record in origin.callCenterRecords" :key="record.id">
                                    <span><i v-if="record.startTime">{{ record.startTime | formatDate('yyyy-MM-dd HH:mm') }}</i></span>
                                    <span>{{ record.bridgeDuration }}</span>
                                    <span>{{ record.userName }}</span>
                                </li>
                            </template>
                            <li v-else class="records-blank">7天内无通话记录</li>
                        </ul>
                    </div>
                    <div class="frame">最后一次跟进记录 <a href="javascript:;" @click.prevent="$emit('onViewMore')">更多</a></div>
                    <div class="follow-last">
                        <template v-if="origin.lastFollow">
                            <div class="msg">{{ origin.lastFollow.followNotes }}</div>
                            <div class="follow-info">
                                {{ origin.lastFollow.userName }}
                                {{ origin.lastFollow.departmentName }}
                                <i v-if="origin.lastFollow.followType == 0">电话跟进</i>
                                <i v-else-if="origin.lastFollow.followType == 1">面谈跟进</i>
                                <i v-else-if="origin.lastFollow.followType == 2">微信/QQ跟进</i>
                                <span v-if="origin.lastFollow.followTime">{{ origin.lastFollow.followTime | formatDate('yyyy-MM-dd') }}</span>
                            </div>
                        </template>
                        <div v-else class="follow-blank">无跟进记录信息</div>
                    </div>
                </div>
                <div v-else>联系方式在认领客户后可见</div>
            </template>
        </ui-tooltip2>
    </div>
</template>

<script>
export default {
    name: 'risk-call',
    data () {
        return {};
    },
    props: {
        readonly: {
            type: Boolean,
            default: false,
        },
        origin: {
            type: Object,
            default: () => ({}),
        },
        // 引用来源 boss列表 contact列表
        from: {
            type: String,
            default: 'contact',
            required: true,
        },
        //主客户加密id
        customerId: {
            type: String,
            default: '',
        },
        fromKefu: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 风控版本 1 老版本 2 新版本
        riskCallComponentVersion () {
            return this.origin.riskVersion || 1;
        },
        tooltipPlacement () {
            return this.readonly ? 'top' :'right';
        },
        tooltipEffect () {
            return this.readonly ? 'dark' : 'light';
        },
        tooltipExtendClassName () {
            return this.readonly ? '' : 'popper-risk-call';
        },
        mobileRiskStatusText () {
            const riskEnums = {
                0: '正常联系',
                1: '谨慎联系',
                2: '停止联系',
                3: '停止联系', // 2新版本，没有当前值
            };
            return riskEnums[this.origin.mobileRiskStatus] || '';
        },
    },
    created() {
    },
    filters: {
        max99Filter (val) {
            return val > 99 ? '···' : val;
        },
    },
    methods: {
        makePhoneCall () {
            if(this.fromKefu) {return;}
            if(this.readonly) return false;

            let item = this.origin;

            let warningTip = '';
            // 新版本2不阻断
            if (this.riskCallComponentVersion == 1) {
                if (item.mobileRiskStatus == 1 && !item.canCall || item.mobileRiskStatus == 2) {
                    warningTip = item.mobileRiskReason;
                } else if(item.mobileRiskStatus == 3) {
                    warningTip = `联系过于频繁，客户会反感，${item.redisUnlockLeftMinutes}分钟后可再次联系。`;
                }
                if(warningTip) {
                    return this.$toast({
                        type: 'warning',
                        content: warningTip,
                    });
                };
            }
            
            // 新版本都展示mobileStr
            const phoneShowStr = this.riskCallComponentVersion == 1 && (item.mobileRiskStatus == 1 && !item.canCall || item.mobileRiskStatus == 2 || item.mobileRiskStatus == 3) ? item.mobileRiskReason : item.mobileStr;
            //执行外呼功能
            let params = {
                phone: item.mobileEncrypt,
                phoneShow: phoneShowStr,
                customerId: this.from == 'boss' ? this.customerId : item.customerId, //boss 打电话传主客户id
                contactId: this.from == 'contact' ? item.contactId : item.bossId,
                name: item.name,
                warningTips: (item.tags || []).includes(100) && '该BOSS最近30天在平台发生过投诉行为，请谨慎联系', // 3.26版本需求 判断tags中是否包含100
                riskVersion: this.riskCallComponentVersion, // 区分新旧版本（灰度控制）
            };

            // 3.69内容风控
            if (this.riskCallComponentVersion == 2) {
                params.faceParams = {
                    mobileRiskStatus: this.origin.mobileRiskStatus,
                    callSuppliers: this.origin.callSuppliers,
                    callTips: this.origin.callTips,
                };
            }

            try {
                //渲染弹窗
                this.$previewOutcall(params);
            } catch (error) {
                //console.log(error);
            };

            // 埋点
            try{
                if(this.from == 'contact') {
                    this.$trackEvent({
                        action: 'crm-customerDetail-dial',
                        target: item.customerId,
                        p1: 1,
                        p2: 1,
                        p3: item.bossId,
                        p4: item.customerId,
                    });
                } else {
                    this.$trackEvent({
                        action: 'crm-customerDetail-dial',
                        target: item.customerId,
                        p1: 2,
                        p2: 1,
                        p3: item.bossId,
                        p4: item.customerId,
                        p5: item.viewRatio,
                        p6: item.jobCount,
                        p7: item.lastLoginTimeStr || '',
                    });
                };
            } catch (e) {
                // console.log(e);
            };
        },
        callAsr () {

            let item = this.origin;
            let contentRiskMatchKeywords = item.riskKeyWords || [];
            let url = `/callcenter/record/risk/asr/detail.json?id=${item.encryptRiskCallRecordId}`;

            try {
                this.$seeAsr(url, contentRiskMatchKeywords);
                this.$BossAnalytics.track('WebClick', {
                    wc_interface: '标灰电话联系近况',
                    ele_name: 'marked-grey-phone-contact-situation',
                    wc_obj_id: item.encryptRiskCallRecordId,
                    wc_obj_type: 'call_r'
                });
            } catch (error) {
                console.log(error);
            };
        },
    },
};
</script>

<style lang="less">
@import url('./index.less');
</style>
