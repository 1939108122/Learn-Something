<template>
    <div class="enterprise-call">
        <ui-tooltip2
            appendToBody
            :placement="readonly ? 'top' :'right'"
            :effect="readonly ? 'dark' : 'light'"
            :popperClass="readonly ? '' : 'popper-enterprise-call'">
            <div class="enterprise-call-trigger"><span class="icrm-round-phone" @click="makePhoneCall"></span><span class="num"><i>{{ origin.contactCount || 0 }}</i></span></div>
            <template slot="content">
                <div class="enterprise-content" v-if="!readonly">
                    <div class="frame">七天内通话统计</div>
                    <div class="times">
                        <ul>
                            <li>
                                <h3>{{ origin.callOutCount || 0 }}</h3>
                                <p>外呼次数</p>
                            </li>
                            <li>
                                <h3>{{ origin.callOutRejectCount || 0 }}</h3>
                                <p>拒接次数</p>
                            </li>
                            <li>
                                <h3>{{ origin.callOutInvalidCount || 0 }}</h3>
                                <p>无效外呼次数</p>
                            </li>
                        </ul>
                    </div>
                    <div class="records">
                        <!-- 固定头 -->
                        <ul>
                            <li>
                                <span>联系时间</span>
                                <span>联系时长</span>
                                <span>状态</span>
                                <span>商业顾问</span>
                                <span>所属部门</span>
                            </li>
                        </ul>
                        <!-- 内容区域 -->
                        <ul>
                            <template v-if="origin.callCenterRecords && origin.callCenterRecords instanceof Array && origin.callCenterRecords.length">
                                <li v-for="record in origin.callCenterRecords" :key="record.id">
                                    <span><i v-if="record.startTime">{{ record.startTime | formatDate('yyyy-MM-dd HH:mm') }}</i></span>
                                    <span>{{ record.bridgeDuration }}</span>
                                    <span>
                                        <i v-if="record.sipCause == 512" class="text-danger">拒接</i>
                                        <i v-else-if="record.bridgeDurationTime <= 44" class="text-danger">无效</i>
                                        <i v-else class="text-info">正常</i>
                                    </span>
                                    <span>{{ record.userName }}</span>
                                    <span>{{ record.deptName }}</span>
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
    name: 'enterprise-call',
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
        rank: {
            type: [String, Number],
            default: 0,
        },
    },
    methods: {
        makePhoneCall () {

            if(this.readonly) return false;

            let item = this.origin;
            //执行外呼功能
            let params = {
                phone: item.mobile,
                phoneShow: item.mobileStr,
                name: item.name,
                customerId: item.customerId,
                contactId: item.contactId,
                isBlack: item.mobileBlack || false,
            };
            try {
                //渲染弹窗
                this.$previewOutcall(params);
            } catch (error) {
                //console.log(error);
            };

            //trackEvent
            this.$trackEvent({
                action: 'crm-customerDetail-dial',
                target: item.customerId,
                p1: 1,
                p2: 1,
                p3: item.bossId,
                p4: item.customerId,
                p9: this.rank + 1,
            });

        },
    },
};
</script>

<style lang="less">
@import url('./index.less');
</style>