<template>
    <div class="customer-icon-list" v-if="Object.keys(origin).length" :key="origin.encryptId || Date.now() + Math.random() * 1000">
        <!-- 线索客户 -->
        <template v-if="origin.fromClue > 0 && origin.fromClue != 3 && showKeysList.includes('iconClue')">
            <icon-clue></icon-clue>
        </template>
        
        <!-- 成单概率 --> <!-- 成单概率“高、中” 目前在列表隐藏 -->
        <!-- <template v-if="origin.recruitLevel == 1 || origin.recruitLevel == 2">
            <icon-sign-probability :recruitLevel="origin.recruitLevel"></icon-sign-probability>
        </template> -->

        <!-- 高质客户 -->
        <template v-if="(origin.recruitLevel == 1 || origin.recruitLevel == 2) && menuPrefix === 'my' && showKeysList.includes('iconRecruitLevel')">
            <icon-recruit-level :recruitLevel="origin.recruitLevel"></icon-recruit-level>
        </template>

        <!-- 高质量客户（目前仅在客户列表展示） -->
        <template v-if="origin.busiHightQuality == 1 && menuPrefix == 'my' && showKeysList.includes('iconHighQualityCustomer')">
            <icon-high-quality-customer></icon-high-quality-customer>
        </template>

        <!-- 客户阻断 -->
        <template v-if="origin.blockShowType >= 1 && showKeysList.includes('iconBlock')">
            <icon-block :origin="origin"></icon-block>
        </template>

        <!-- 客户级别 -->
        <template v-if="origin.level && showKeysList.includes('iconLevel')">
            <icon-level :level="origin.level"></icon-level>
        </template>

        <!-- 合并客户 -->
        <template v-if="origin.isMerge == 1 && showKeysList.includes('iconMerge')">
            <icon-merge></icon-merge>
        </template>

        <!-- 好望角客户 -->
        <!-- <template v-if="origin.cape == 1">
            <icon-cape></icon-cape>
        </template> -->

        <!-- 询价保护 && 集采客户 -->
        <template v-if="origin.priceProtectionDO && Object.keys(origin.priceProtectionDO || {}).length && showKeysList.includes('iconProtection')">
            <icon-protection :origin="origin"></icon-protection>
        </template>
        
        <!-- 自定义图标 -->
        <template v-if="origin.customerTagVOS && origin.customerTagVOS instanceof Array && origin.customerTagVOS.length && showKeysList.includes('iconCustom')">
            <template v-for="(item, index) in origin.customerTagVOS">
                <icon-custom 
                    v-if="index < leftCustomIconNum"
                    :key="item.id" 
                    :item="item"></icon-custom>
            </template>
            
        </template>

    </div>
</template>
<script>
import iconClue from './consist/icon-clue'; //线索图标“索”
import iconRecruitLevel from './consist/icon-recruit-level'; //高质客户标签
import iconHighQualityCustomer from './consist/icon-high-quality-customer'; //优质客户
// import iconSignProbability from './consist/icon-sign-probability'; //成单概率 “高” “中” 
import iconBlock from './consist/icon-block'; //阻断图标
import iconLevel from './consist/icon-level'; //客户级别 “S\A\B\C\D”
import iconMerge from './consist/icon-merge'; //合并客户
// import iconCape from './consist/icon-cape'; //好望角客户
import iconProtection from './consist/icon-protection'; //询价保护
import iconCustom from './consist/icon-custom'; //自定义图标
export default {
    name: 'customer-list-icon',
    data () {
        return {
            showKeysList: [],
            leftCustomIconNum: 0, //剩余可渲染自定义图标的个数
        };
    },
    props: {
        menuPrefix: {
            type: String,
            default: '',
        },
        origin: {
            type: Object,
            default: () => ({})
        },
    },
    watch: {
        origin: {
            immediate: true,
            deep: true,
            handler (val) {
                if(Object.keys(val).length) {
                    // 按照优先级 最多展示 maxLen个图标
                    let total = 0;
                    const maxLen = 4;
                    if(val.fromClue > 0 && val.fromClue != 3 && total < maxLen) {
                        total++;
                        this.showKeysList.push('iconClue');
                    };
                    if((val.recruitLevel == 1 || val.recruitLevel == 2) && this.menuPrefix === 'my' && total < maxLen) {
                        total++;
                        this.showKeysList.push('iconRecruitLevel');
                    };
                    if(val.busiHightQuality == 1 && this.menuPrefix == 'my' && total < maxLen) {
                        total++;
                        this.showKeysList.push('iconHighQualityCustomer');
                    };
                    if(val.blockShowType >= 1 && total < maxLen) {
                        total++;
                        this.showKeysList.push('iconBlock');
                    };
                    if(val.level && total < maxLen) {
                        total++;
                        this.showKeysList.push('iconLevel');
                    };
                    if(val.isMerge == 1 && total < maxLen) {
                        total++;
                        this.showKeysList.push('iconMerge');
                    };
                    if(val.priceProtectionDO && Object.keys(val.priceProtectionDO || {}).length && total < maxLen) {
                        total++;
                        this.showKeysList.push('iconProtection');
                    };
                    if(val.customerTagVOS && val.customerTagVOS instanceof Array && val.customerTagVOS.length && total < maxLen) {
                        //total++;
                        this.showKeysList.push('iconCustom');
                        //需要判断还剩下几个名额
                        this.leftCustomIconNum = maxLen - total;
                    };
                };
            },
        }
    },
    components: {
        iconClue,
        iconRecruitLevel,
        // iconSignProbability,
        iconLevel,
        iconMerge,
        // iconCape,
        iconProtection,
        iconBlock,
        iconCustom,
        iconHighQualityCustomer,
    },
};
</script>

<style lang="less">
@import url('./index.less');
</style>