<template>
    <div class="customer-icon-list">
        <!-- 工商认证 -->
        <!-- <template v-if="origin.certification == 1">
            <icon-certification></icon-certification>
        </template> -->

        <!-- 高质客户 -->
        <template v-if="(origin.recruitLevel == 1 || origin.recruitLevel == 2) && menuPrefix === 'my'">
            <icon-recruit-level :recruitLevel="origin.recruitLevel"></icon-recruit-level>
        </template>

        <!-- 阻断图标 -->
        <template v-if="origin.blockShowType >= 1">
            <icon-block :origin="origin"></icon-block>
        </template>

        <!-- 客户级别 -->
        <template v-if="origin.level">
            <icon-level :level="origin.level"></icon-level>
        </template>

        <!-- 合并客户 -->
        <template v-if="origin.isMerge == 1">
            <icon-merge></icon-merge>
        </template>

        <!-- 询价保护 && 集采客户 -->
        <template v-if="origin.priceProtectionDO && Object.keys(origin.priceProtectionDO || {}).length">
            <icon-protection :origin="origin"></icon-protection>
        </template>

        <!-- 竞品中标 -->
        <template v-if="origin.competitionAdType == 1">
            <icon-competition></icon-competition>
        </template> 

        <!-- 好望角客户 -->
        <template v-if="origin.cape == 1">
            <icon-cape></icon-cape>
        </template>

        <!-- 置换 -->
        <template v-if="origin.swap == 1">
            <icon-swap></icon-swap>
        </template>

        <!-- 成单提醒 --> <!-- 目前列表接口返回的该字段不正确 -->
        <template v-if="origin.singleRemindDept">
            <icon-sign-remind 
                :singleRemindUser="origin.singleRemindUser" 
                :singleRemindDept="origin.singleRemindDept"></icon-sign-remind>
        </template>

        <!-- X客户 -->
        <template v-if="origin.black">
            <icon-black></icon-black>
        </template>

        <!-- 个体工商户 -->
        <template v-if="origin.customerJerusalemDO && origin.customerJerusalemDO.economicType == '个体工商户'">
            <icon-j-economic></icon-j-economic>
        </template>
        <!-- 经营状态 && 经营状态反馈 --> <!-- 目前列表接口返回的该字段不正确 -->
        <template v-if="origin.customerJerusalemDO">
            <icon-j-operating
                v-bind="$attrs"
                :customerId="customerId"
                :className="origin.customerJerusalemDO.operatingStateClass"
                :operatingState="origin.customerJerusalemDO.operatingState"
                :operatingStateTxt="origin.customerJerusalemDO.operatingStateTxt"
                :operatingStateCode="origin.customerJerusalemDO.operatingStateCode"
                :fromKefu="fromKefu"></icon-j-operating>
        </template>

        <!-- 正在进行 “安全审核” -->
        <template v-if="origin.safeProcessing">
            <icon-safe-audit></icon-safe-audit>
        </template>

        <!-- 铁壁相关标签 -->
        <template v-if="origin.ironManTag == 2">
            <icon-tiebi-man></icon-tiebi-man>
        </template>
        <template v-if="origin.ironCustomerTag && Object.keys(origin.ironCustomerTag || {}).length">
            <icon-tiebi-customer
                :addTimeStr="origin.ironCustomerTag.addTimeStr"
                :addV="origin.ironCustomerTag.addV"></icon-tiebi-customer>
        </template>
        
        <!-- 自定义标签 -->
        <template v-if="origin.customerTagVOS && origin.customerTagVOS instanceof Array && origin.customerTagVOS.length">
            <icon-custom 
                v-for="item in origin.customerTagVOS" 
                :key="item.id" 
                :item="item"></icon-custom>
        </template>

    </div>
</template>
<script>
import iconCertification from './consist/2-icon-certification'; //工商认证
import iconRecruitLevel from './consist/icon-recruit-level'; //高质客户标签
import iconBlock from './consist/icon-block'; //阻断图标
import iconLevel from './consist/icon-level'; //客户级别 “S\A\B\C\D”
import iconMerge from './consist/icon-merge'; //合并客户
import iconProtection from './consist/icon-protection'; //询价保护
import iconCompetition from './consist/2-icon-competition'; //竞品中标
import iconCape from './consist/icon-cape'; //好望角客户
import iconSwap from './consist/2-icon-swap'; //置换
import iconSignRemind from './consist/2-icon-sign-remind'; //成单提醒
import iconBlack from './consist/2-icon-black'; //x客户
import iconJEconomic from './consist/2-icon-j-economic'; //个体工商户
import iconJOperating from './consist/2-icon-j-operating'; //经营状态
import iconSafeAudit from './consist/2-icon-safe-audit'; //此客户正在进行安全审核
import iconTiebiMan from './consist/2-icon-tiebi-man'; //铁壁相关标签
import iconTiebiCustomer from './consist/2-icon-tiebi-customer'; //铁壁相关标签
import iconCustom from './consist/icon-custom'; //自定义图标
export default {
    name: 'customer-details-icon',
    data () {
        return {
            origin: {},
        };
    },
    props: {
        menuPrefix: {
            type: String,
            default: '',
        },
        // 客户加密id
        customerId: {
            type: String,
            default: '',
        },
        // TODO：支持传入图标集数据渲染
        sourceData: {
            type: Object,
            default: () => ({})
        },
        // 请求图标集数据的接口地址
        url: {
            type: String,
            default: '/customer/icon.json',
        },
        fromKefu: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        iconLevel,
        iconMerge,
        iconCape,
        iconProtection,
        iconBlock,
        iconCertification,
        iconRecruitLevel,
        iconCompetition,
        iconSwap,
        iconSignRemind,
        iconBlack,
        iconJEconomic,
        iconJOperating,
        iconSafeAudit,
        iconTiebiMan,
        iconTiebiCustomer,
        iconCustom,
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$ajax({
                method: 'GET',
                url: this.url,
                params: {
                    customerId: this.customerId
                }
            }).then( ({code, message, data}) => {
                if (code == 1) {
                    this.origin = JSON.parse(JSON.stringify(data || {}));
                }
            });
        },
    }
};
</script>

<style lang="less">
@import url('./index.less');
</style>